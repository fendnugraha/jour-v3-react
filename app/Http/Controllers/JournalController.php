<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Journal;
use Illuminate\Http\Request;
use App\Models\ChartOfAccount;
use Carbon\Carbon;

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
        $journals = Journal::with(['debt', 'cred'])
            ->whereBetween('date_issued', [$this->startDate, $this->endDate])
            ->orderBy('id', 'desc')
            ->paginate($this->perPage, ['*'], 'journalPage');

        return Inertia::render('Dashboard', [
            'title' => 'Journal',
            'charts' => ChartOfAccount::where('account_id', 2)
                ->where('warehouse_id', auth()->user()->roles->first()->warehouse_id)
                ->get(),
            'journals' => $journals
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
}
