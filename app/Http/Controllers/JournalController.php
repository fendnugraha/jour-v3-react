<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Sale;
use Inertia\Inertia;
use App\Models\Journal;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use App\Models\ChartOfAccount;
use Illuminate\Support\Facades\DB;

class JournalController extends Controller
{
    public $startDate;
    public $endDate;
    public $search = '';
    public $is_taken = '';
    public $is_free;
    public $warehouse_id;
    public $perPage;
    public $cash_account;

    public function __construct()
    {
        $this->startDate = Carbon::now()->startOfDay();
        $this->endDate = Carbon::now()->endOfDay();
        $this->perPage = 5;
        $this->warehouse_id = Auth()->user()->roles->first()->warehouse_id;
        $this->cash_account = Auth()->user()->roles->first()->warehouse->ChartOfAccount->acc_code;
    }

    public function index(Request $request)
    {
        $journal = new Journal();
        $today = Carbon::now();
        $userWarehouseId = Auth()->user()->roles->first()->warehouse_id;
        $charts = ChartOfAccount::whereIn('account_id', [1, 2])
            ->where(fn ($query) => auth()->user()->roles->role !== 'Administrator' ? $query->where('warehouse_id', $userWarehouseId) : $query)
            ->get();

        $this->search = request('search');
        $this->is_taken = request('is_taken');
        $this->is_free = request('is_free');
        $startDate = request('start_date') ? Carbon::parse(request('start_date'))->startOfDay() : $this->startDate;
        $endDate = request('end_date') ? Carbon::parse(request('end_date'))->endOfDay() : $this->endDate;
        $this->perPage = request('perPage') ? request('perPage') : $this->perPage;
        $this->warehouse_id = request('warehouse_id') ? (request('warehouse_id') == "All" ? "All" : request('warehouse_id')) : $this->warehouse_id;
        $this->cash_account = request('account_id') ? (request('account_id') == "All" ? "All" : request('account_id')) : $this->cash_account;


        $transaction = $journal->with(['debt', 'cred', 'sale.product'])
            ->whereBetween('date_issued', [$startDate, $endDate])
            ->where(fn ($query) => $this->warehouse_id == "All" ? $query : $query->where('warehouse_id', $this->warehouse_id))
            ->where(fn ($query) => $this->cash_account == "All" ?
                $query->where('debt_code', request('account_id'))
                ->orWhere('cred_code', request('account_id')) : $query)
            ->where('status', 'like', '%' . $this->is_taken . '%')
            ->where(fn ($query) => $this->is_free ? $query->where('fee_amount', 0) : $query)
            ->filterJournals(['search' => $this->search])
            ->orderBy('id', 'desc')->paginate($this->perPage, ['*'], 'journalPage')->withQueryString();

        $journalTotal = $journal->whereBetween('date_issued', [$startDate, $endDate])->where(fn ($query) => request('account_id') ?
            $query->where('debt_code', request('account_id'))
            ->orWhere('cred_code', request('account_id')) : $query)->get();

        $initBalanceDate = Carbon::parse($startDate)->subDay(1)->endOfDay();
        $initBalance = $this->cashBalance($initBalanceDate)->where(fn ($query) => auth()->user()->roles->role !== 'Administrator' ? $query->where('warehouse_id', $userWarehouseId) : $query);

        return Inertia::render('Dashboard', [
            'title' => 'Journal',
            'charts' => $charts,
            'journals' => $transaction,
            'journalsTotal' => $journalTotal,
            'products' => \App\Models\Product::orderBy('name')->get(),
            'expenses' => ChartOfAccount::whereIn('account_id', range(33, 45))->get(),
            'hq' => ChartOfAccount::where('warehouse_id', 1)->get(),
            'warehouses' => \App\Models\Warehouse::orderBy('name')->get(),
            'cash' => ChartOfAccount::where('warehouse_id', $userWarehouseId)->first()->acc_code,
            'accounts' => $this->cashBalance($today)->where('warehouse_id', $userWarehouseId),
            'initBalance' => $initBalance,
            'wh' => $this->warehouse_id,
            'wh_account' => $this->cash_account
        ]);
    }

