<?php

namespace App\Http\Controllers;

use App\Models\MoneyFlow;
use App\Models\MoneyFlowPayment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MoneyFlowController extends Controller
{
    public function index()
    {
        $receivable = MoneyFlow::receivable()
            ->select('id', 'person_name', 'amount', 'remaining_amount', 'date', 'status', 'due_date')
            ->latest()
            ->get();

        $payable = MoneyFlow::payable()
            ->select('id', 'person_name', 'amount', 'remaining_amount', 'date', 'status', 'due_date')
            ->latest()
            ->get();

        $summary = [
            'total_receivable' => $receivable->sum('remaining_amount'),
            'total_payable' => $payable->sum('remaining_amount'),
            'net_balance' => $receivable->sum('remaining_amount') - $payable->sum('remaining_amount'),
            'overdue_receivable' => MoneyFlow::receivable()->overdue()->sum('remaining_amount'),
            'overdue_payable' => MoneyFlow::payable()->overdue()->sum('remaining_amount'),
        ];

        return Inertia::render('MoneyFlow/Index', [
            'receivable' => $receivable,
            'payable' => $payable,
            'summary' => $summary
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'person_name' => 'required|string|max:255',
            'type' => 'required|in:give,receive',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'due_date' => 'nullable|date|after:date',
            'note' => 'nullable|string'
        ]);

        $moneyFlow = MoneyFlow::create([
            ...$validated,
            'tenant_id' => auth()->user()->tenant_id,
            'user_id' => auth()->id(),
            'remaining_amount' => $validated['amount']
        ]);

        return back()->with('success', 'Record added successfully.');
    }

    public function addPayment(Request $request, MoneyFlow $moneyFlow)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0|max:' . $moneyFlow->remaining_amount,
            'date' => 'required|date',
            'payment_method' => 'nullable|string',
            'note' => 'nullable|string'
        ]);

        $moneyFlow->payments()->create($validated);

        return back()->with('success', 'Payment recorded successfully.');
    }

    public function show(MoneyFlow $moneyFlow)
    {
        $moneyFlow->load(['payments' => function ($query) {
            $query->latest();
        }]);

        return Inertia::render('MoneyFlow/Show', [
            'moneyFlow' => $moneyFlow
        ]);
    }
}
