<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::middleware('auth')->group(function () {
    // Dashboard/Home route
    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');

    // Transaction routes
    Route::post('/transaction', [HomeController::class, 'storeTransaction'])->name('transaction.store');
    Route::put('/transaction/{transaction}', [HomeController::class, 'updateTransaction'])->name('transaction.update');
    Route::delete('/transaction/{transaction}', [HomeController::class, 'deleteTransaction'])->name('transaction.delete');

    // Account routes
    Route::post('/account', [HomeController::class, 'storeAccount'])->name('account.store');
    Route::put('/account/{account}', [HomeController::class, 'updateAccount'])->name('account.update');
    Route::delete('/account/{account}', [HomeController::class, 'deleteAccount'])->name('account.delete');

    // Category routes
    Route::post('/category', [HomeController::class, 'storeCategory'])->name('category.store');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
