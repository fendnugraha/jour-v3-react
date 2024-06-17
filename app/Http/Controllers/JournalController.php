<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Sale;
use Inertia\Inertia;
use App\Models\Journal;
use App\Models\Product;
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
    public $perPage = 5;

    public function __construct()
    {
        $this->startDate = Carbon::now()->startOfDay();
        $this->endDate = Carbon::now()->endOfDay();
    }

    public function index()
    {
        $journals = Journal::with(['debt', 'cred', 'sale.product'])
            ->whereBetween('date_issued', [$this->startDate, $this->endDate])
            ->orderBy('id', 'desc')
            ->paginate($this->perPage, ['*'], 'journalPage');

        return Inertia::render('Dashboard', [
            'title' => 'Journal',
            'charts' => ChartOfAccount::whereIn('account_id', [1, 2])
                ->where('warehouse_id', auth()->user()->roles->first()->warehouse_id)
                ->get(),
            'journals' => $journals,
            'products' => \App\Models\Product::orderBy('name')->get(),
            'expenses' => ChartOfAccount::whereIn('account_id', range(33, 45))->get(),
            'hq' => ChartOfAccount::where('warehouse_id', 1)->get(),
            'cash' => ChartOfAccount::where('warehouse_id', auth()->user()->roles->first()->warehouse_id)->first()->acc_code
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
}
