<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\MoneyFlowController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\WalletController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Auth routes
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login']);
    Route::get('register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('register', [AuthController::class, 'register']);
});

// Protected routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Tenant routes (protected + admin only)
Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {
    Route::get('settings', [TenantController::class, 'settings'])->name('tenant.settings');
    Route::put('settings', [TenantController::class, 'update'])->name('tenant.update');
    Route::get('users', [TenantController::class, 'users'])->name('tenant.users');
    Route::post('users/invite', [TenantController::class, 'inviteUser'])->name('tenant.invite');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('wallets', [WalletController::class, 'index'])->name('wallets.index');
    Route::get('wallets/create', [WalletController::class, 'create'])->name('wallets.create');
    Route::post('wallets', [WalletController::class, 'store'])->name('wallets.store');
    Route::get('wallets/{wallet}/edit', [WalletController::class, 'edit'])->name('wallets.edit');
    Route::put('wallets/{wallet}', [WalletController::class, 'update'])->name('wallets.update');
    Route::delete('wallets/{wallet}', [WalletController::class, 'destroy'])->name('wallets.destroy');

    Route::get('Transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('Transactions/create', [TransactionController::class, 'create'])->name('transactions.create');
    Route::post('Transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('Transactions/{transaction}/edit', [TransactionController::class, 'edit'])->name('transactions.edit');
    Route::put('Transactions/{transaction}', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('Transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy');
    Route::get('Transactions/reports', [TransactionController::class, 'report'])->name('transactions.report');

    Route::get('contacts', [ContactController::class, 'index'])->name('contacts.index');
    Route::get('contacts/create', [ContactController::class, 'create'])->name('contacts.create');
    Route::post('contacts', [ContactController::class, 'store'])->name('contacts.store');
    Route::get('contacts/{contact}/edit', [ContactController::class, 'edit'])->name('contacts.edit');
    Route::put('contacts/{contact}', [ContactController::class, 'update'])->name('contacts.update');
    Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])->name('contacts.destroy');
    Route::get('contacts/show', [ContactController::class, 'show'])->name('contacts.show');

    Route::get('contacts/overview', [ContactController::class, 'overview'])->name('contacts.overview');


    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::get('categories/analysis', [CategoryController::class, 'analysis'])->name('categories.analysis');


    Route::get('/money-flows', [MoneyFlowController::class, 'index'])->name('money-flows.index');
    Route::post('/money-flows', [MoneyFlowController::class, 'store'])->name('money-flows.store');
    Route::get('/money-flows/{moneyFlow}', [MoneyFlowController::class, 'show'])->name('money-flows.show');
    Route::post('/money-flows/{moneyFlow}/payments', [MoneyFlowController::class, 'addPayment'])
        ->name('money-flows.payments.store');
    Route::patch('/money-flows/{moneyFlow}', [MoneyFlowController::class, 'update'])
        ->name('money-flows.update');
    Route::delete('/money-flows/{moneyFlow}', [MoneyFlowController::class, 'destroy'])
        ->name('money-flows.destroy');
    Route::get('/money-flows/{moneyFlow}/payments', [MoneyFlowController::class, 'payments'])
        ->name('money-flows.payments.index');



});

require __DIR__.'/auth.php';
