<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Contact;
use App\Models\ContactTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->withCount(['transactions as total_transactions'])
            ->get();

        return Inertia::render('Contacts/Index', [
            'contacts' => $contacts
        ]);
    }

    public function create()
    {
        return Inertia::render('Contacts/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'current_balance' => 'nullable|numeric'
        ]);

        $contact = Contact::create([
            'tenant_id' => Auth::user()->tenant_id,
            'user_id' => Auth::id(),
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? null,
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'current_balance' => $validated['current_balance'] ?? 0
        ]);

        return redirect()->route('contacts.index')
            ->with('success', 'Contact created successfully.');
    }

    public function show(Contact $contact)
    {
        $this->authorize('view', $contact);

        // Fetch contact transactions
        $transactions = ContactTransaction::where('contact_id', $contact->id)
            ->where('tenant_id', Auth::user()->tenant_id)
            ->where('user_id', Auth::id())
            ->orderBy('date', 'desc')
            ->paginate(20);

        return Inertia::render('Contacts/Show', [
            'contact' => $contact,
            'transactions' => $transactions
        ]);
    }

    public function edit(Contact $contact)
    {
        $this->authorize('view', $contact);

        return Inertia::render('Contacts/Edit', [
            'contact' => $contact
        ]);
    }

    public function update(Request $request, Contact $contact)
    {
        $this->authorize('update', $contact);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'current_balance' => 'nullable|numeric'
        ]);

        $contact->update($validated);

        return redirect()->route('contacts.index')
            ->with('success', 'Contact updated successfully.');
    }

    public function destroy(Contact $contact)
    {
        $this->authorize('delete', $contact);

        // Check if contact has any transactions before deleting
        $hasTransactions = ContactTransaction::where('contact_id', $contact->id)->exists();

        if ($hasTransactions) {
            return back()->with('error', 'Cannot delete contact with existing transactions.');
        }

        $contact->delete();

        return redirect()->route('contacts.index')
            ->with('success', 'Contact deleted successfully.');
    }

    public function addTransaction(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'wallet_id' => 'required|exists:wallets,id',
            'type' => 'required|in:give,receive',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
            'note' => 'nullable|string'
        ]);

        DB::transaction(function () use ($contact, $validated) {
            // Create contact transaction
            $contactTransaction = ContactTransaction::create([
                'tenant_id' => Auth::user()->tenant_id,
                'user_id' => Auth::id(),
                'contact_id' => $contact->id,
                'wallet_id' => $validated['wallet_id'],
                'type' => $validated['type'],
                'amount' => $validated['amount'],
                'date' => $validated['date'],
                'note' => $validated['note'] ?? null
            ]);

            // Update contact balance
            if ($validated['type'] === 'give') {
                $contact->current_balance -= $validated['amount'];
            } else {
                $contact->current_balance += $validated['amount'];
            }
            $contact->save();

            // Update wallet balance (optional, depending on your requirements)
            $wallet = Wallet::findOrFail($validated['wallet_id']);
            if ($validated['type'] === 'receive') {
                $wallet->balance += $validated['amount'];
            } else {
                $wallet->balance -= $validated['amount'];
            }
            $wallet->save();
        });

        return back()->with('success', 'Transaction added successfully.');
    }

    public function overview()
    {
        $userId = Auth::id();
        $tenantId = Auth::user()->tenant_id;

        // Total amount given
        $totalGiven = ContactTransaction::where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->where('type', 'give')
            ->sum('amount');

        // Total amount received
        $totalReceived = ContactTransaction::where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->where('type', 'receive')
            ->sum('amount');

        // Contacts with highest balances
        $topContacts = Contact::where('tenant_id', $tenantId)
            ->where('user_id', $userId)
            ->orderByDesc('current_balance')
            ->limit(5)
            ->get();

        return Inertia::render('Contacts/Overview', [
            'total_given' => $totalGiven,
            'total_received' => $totalReceived,
            'top_contacts' => $topContacts
        ]);
    }
}
