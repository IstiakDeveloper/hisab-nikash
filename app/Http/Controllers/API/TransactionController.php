<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class TransactionController extends Controller
{
    /**
     * Display a listing of the transactions.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Transaction::with(['account', 'category']);

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        // Filter by type
        if ($request->has('type') && in_array($request->type, ['income', 'expense', 'transfer'])) {
            $query->where('type', $request->type);
        }

        // Filter by account
        if ($request->has('account_id')) {
            $query->where('account_id', $request->account_id);
        }

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Order by date desc by default
        $query->orderBy('date', 'desc');

        // Paginate results
        $perPage = $request->get('per_page', 15);
        $transactions = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $transactions
        ]);
    }

    /**
     * Store a newly created transaction in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'account_id' => 'required|exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            'amount' => 'required|numeric|min:0.01',
            'type' => 'required|in:income,expense,transfer',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'transfer_account_id' => 'required_if:type,transfer|exists:accounts,id|different:account_id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Find the account
        $account = Account::find($request->account_id);
        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Account not found'
            ], 404);
        }

        // Start transaction
        DB::beginTransaction();

        try {
            // Create the transaction
            $transaction = new Transaction([
                'user_id' => 1, // Default user ID since we're not using authentication
                'account_id' => $request->account_id,
                'category_id' => $request->category_id,
                'amount' => $request->amount,
                'type' => $request->type,
                'date' => $request->date,
                'description' => $request->description,
            ]);

            $transaction->save();

            // Update account balance
            if ($request->type == 'income') {
                $account->balance += $request->amount;
                $account->save();
            } elseif ($request->type == 'expense') {
                $account->balance -= $request->amount;
                $account->save();
            } elseif ($request->type == 'transfer') {
                // Make sure the transfer account exists
                $transferAccount = Account::find($request->transfer_account_id);
                if (!$transferAccount) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Transfer account not found'
                    ], 404);
                }

                // Update source account (subtract)
                $account->balance -= $request->amount;
                $account->save();

                // Update destination account (add)
                $transferAccount->balance += $request->amount;
                $transferAccount->save();

                // Create the corresponding transfer transaction
                $transferTransaction = new Transaction([
                    'user_id' => 1, // Default user ID since we're not using authentication
                    'account_id' => $request->transfer_account_id,
                    'category_id' => $request->category_id,
                    'amount' => $request->amount,
                    'type' => 'transfer',
                    'date' => $request->date,
                    'description' => 'Transfer from ' . $account->name . ' - ' . ($request->description ?? ''),
                ]);

                $transferTransaction->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction created successfully',
                'data' => $transaction->load(['account', 'category'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified transaction.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $transaction = Transaction::with(['account', 'category'])->find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $transaction
        ]);
    }

    /**
     * Update the specified transaction in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'account_id' => 'exists:accounts,id',
            'category_id' => 'nullable|exists:categories,id',
            'amount' => 'numeric|min:0.01',
            'type' => 'in:income,expense,transfer',
            'date' => 'date',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        // Disallow changing type between transfer and non-transfer
        if ($request->has('type') && $request->type != $transaction->type &&
            ($transaction->type == 'transfer' || $request->type == 'transfer')) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot change transaction type to or from transfer'
            ], 422);
        }

        // Start transaction
        DB::beginTransaction();

        try {
            $account = $transaction->account;
            $oldAmount = $transaction->amount;
            $oldType = $transaction->type;

            // Revert the effect of the old transaction
            if ($oldType == 'income') {
                $account->balance -= $oldAmount;
            } elseif ($oldType == 'expense') {
                $account->balance += $oldAmount;
            }

            // Apply changes to the transaction
            $transaction->fill($request->all());
            $transaction->save();

            // Apply the effect of the updated transaction
            if ($transaction->type == 'income') {
                $account->balance += $transaction->amount;
            } elseif ($transaction->type == 'expense') {
                $account->balance -= $transaction->amount;
            }

            $account->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction updated successfully',
                'data' => $transaction->fresh()->load(['account', 'category'])
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to update transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified transaction from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $transaction = Transaction::find($id);

        if (!$transaction) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction not found'
            ], 404);
        }

        // Start transaction
        DB::beginTransaction();

        try {
            $account = $transaction->account;

            // Revert the effect of the transaction on the account balance
            if ($transaction->type == 'income') {
                $account->balance -= $transaction->amount;
            } elseif ($transaction->type == 'expense') {
                $account->balance += $transaction->amount;
            } elseif ($transaction->type == 'transfer') {
                // For transfers, we need to handle both sides
                // Ideally, we'd need to find the matching transfer transaction as well
                return response()->json([
                    'success' => false,
                    'message' => 'Deleting transfer transactions is not supported'
                ], 422);
            }

            $account->save();
            $transaction->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete transaction',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get transactions statistics.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function statistics(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->endOfMonth()->format('Y-m-d'));

        // Total income and expenses for the period
        $totals = Transaction::whereBetween('date', [$startDate, $endDate])
            ->whereIn('type', ['income', 'expense'])
            ->select('type', DB::raw('SUM(amount) as total'))
            ->groupBy('type')
            ->get()
            ->pluck('total', 'type')
            ->toArray();

        $totalIncome = $totals['income'] ?? 0;
        $totalExpense = $totals['expense'] ?? 0;
        $netSavings = $totalIncome - $totalExpense;

        // Top expense categories
        $topExpenseCategories = Transaction::whereBetween('date', [$startDate, $endDate])
            ->where('type', 'expense')
            ->whereNotNull('category_id')
            ->select('category_id', DB::raw('SUM(amount) as total'))
            ->groupBy('category_id')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->with('category')
            ->get()
            ->map(function ($item) use ($totalExpense) {
                return [
                    'category' => $item->category->name,
                    'color' => $item->category->color,
                    'amount' => $item->total,
                    'percentage' => $totalExpense > 0 ? round(($item->total / $totalExpense) * 100, 2) : 0
                ];
            });

        // Daily spending trend
        $dailySpending = Transaction::whereBetween('date', [$startDate, $endDate])
            ->where('type', 'expense')
            ->select('date', DB::raw('SUM(amount) as total'))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'amount' => $item->total
                ];
            });

        return response()->json([
            'success' => true,
            'data' => [
                'total_income' => $totalIncome,
                'total_expense' => $totalExpense,
                'net_savings' => $netSavings,
                'savings_rate' => $totalIncome > 0 ? round(($netSavings / $totalIncome) * 100, 2) : 0,
                'top_expense_categories' => $topExpenseCategories,
                'daily_spending' => $dailySpending
            ]
        ]);
    }
}
