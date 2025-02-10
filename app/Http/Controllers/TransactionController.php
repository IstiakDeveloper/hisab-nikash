<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Wallet;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaction::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->with(['wallet', 'category'])
            ->orderBy('date', 'desc');

        // Filter by wallet
        if ($request->has('wallet_id')) {
            $query->where('wallet_id', $request->wallet_id);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filter by date range
        if ($request->has(['start_date', 'end_date'])) {
            $query->whereBetween('date', [$request->start_date, $request->end_date]);
        }

        $transactions = $query->paginate(20);
        $wallets = Wallet::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'wallets' => $wallets,
            'stats' => $this->calculateTransactionStats()
        ]);
    }

    public function create()
    {
        $wallets = Wallet::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->get();

        $categories = Category::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('Transactions/Create', [
            'wallets' => $wallets,
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'wallet_id' => 'required|exists:wallets,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'category_id' => 'nullable|exists:categories,id',
            'source' => 'nullable|string|max:255',
            'note' => 'nullable|string'
        ]);

        $transaction = Transaction::create([
            'tenant_id' => Auth::user()->tenant_id,
            'user_id' => Auth::id(),
            'wallet_id' => $validated['wallet_id'],
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'date' => $validated['date'],
            'category_id' => $validated['category_id'] ?? null,
            'source' => $validated['source'] ?? null,
            'note' => $validated['note'] ?? null
        ]);

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction added successfully.');
    }

    public function edit(Transaction $transaction)
    {
        $this->authorize('view', $transaction);

        $wallets = Wallet::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->get();

        $categories = Category::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
            'wallets' => $wallets,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $this->authorize('update', $transaction);

        $validated = $request->validate([
            'wallet_id' => 'required|exists:wallets,id',
            'type' => 'required|in:income,expense',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'category_id' => 'nullable|exists:categories,id',
            'source' => 'nullable|string|max:255',
            'note' => 'nullable|string'
        ]);

        DB::transaction(function () use ($transaction, $validated) {
            // Revert previous wallet balance
            $originalWallet = Wallet::findOrFail($transaction->wallet_id);
            if ($transaction->type === 'income') {
                $originalWallet->balance -= $transaction->amount;
            } else {
                $originalWallet->balance += $transaction->amount;
            }
            $originalWallet->save();

            // Update transaction
            $transaction->update([
                'wallet_id' => $validated['wallet_id'],
                'type' => $validated['type'],
                'amount' => $validated['amount'],
                'date' => $validated['date'],
                'category_id' => $validated['category_id'] ?? null,
                'source' => $validated['source'] ?? null,
                'note' => $validated['note'] ?? null
            ]);

            // Update new wallet balance
            $newWallet = Wallet::findOrFail($validated['wallet_id']);
            if ($validated['type'] === 'income') {
                $newWallet->balance += $validated['amount'];
            } else {
                $newWallet->balance -= $validated['amount'];
            }
            $newWallet->save();
        });

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction updated successfully.');
    }

    public function destroy(Transaction $transaction)
    {
        $this->authorize('delete', $transaction);

        DB::transaction(function () use ($transaction) {
            // Revert wallet balance
            $wallet = Wallet::findOrFail($transaction->wallet_id);
            if ($transaction->type === 'income') {
                $wallet->balance -= $transaction->amount;
            } else {
                $wallet->balance += $transaction->amount;
            }
            $wallet->save();

            // Delete transaction
            $transaction->delete();
        });

        return redirect()->route('transactions.index')
            ->with('success', 'Transaction deleted successfully.');
    }

    private function calculateTransactionStats()
    {
        $userId = Auth::id();
        $tenantId = Auth::user()->tenant_id;

        // Total income this month
        $monthlyIncome = Transaction::where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->where('type', 'income')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');

        // Total expense this month
        $monthlyExpense = Transaction::where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');

        // Net balance this month
        $netBalance = $monthlyIncome - $monthlyExpense;

        return [
            'monthly_income' => $monthlyIncome,
            'monthly_expense' => $monthlyExpense,
            'net_balance' => $netBalance
        ];
    }

    public function report(Request $request)
    {
        $userId = Auth::id();
        $tenantId = Auth::user()->tenant_id;

        // Aggregate transactions by category
        $categorySummary = Transaction::where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->where('type', 'expense')
            ->select(
                'category_id',
                DB::raw('SUM(amount) as total_amount'),
                DB::raw('COUNT(*) as transaction_count')
            )
            ->groupBy('category_id')
            ->with('category')
            ->get();

        // Time-based analysis
        $monthlyTrend = Transaction::where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->select(
                DB::raw('YEAR(date) as year'),
                DB::raw('MONTH(date) as month'),
                DB::raw('SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) as total_income'),
                DB::raw('SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) as total_expense')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        return Inertia::render('Transactions/Report', [
            'category_summary' => $categorySummary,
            'monthly_trend' => $monthlyTrend
        ]);
    }
}
