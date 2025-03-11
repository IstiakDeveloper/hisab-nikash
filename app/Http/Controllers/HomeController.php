<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Category;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home dashboard with all financial data.
     */
    public function index()
    {
        $user = Auth::user();

        // Get user accounts with balance
        $accounts = Account::where('user_id', $user->id)->get();
        $totalBalance = $accounts->sum('balance');

        // Get categories
        $expenseCategories = Category::where('user_id', $user->id)
            ->where('type', 'expense')
            ->orderBy('name')
            ->get();

        $incomeCategories = Category::where('user_id', $user->id)
            ->where('type', 'income')
            ->orderBy('name')
            ->get();

        // Get recent transactions
        $recentTransactions = Transaction::with(['account', 'category'])
            ->where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        // Get monthly summary (current month)
        $currentMonthStart = Carbon::now()->startOfMonth();
        $currentMonthEnd = Carbon::now()->endOfMonth();

        $monthlyIncome = Transaction::where('user_id', $user->id)
            ->where('type', 'income')
            ->whereBetween('date', [$currentMonthStart, $currentMonthEnd])
            ->sum('amount');

        $monthlyExpense = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereBetween('date', [$currentMonthStart, $currentMonthEnd])
            ->sum('amount');

        // Get expense by categories for the current month
        $expenseByCategory = Transaction::where('user_id', $user->id)
            ->where('type', 'expense')
            ->whereBetween('date', [$currentMonthStart, $currentMonthEnd])
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->with('category')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category ? $item->category->name : 'Uncategorized',
                    'color' => $item->category ? $item->category->color : '#888888',
                    'total' => $item->total,
                ];
            });

        // Get monthly expense trend (last 6 months)
        $monthlyTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();

            $income = Transaction::where('user_id', $user->id)
                ->where('type', 'income')
                ->whereBetween('date', [$monthStart, $monthEnd])
                ->sum('amount');

            $expense = Transaction::where('user_id', $user->id)
                ->where('type', 'expense')
                ->whereBetween('date', [$monthStart, $monthEnd])
                ->sum('amount');

            $monthlyTrend[] = [
                'month' => $month->format('M'),
                'income' => $income,
                'expense' => $expense,
            ];
        }

        return Inertia::render('home', [
            'accounts' => $accounts,
            'totalBalance' => $totalBalance,
            'expenseCategories' => $expenseCategories,
            'incomeCategories' => $incomeCategories,
            'recentTransactions' => $recentTransactions,
            'monthlyIncome' => $monthlyIncome,
            'monthlyExpense' => $monthlyExpense,
            'expenseByCategory' => $expenseByCategory,
            'monthlyTrend' => $monthlyTrend,
        ]);
    }

    /**
     * Store a new transaction.
     */
    public function storeTransaction(Request $request)
    {
        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:income,expense,transfer',
            'date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        $validated['user_id'] = Auth::id();

        $transaction = Transaction::create($validated);

        // Account balance will be updated automatically via model events

        return redirect()->back()->with('success', 'Transaction added successfully!');
    }

    /**
     * Store a new account.
     */
    public function storeAccount(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric',
            'account_type' => 'required|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $validated['user_id'] = Auth::id();

        Account::create($validated);

        return redirect()->back()->with('success', 'Account added successfully!');
    }

    /**
     * Store a new category.
     */
    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:expense,income',
            'color' => 'nullable|string|max:20',
            'icon' => 'nullable|string|max:50',
        ]);

        $validated['user_id'] = Auth::id();

        // Generate a random color if not provided
        if (empty($validated['color'])) {
            $colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
            $validated['color'] = $colors[array_rand($colors)];
        }

        Category::create($validated);

        return redirect()->back()->with('success', 'Category added successfully!');
    }

    /**
     * Update transaction.
     */
    public function updateTransaction(Request $request, Transaction $transaction)
    {
        // Check if the transaction belongs to the user
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:income,expense,transfer',
            'date' => 'required|date',
            'description' => 'nullable|string|max:255',
        ]);

        // Save old amount and type to adjust account balance
        $oldAmount = $transaction->amount;
        $oldType = $transaction->type;
        $oldAccountId = $transaction->account_id;

        // Update transaction
        $transaction->update($validated);

        // If account changed, we need to adjust both old and new account
        if ($oldAccountId !== $validated['account_id']) {
            // Revert effect on old account
            $oldAccount = Account::find($oldAccountId);
            if ($oldType === 'income') {
                $oldAccount->balance -= $oldAmount;
            } elseif ($oldType === 'expense') {
                $oldAccount->balance += $oldAmount;
            }
            $oldAccount->save();

            // Apply effect on new account
            $newAccount = Account::find($validated['account_id']);
            if ($validated['type'] === 'income') {
                $newAccount->balance += $validated['amount'];
            } elseif ($validated['type'] === 'expense') {
                $newAccount->balance -= $validated['amount'];
            }
            $newAccount->save();
        }
        // If amount or type changed but account is the same
        elseif ($oldAmount !== $validated['amount'] || $oldType !== $validated['type']) {
            $account = Account::find($validated['account_id']);

            // Revert old transaction effect
            if ($oldType === 'income') {
                $account->balance -= $oldAmount;
            } elseif ($oldType === 'expense') {
                $account->balance += $oldAmount;
            }

            // Apply new transaction effect
            if ($validated['type'] === 'income') {
                $account->balance += $validated['amount'];
            } elseif ($validated['type'] === 'expense') {
                $account->balance -= $validated['amount'];
            }

            $account->save();
        }

        return redirect()->back()->with('success', 'Transaction updated successfully!');
    }

    /**
     * Delete transaction.
     */
    public function deleteTransaction(Transaction $transaction)
    {
        // Check if the transaction belongs to the user
        if ($transaction->user_id !== Auth::id()) {
            abort(403);
        }

        // Transaction will revert account balance via model events
        $transaction->delete();

        return redirect()->back()->with('success', 'Transaction deleted successfully!');
    }

    /**
     * Update account.
     */
    public function updateAccount(Request $request, Account $account)
    {
        // Check if the account belongs to the user
        if ($account->user_id !== Auth::id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric',
            'account_type' => 'required|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $account->update($validated);

        return redirect()->back()->with('success', 'Account updated successfully!');
    }

    /**
     * Delete account.
     */
    public function deleteAccount(Account $account)
    {
        // Check if the account belongs to the user
        if ($account->user_id !== Auth::id()) {
            abort(403);
        }

        // Check if there are transactions for this account
        $transactionCount = Transaction::where('account_id', $account->id)->count();
        if ($transactionCount > 0) {
            return redirect()->back()->with('error', 'Cannot delete account with transactions. Please delete transactions first or transfer them to another account.');
        }

        $account->delete();

        return redirect()->back()->with('success', 'Account deleted successfully!');
    }
}
