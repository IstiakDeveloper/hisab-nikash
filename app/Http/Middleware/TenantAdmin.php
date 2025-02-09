<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        if (!$user->tenant) {
            return redirect()->route('tenant.create');
        }

        if (!$user->isAdmin()) {
            abort(403, 'Unauthorized action. Admin access required.');
        }

        return $next($request);
    }
}
