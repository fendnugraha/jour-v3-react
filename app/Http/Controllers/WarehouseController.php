<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Account;
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
}
