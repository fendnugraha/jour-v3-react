<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Journal;
use Illuminate\Http\Request;
use App\Models\ChartOfAccount;

class JournalController extends Controller
{

    public function index()
    {
        return Inertia::render('Dashboard', [
            'title' => 'Journal',
            'charts' => ChartOfAccount::where('account_id', 2)->where('warehouse_id', Auth()->user()->roles->first()->warehouse_id)->get(),
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
}
