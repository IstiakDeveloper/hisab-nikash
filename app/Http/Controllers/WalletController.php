<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WalletController extends Controller
{
    public function index()
    {
        $wallets = Wallet::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('Wallets/Index', [
            'wallets' => $wallets
        ]);
    }

    public function create()
    {
        return Inertia::render('Wallets/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:cash,bank,bkash,credit_card,other',
            'balance' => 'numeric|min:0'
        ]);

        $wallet = Wallet::create([
            'tenant_id' => Auth::user()->tenant_id,
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'type' => $validated['type'],
            'balance' => $validated['balance'] ?? 0
        ]);

        return redirect()->route('wallets.index')
            ->with('success', 'Wallet created successfully.');
    }

    public function edit(Wallet $wallet)
    {
        $this->authorize('view', $wallet);

        return Inertia::render('Wallets/Edit', [
            'wallet' => $wallet
        ]);
    }

    public function update(Request $request, Wallet $wallet)
    {
        $this->authorize('update', $wallet);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:cash,bank,bkash,credit_card,other',
            'balance' => 'numeric|min:0'
        ]);

        $wallet->update($validated);

        return redirect()->route('wallets.index')
            ->with('success', 'Wallet updated successfully.');
    }

    public function destroy(Wallet $wallet)
    {
        $this->authorize('delete', $wallet);

        $wallet->delete();

        return redirect()->route('wallets.index')
            ->with('success', 'Wallet deleted successfully.');
    }

    public function dashboard()
    {
        $wallets = Wallet::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->get();

        $totalBalance = $wallets->sum('balance');

        return Inertia::render('Dashboard', [
            'wallets' => $wallets,
            'totalBalance' => $totalBalance
        ]);
    }
}
