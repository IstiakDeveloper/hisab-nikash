<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AccountController extends Controller
{
    /**
     * Display a listing of the accounts.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $accounts = Account::all();

        return response()->json([
            'success' => true,
            'data' => $accounts
        ]);
    }

    /**
     * Store a newly created account in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'balance' => 'required|numeric',
            'account_type' => 'required|string|in:cash,bank,mobile_banking,card',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $account = Account::create([
            'user_id' => 1, // Default user ID since we're not using authentication
            'name' => $request->name,
            'balance' => $request->balance,
            'account_type' => $request->account_type,
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Account created successfully',
            'data' => $account
        ], 201);
    }

    /**
     * Display the specified account.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Account not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $account
        ]);
    }

    /**
     * Update the specified account in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Account not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'balance' => 'numeric',
            'account_type' => 'string|in:cash,bank,mobile_banking,card',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $account->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Account updated successfully',
            'data' => $account
        ]);
    }

    /**
     * Remove the specified account from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $account = Account::find($id);

        if (!$account) {
            return response()->json([
                'success' => false,
                'message' => 'Account not found'
            ], 404);
        }

        $account->delete();

        return response()->json([
            'success' => true,
            'message' => 'Account deleted successfully'
        ]);
    }

    /**
     * Get total balance across all accounts.
     *
     * @return \Illuminate\Http\Response
     */
    public function totalBalance()
    {
        $totalBalance = Account::sum('balance');

        return response()->json([
            'success' => true,
            'total_balance' => $totalBalance
        ]);
    }

    /**
     * Get accounts grouped by type.
     *
     * @return \Illuminate\Http\Response
     */
    public function accountsByType()
    {
        $types = ['cash', 'bank', 'mobile_banking', 'card'];
        $result = [];

        foreach ($types as $type) {
            $accounts = Account::where('account_type', $type)->get();

            $result[$type] = [
                'accounts' => $accounts,
                'total' => $accounts->sum('balance')
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $result
        ]);
    }
}
