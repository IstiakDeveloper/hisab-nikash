<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TenantController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'tenant.admin']);
    }

    public function settings()
    {
        $tenant = auth()->user()->tenant;
        return Inertia::render('Tenant/Settings', [
            'tenant' => $tenant,
            'subscription' => [
                'status' => $tenant->subscription_status,
                'trial_ends_at' => $tenant->trial_ends_at,
                'subscription_ends_at' => $tenant->subscription_ends_at,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $tenant = auth()->user()->tenant;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                'unique:tenants,domain,' . $tenant->id
            ],
        ]);

        $tenant->update($validated);

        return back()->with('success', 'Settings updated successfully');
    }

    public function users()
    {
        $users = auth()->user()->tenant->users()
            ->select('id', 'name', 'email', 'role', 'created_at')
            ->paginate(10);

        return Inertia::render('Tenant/Users', [
            'users' => $users
        ]);
    }

    public function inviteUser(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'role' => 'required|in:user,admin'
        ]);

        // Generate invitation token
        $token = \Str::random(32);

        DB::table('user_invitations')->insert([
            'tenant_id' => auth()->user()->tenant_id,
            'email' => $validated['email'],
            'role' => $validated['role'],
            'token' => $token,
            'created_at' => now(),
            'expires_at' => now()->addDays(7)
        ]);

        // Send invitation email
        // TODO: Implement email sending

        return back()->with('success', 'Invitation sent successfully');
    }

    public function acceptInvitation($token)
    {
        $invitation = DB::table('user_invitations')
            ->where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$invitation) {
            abort(404, 'Invalid or expired invitation');
        }

        return Inertia::render('Auth/AcceptInvitation', [
            'invitation' => [
                'email' => $invitation->email,
                'token' => $token
            ]
        ]);
    }

    public function completeInvitation(Request $request, $token)
    {
        $invitation = DB::table('user_invitations')
            ->where('token', $token)
            ->where('expires_at', '>', now())
            ->first();

        if (!$invitation) {
            abort(404, 'Invalid or expired invitation');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = User::create([
            'tenant_id' => $invitation->tenant_id,
            'name' => $validated['name'],
            'email' => $invitation->email,
            'password' => Hash::make($validated['password']),
            'role' => $invitation->role
        ]);

        DB::table('user_invitations')->where('token', $token)->delete();

        Auth::login($user);

        return redirect('/dashboard');
    }
}