    public function transfer(Request $request)
    {
        $journal = new Journal();

        $request->validate([
            'date_issued' => 'required',
            'cred_code' => 'required',
            'amount' => 'required',
            'fee_amount' => 'required',
            'custName' => 'required|regex:/^[a-zA-Z0-9\s]+$/|min:3|max:255',
        ]);

        $warehouse = Auth()->user()->roles->first()->warehouse_id;
        $account = ChartOfAccount::where('warehouse_id', $warehouse)->first()->acc_code;
        $description = $request->description == '' ? 'Kirim Uang' . ' - ' . strtoupper($request->custName) : $request->description . ' - ' . strtoupper($request->custName);

        $journal->invoice = $journal->invoice_journal();
        $journal->date_issued = $request->date_issued;
        $journal->debt_code = $account;
        $journal->cred_code = $request->cred_code;
        $journal->amount = $request->amount;
        $journal->fee_amount = $request->fee_amount;
        $journal->trx_type = 'Transfer Uang';
        $journal->description = $description;
        $journal->user_id = Auth()->user()->id;
        $journal->warehouse_id = Auth()->user()->roles->first()->warehouse_id;
        $journal->save();

        return redirect()->route('dashboard')->with('success', 'Journal created successfully');
    }

    public function cashWithdrawal(Request $request)
    {
        $journal = new Journal();

        $request->validate([
            'date_issued' => 'required',
            'debt_code' => 'required',
            'amount' => 'required',
            'fee_amount' => 'required',
        ]);

        $warehouse = Auth()->user()->roles->first()->warehouse_id;
        $account = ChartOfAccount::where('warehouse_id', $warehouse)->first()->acc_code;

        $status = $request->is_taken ? 2 : 1;
        $journal->invoice = $journal->invoice_journal();
        $journal->date_issued = $request->date_issued;
        $journal->debt_code = $request->debt_code;
        $journal->cred_code = $account;
        $journal->amount = $request->amount;
        $journal->fee_amount = $request->fee_amount;
        $journal->trx_type = 'Tarik Tunai';
        $journal->status = $status;
        $journal->description = $request->description ?? 'Penarikan tunai';
        $journal->user_id = Auth()->user()->id;
        $journal->warehouse_id = Auth()->user()->roles->first()->warehouse_id;
        $journal->save();

        return redirect()->route('dashboard')->with('success', 'Journal created successfully');
    }

    public function voucher(Request $request)
    {
        $request->validate([
            'qty' => 'required|numeric',
            'price' => 'required|numeric',
            'product_id' => 'required',
        ]);

        // $modal = $request->modal * $request->qty;
        $price = $request->price * $request->qty;
        $cost = Product::find($request->product_id)->cost;
        $modal = $cost * $request->qty;

        $description = $request->description ?? "Penjualan Voucher & SP";
        $fee = $price - $modal;
        $invoice = new Journal();
        $invoice->invoice = $invoice->invoice_journal();

        try {
            DB::beginTransaction();
            $journal = new journal();
            $journal->date_issued = $request->date_issued;
            $journal->invoice = $invoice->invoice;
            $journal->debt_code = "10600-001";
            $journal->cred_code = "10600-001";
            $journal->amount = $modal;
            $journal->fee_amount = $fee;
            $journal->description = $description;
            $journal->trx_type = 'Voucher & SP';
            $journal->user_id = Auth()->user()->id;
            $journal->warehouse_id = Auth()->user()->roles->first()->warehouse_id;
            $journal->save();

            $sale = new Sale();
            $sale->date_issued = $request->date_issued;
            $sale->invoice = $invoice->invoice;
            $sale->product_id = $request->product_id;
            $sale->quantity = $request->qty;
            $sale->price = $request->price;
            $sale->cost = $cost;
            $sale->warehouse_id = Auth()->user()->roles->first()->warehouse_id;
            $sale->user_id = Auth()->user()->id;
            $sale->save();

            $sold = Product::find($request->product_id)->sold + $request->qty;
            Product::find($request->product_id)->update(['sold' => $sold]);

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Journal created successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'cost' => 'required|numeric',
            'price' => 'required|numeric',
        ]);

        // $modal = $request->modal * $request->qty;
        $price = $request->price;
        $cost = $request->cost;

        $description = $request->description ?? "Penjualan Pulsa Dll";
        $fee = $price - $cost;
        $invoice = new Journal();
        $invoice->invoice = $invoice->invoice_journal();

