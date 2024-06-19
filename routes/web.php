<?php

use App\Models\Role;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Journal;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\JournalController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\ChartOfAccountController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware('isLoggedIn');

Route::get('/dashboard', [JournalController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/reports', [JournalController::class, 'dailyReport'])->name('reports');

    Route::get('/setting', function () {
        return Inertia::render('Setting/Setting');
    })->name('setting');

    Route::get('/setting/account', [ChartOfAccountController::class, 'index'])->name('setting.account.index');
    Route::post('/setting/account', [ChartOfAccountController::class, 'store'])->name('setting.account.store');
    Route::put('/setting/account/{id}', [ChartOfAccountController::class, 'update'])->name('setting.account.update');
    Route::delete('/setting/account/{id}', [ChartOfAccountController::class, 'destroy'])->name('setting.account.destroy');

    Route::get('/setting/warehouse', [WarehouseController::class, 'index'])->name('setting.warehouse.index');
    Route::get('/setting/warehouse/{id}/edit', [WarehouseController::class, 'edit'])->name('setting.warehouse.edit');
    Route::post('/setting/warehouse', [WarehouseController::class, 'store'])->name('setting.warehouse.store');
    Route::put('/setting/warehouse/{id}', [WarehouseController::class, 'update'])->name('setting.warehouse.update');
    Route::delete('/setting/warehouse/{id}', [WarehouseController::class, 'destroy'])->name('setting.warehouse.destroy');
    Route::post('/setting/warehouse/updatebanklist', [WarehouseController::class, 'updatebanklist'])->name('setting.warehouse.updatebanklist');

    Route::get('/setting/user', function () {
        return Inertia::render('Setting/User/UserIndex', [
            'title' => 'Users',
            'users' => \App\Models\User::orderBy('name')->paginate(10)->withQueryString(),
        ]);
    })->name('setting.user');
    Route::get('setting/user/{id}/edit', fn () => Inertia::render('Setting/User/EditUser', [
        'user' => User::with('roles')->where('id', request('id'))->first(),
        'warehouses' => \App\Models\Warehouse::all(),
    ]))->name('setting.user.edit');
    Route::post('setting/user', function (Request $request) {
        // Request validation rules
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Creating or updating the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Assigning roles to the user
        Role::create([
            'user_id' => $user->id,
            'warehouse_id' => 1,
            'role' => 'Kasir'
        ]);

        // Redirecting back to the setting user route
        return redirect()->route('setting.user');
    })->name('setting.user.store');

    Route::post('/update-user-role', function (Request $request) {
        $checkUserRole = Role::where('user_id', $request->userId);
        $role = $request->role ?? $checkUserRole->role;
        $userId = $request->userId ?? $checkUserRole->user_id;
        $warehouseId = $request->warehouseId ?? $checkUserRole->warehouse_id;

        Role::where('user_id', $userId)->update([
            'warehouse_id' => $warehouseId,
            'role' => $role
        ]);

        return redirect()->back();
    })->name('update-user-role');

    Route::put('setting/user/{id}', fn () => Inertia::render('Setting/User/UserEdit'))->name('setting.user.update');
    Route::delete(
        'setting/user/{id}',
        function () {
            $user = User::find(request('id'));
            if ($user->id == Auth::user()->id) {
                return redirect()->back()->with('error', 'User cannot be deleted because it is currently logged in');
            }

            if ($user->id == 1) {
                return redirect()->back()->with('error', 'User cannot be deleted because it is default user');
            }

            // Check if user has journal entries
            $journalExists = Journal::where('user_id', request('id'))->exists();
            if ($journalExists) {
                return redirect()->back()->with('error', 'User cannot be deleted because it has journal entries');
            } else {
                $user->delete();
                Role::where('user_id', request('id'))->delete();
            }
            return redirect()->route('setting.user');
        }
    )->name('setting.user.destroy');

    Route::get('/setting/product', [ProductController::class, 'index'])->name('setting.product');
    Route::get('/setting/product/{id}/edit', [ProductController::class, 'edit'])->name('setting.product.edit');
    Route::post('/setting/product', [ProductController::class, 'store'])->name('setting.product.store');
    Route::put('/setting/product/{id}', [ProductController::class, 'update'])->name('setting.product.update');
    Route::delete('/setting/product/{id}', [ProductController::class, 'destroy'])->name('setting.product.destroy');

    Route::get('/setting/contact', [ContactController::class, 'index'])->name('setting.contact');
    Route::get('/setting/contact/{id}/edit', [ContactController::class, 'edit'])->name('setting.contact.edit');
    Route::post('/setting/contact', [ContactController::class, 'store'])->name('setting.contact.store');
    Route::put('/setting/contact/{id}', [ContactController::class, 'update'])->name('setting.contact.update');
    Route::delete('/setting/contact/{id}', [ContactController::class, 'destroy'])->name('setting.contact.destroy');

    Route::post('journal/transfer', [JournalController::class, 'transfer'])->name('journal.transfer.store');
    Route::post('journal/cash-withdrawal', [JournalController::class, 'cashWithdrawal'])->name('journal.cash-withdrawal.store');
    Route::post('journal/voucher', [JournalController::class, 'voucher'])->name('journal.voucher.store');
    Route::post('journal/deposit', [JournalController::class, 'deposit'])->name('journal.deposit.store');
    Route::post('journal/expense', [JournalController::class, 'expense'])->name('journal.expense.store');
    Route::post('journal/mutation', [JournalController::class, 'mutation'])->name('journal.mutation.store');
    Route::post('journal/admin-fee', [JournalController::class, 'adminFee'])->name('journal.admin-fee.store');
    Route::get('/journal/{id}/edit', [JournalController::class, 'edit'])->name('journal.edit');
    Route::put('/journal/{id}', [JournalController::class, 'update'])->name('journal.update');
    Route::delete('/journal/{id}', [JournalController::class, 'destroy'])->name('journal.destroy');
});

require __DIR__ . '/auth.php';
