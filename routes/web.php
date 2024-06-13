<?php

use App\Http\Controllers\ChartOfAccountController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/journal', function () {
        return Inertia::render('Dashboard');
    })->name('daily-report');

    Route::get('/setting', function () {
        return Inertia::render('Setting/Setting');
    })->name('setting');

    Route::get('/setting/account', [ChartOfAccountController::class, 'index'])->name('seeting.account.index');
    Route::post('/setting/account', [ChartOfAccountController::class, 'store'])->name('seeting.account.store');
    Route::put('/setting/account/{id}', [ChartOfAccountController::class, 'update'])->name('seeting.account.update');
    Route::delete('/setting/account/{id}', [ChartOfAccountController::class, 'destroy'])->name('seeting.account.destroy');
});

require __DIR__ . '/auth.php';
