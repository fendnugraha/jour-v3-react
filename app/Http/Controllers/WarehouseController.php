<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Account;
use App\Models\Journal;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use App\Models\ChartOfAccount;
use Illuminate\Support\Facades\DB;

class WarehouseController extends Controller
{
    public function index()
    {
        $warehouses = Warehouse::with('ChartOfAccount')->orderBy('name')->paginate(10)->withQueryString();
        return Inertia::render('Setting/Warehouse/Warehouse', [
            'warehouses' => $warehouses,
            'chartofaccounts' => ChartOfAccount::where('account_id', 1)->where('warehouse_id', 0)->get(),
            'accounts' => Account::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|unique:warehouses,code|size:3',
            'name' => 'required|min:5|max:255|unique:warehouses,name',
            'location' => 'required|min:5|max:255',
            'chart_of_account_id' => 'required|exists:chart_of_accounts,id', // Ensure chart of account exists
        ]);

        try {
            DB::beginTransaction();

            // Create and save the warehouse
            $warehouse = Warehouse::create($request->all());

            // Update the related ChartOfAccount with the warehouse ID
            ChartOfAccount::where('id', $request->chart_of_account_id)
                ->update(['warehouse_id' => $warehouse->id]);

            DB::commit();

            // Redirect with success message
            return redirect()->back()->with('message', 'Warehouse created successfully');
        } catch (\Exception $e) {
            DB::rollBack();

            // Redirect with error message
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|min:5|max:255',
            'location' => 'required|min:5|max:255',
            'chart_of_account_id' => 'required|exists:chart_of_accounts,id', // Ensure chart of account exists
        ]);

        try {
            DB::beginTransaction();

            // Find the warehouse by ID
            $warehouse = Warehouse::findOrFail($id);

            // Update the old chart of account associated with the warehouse to have no warehouse ID
            ChartOfAccount::where('id', $warehouse->chart_of_account_id)->update(['warehouse_id' => 0]);

            // Update the warehouse with the new data
            $warehouse->update([
                'name' => $request->name,
                'location' => $request->location,
                'chart_of_account_id' => $request->chart_of_account_id
            ]);

            // Update the new chart of account with the warehouse ID
            ChartOfAccount::where('id', $request->chart_of_account_id)->update(['warehouse_id' => $warehouse->id]);

            // Commit the transaction
            DB::commit();

            // Redirect with success message
            return redirect()->back()->with('success', 'Gudang ' . $warehouse->name . ' Telah Diupdate');
        } catch (\Exception $e) {
            // Roll back the transaction in case of exception
            DB::rollBack();

            // Redirect with error message
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function destroy($id)
    {
        $warehouse = Warehouse::find($id);
        $journalExists = Journal::where('warehouse_id', $warehouse->id)->exists();
        // dd($journalExists);
        if ($journalExists || $warehouse->id == 1) {
            return redirect()->back()->with('error', 'Warehouse cannot be deleted because it has journal entries');
        } else {
            $warehouse->delete();
            ChartOfAccount::where('id', $warehouse->chart_of_account_id)->update(['warehouse_id' => 0]);
            return redirect()->back()->with('message', 'Warehouse deleted successfully');
        }
    }

    public function edit($id)
    {
        $warehouse = Warehouse::find($id);
        return Inertia::render('Setting/Warehouse/EditWarehouse', [
            'warehouse' => $warehouse,
            'chartofaccounts' => ChartOfAccount::where('account_id', 1)->whereIn('warehouse_id', [$id, 0])->get(),
            'cashbanks' => ChartOfAccount::whereIn('account_id', [1, 2])->orderBy('acc_code', 'asc')->paginate(10)->withQueryString(),
        ]);
    }

    public function updatebanklist(Request $request)
    {
        $checkAccount = ChartOfAccount::where('id', $request->accountId)->where('warehouse_id', $request->warehouseId)->exists();

        if ($checkAccount) {
            ChartOfAccount::where('id', $request->accountId)->where('warehouse_id', $request->warehouseId)->update([
                'warehouse_id' => 0
            ]);
        } else {
            ChartOfAccount::where('id', $request->accountId)->update([
                'warehouse_id' => $request->warehouseId
            ]);
        }

        return redirect()->back();
    }
}