        $journal = new journal();
        $journal->date_issued = $request->date_issued;
        $journal->invoice = $invoice->invoice;
        $journal->debt_code = "10600-001";
        $journal->cred_code = "10600-001";
        $journal->amount = $cost;
        $journal->fee_amount = $fee;
        $journal->description = $description;
        $journal->trx_type = 'Deposit';
        $journal->user_id = Auth()->user()->id;
        $journal->warehouse_id = Auth()->user()->roles->first()->warehouse_id;
        $journal->save();

        return redirect()->route('dashboard')->with('success', 'Journal created successfully');
    }

    public function expense(Request $request)
    {
        $journal = new Journal();

        $request->validate([
            'date_issued' => 'required',
            'debt_code' => 'required',
            'amount' => 'required',
            'description' => 'required',
        ]);

        $warehouse = Auth()->user()->roles->first()->warehouse_id;
        $account = ChartOfAccount::where('warehouse_id', $warehouse)->first()->acc_code;

        $journal->invoice = $journal->invoice_journal();
        $journal->date_issued = $request->date_issued;
        $journal->debt_code = $request->debt_code;
        $journal->cred_code = $account;
        $journal->amount = 0;
        $journal->fee_amount = -$request->amount;
        $journal->trx_type = 'Pengeluaran';
        $journal->description = $request->description;
        $journal->user_id = Auth()->user()->id;
        $journal->warehouse_id = Auth()->user()->roles->first()->warehouse_id;
        $journal->save();

        return redirect()->route('dashboard')->with('success', 'Journal created successfully');
    }

    public function adminFee(Request $request)
    {
        $journal = new Journal();

        $request->validate([
            'date_issued' => 'required',
            'cred_code' => 'required',
            'amount' => 'required',
        ]);

        $warehouse = Auth()->user()->roles->first()->warehouse_id;
        $account = ChartOfAccount::where('warehouse_id', $warehouse)->first()->acc_code;

        $journal->invoice = $journal->invoice_journal();
        $journal->date_issued = $request->date_issued;
        $journal->debt_code = $account;
        $journal->cred_code = $request->cred_code;
        $journal->amount = $request->amount;
        $journal->fee_amount = -$request->amount;
        $journal->trx_type = 'Pengeluaran';
        $journal->description = $request->description ?? 'Pengeluaran Biaya Admin Bank';
        $journal->user_id = Auth()->user()->id;
        $journal->warehouse_id = Auth()->user()->roles->first()->warehouse_id;
        $journal->save();

        return redirect()->route('dashboard')->with('success', 'Journal created successfully');
    }

    public function mutation(Request $request)
    {
        $journal = new Journal();

        $request->validate([
            'date_issued' => 'required',
            'debt_code' => 'required',
            'cred_code' => 'required',
            'amount' => 'required',
        ]);

        $journal->invoice = $journal->invoice_journal();
        $journal->date_issued = $request->date_issued;
        $journal->debt_code = $request->debt_code;
        $journal->cred_code = $request->cred_code;
        $journal->amount = $request->amount;
        $journal->fee_amount = 0;
        $journal->trx_type = 'Mutasi Kas';
        $journal->description = $request->description ?? 'Pengembalian saldo kas & bank ke rekening pusat';
        $journal->user_id = Auth()->user()->id;
        $journal->warehouse_id = Auth()->user()->roles->first()->warehouse_id;
        $journal->save();

        return redirect()->route('dashboard')->with('success', 'Journal created successfully');
    }

    public function destroy($id)
    {
        $journal = journal::find($id);
        try {
            DB::beginTransaction();

            $journal->delete();
            Sale::where('invoice', $journal->invoice)->delete();

            DB::commit();

            return redirect()->route('dashboard')->with('success', 'Journal deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function cashBalance($endDate)
    {
        $journal = new Journal();
        // $startDate = Carbon::now()->startOfDay();
        $endDate = $endDate ?? Carbon::now()->endOfDay();

        $userWarehouseId = Auth()->user()->roles->first()->warehouse_id;

        $transactions = $journal->with(['debt', 'cred'])
            ->selectRaw('debt_code, cred_code, SUM(amount) as total, warehouse_id')
            ->whereBetween('date_issued', [Carbon::create(0000, 1, 1, 0, 0, 0)->startOfDay(), $endDate])
            ->groupBy('debt_code', 'cred_code', 'warehouse_id')
            ->get();

        $chartOfAccounts = ChartOfAccount::with('account')->get();

        foreach ($chartOfAccounts as $value) {
            $debit = $transactions->where('debt_code', $value->acc_code)->sum('total');
            $credit = $transactions->where('cred_code', $value->acc_code)->sum('total');

            // @ts-ignore
            $value->balance = ($value->account->status == "D") ? ($value->st_balance + $debit - $credit) : ($value->st_balance + $credit - $debit);
        }

        return $chartOfAccounts;
    }

    public function mutationHistory(Request $request)
    {
        $journal = new Journal();
        $startDate = Carbon::parse($this->endDate)->startOfDay();
        $endDate = Carbon::parse($this->endDate)->endOfDay();

        $chartOfAccounts = ChartOfAccount::where(fn ($query) => Auth()->user()->roles->role !== 'Administrator' ? $query->where('warehouse_id', $this->warehouse_id) : $query)->orderBy('acc_code', 'asc')->get();
        $journal = new Journal();
        $journals = $journal->with('debt.account', 'cred.account', 'warehouse', 'user')
            ->whereBetween('date_issued', [$startDate, $endDate])
            ->where(function ($query) {
                $query->where('invoice', 'like', '%' . $this->search . '%')
                    ->orWhere('description', 'like', '%' . $this->search . '%')
                    ->orWhere('amount', 'like', '%' . $this->search . '%');
            })
            ->where(function ($query) use ($request) {
                $query->where('debt_code', $request->account)
                    ->orWhere('cred_code', $request->account);
            })
            ->orderBy('date_issued', 'asc')
            ->paginate($this->perPage, ['*'], 'mutationHistory');

        $total = $journal->with('debt.account', 'cred.account', 'warehouse', 'user')->where('debt_code', $request->account)
            ->whereBetween('date_issued', [$startDate, $endDate])
            ->orWhere('cred_code', $request->account)
            ->WhereBetween('date_issued', [$startDate, $endDate])
            ->orderBy('date_issued', 'asc')
            ->get();

        $initBalanceDate = Carbon::parse($startDate)->subDay(1)->endOfDay();

        $debt_total = $total->where('debt_code', $request->account)->sum('amount');
        $cred_total = $total->where('cred_code', $request->account)->sum('amount');

        return [
            'accounts' => $chartOfAccounts,
            'journals' => $journals,
            'initBalance' => $journal->endBalanceBetweenDate($request->account, '0000-00-00', $initBalanceDate),
            'endBalance' => $journal->endBalanceBetweenDate($request->account, '0000-00-00', $endDate),
            'debt_total' => $debt_total,
            'cred_total' => $cred_total
        ];
    }

    public function dailyReport(Request $request)
    {
        $journal = new Journal();
        $startDate = Carbon::parse($this->endDate)->startOfDay();
        $endDate = Carbon::parse($this->endDate)->endOfDay();

        $trx = Journal::whereBetween('date_issued', [$startDate, $endDate])
            ->where(fn ($query) => $this->warehouse_id == "" ?
                $query : $query->where('warehouse_id', $this->warehouse_id))
            ->get();

        $salesCount = $trx->whereIn('trx_type', ['Transfer Uang', 'Tarik Tunai', 'Deposit', 'Voucher & SP'])->Count();

        $data = [
            'totalCash' => $this->cashBalance($endDate)->where('warehouse_id', $this->warehouse_id)->where('account_id', 1)->sum('balance'),
            'totalBank' => $this->cashBalance($endDate)->where('warehouse_id', $this->warehouse_id)->where('account_id', 2)->sum('balance'),
            'totalTransfer' => $trx->where('trx_type', 'Transfer Uang')->sum('amount'),
            'totalCashWithdrawal' => $trx->where('trx_type', 'Tarik Tunai')->sum('amount'),
            'totalCashDeposit' => $trx->where('trx_type', 'Deposit')->sum('amount'),
            'totalVoucher' => $trx->where('trx_type', 'Voucher & SP')->sum('amount'),
            'totalExpense' => $trx->where('trx_type', 'Pengeluaran')->sum('fee_amount'),
            'totalFee' => $trx->where('fee_amount', '>', 0)->sum('fee_amount'),
            'profit' => $trx->sum('fee_amount'),
            'salesCount' => $salesCount,
            'warehouses' => Warehouse::all(),
        ];

        $charts = $this->cashBalance($endDate)->where('warehouse_id', $this->warehouse_id);

        return Inertia::render('Journal/DailyReport', [
            'data' => $data,
            'charts' => $charts,
            'trx' => $trx->where('trx_type', 'Mutasi Kas'),
        ]);
    }
}
