<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfTenantExists
{
    public function handle(Request $request, Closure $next): Response
    {
        // If user is logged in but doesn't have a tenant, redirect to tenant creation
        if (auth()->check() && !auth()->user()->tenant) {
            return redirect()->route('tenant.create');
        }

        // If on login/register page but already has tenant, redirect to dashboard
        if (auth()->check() && auth()->user()->tenant) {
            if ($request->routeIs('login') || $request->routeIs('register')) {
                return redirect()->route('dashboard');
            }
        }

        return $next($request);
    }
}
