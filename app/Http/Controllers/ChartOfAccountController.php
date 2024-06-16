<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Account;
use App\Models\Journal;
use Illuminate\Http\Request;
use App\Models\ChartOfAccount;

class ChartOfAccountController extends Controller
{
    public $search = '';

    public function index(Request $request)
    {
        $chartOfAccounts = ChartOfAccount::with('account')
            ->filterAccount(request()->only(['search']))
            ->orderBy('acc_code', 'asc')
            ->paginate(10)->withQueryString();
        return Inertia::render('Setting/Account/AccountTable', [
            'chartofaccounts' => $chartOfAccounts,
            'accounts' => Account::all(),
        ]);
    }

    public function store(Request $request)
    {
        $chartOfAccount = new ChartOfAccount();
        $request->validate([
            'name' => 'required|unique:chart_of_accounts,acc_name',
            'account' => 'required',
            'st_balance' => 'numeric',
        ]);

        $chartOfAccount->create([
            'acc_code' => $chartOfAccount->acc_code($request->account),
            'acc_name' => $request->name,
            'account_id' => $request->account,
            'st_balance' => $request->st_balance ?? 0,
        ]);

        return redirect()->back()->with('message', 'Account created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|unique:chart_of_accounts,acc_name,' . $id,
            'st_balance' => 'numeric',
        ]);
        $chartOfAccount = ChartOfAccount::find($id);
        $chartOfAccount->update([
            'acc_name' => $request->name,
            'st_balance' => $request->st_balance ?? 0,
        ]);
        return redirect()->back()->with('message', 'Account updated successfully');
    }

    public function destroy($id)
    {
        $account = ChartOfAccount::findOrFail($id);
        if ($account) {
            $journalExists = Journal::where('debt_code', $account->acc_code)
                ->orWhere('cred_code', $account->acc_code)
                ->exists();
            if ($journalExists) {
                return redirect()->back()->with('message', 'Account cannot be deleted because it is in use');
            } else {
                $account->delete();
                return redirect()->back()->with('message', 'Account deleted successfully');
            }
        }
    }
}
