<?php

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\ChartOfAccountController;
use App\Models\Role;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->middleware('isLoggedIn');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/reports', function () {
        return Inertia::render('Journal/DailyReport');
    })->name('reports');

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
        'warehouses' => \App\Models\Warehouse::orderBy('name')->paginate(10)->withQueryString(),
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
    Route::delete('setting/user/{id}', fn () => Inertia::render('Setting/User/UserEdit'))->name('setting.user.destroy');
});

require __DIR__ . '/auth.php';
