<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Tenant;
use Symfony\Component\HttpFoundation\Response;

class HandleTenancy
{
    public function handle(Request $request, Closure $next): Response
    {
        // If user is logged in, set their tenant in config
        if (auth()->check()) {
            $tenant = auth()->user()->tenant;

            if ($tenant) {
                config(['current_tenant' => $tenant]);

                // Check subscription status
                if ($tenant->subscription_status === 'trial' && $tenant->trial_ends_at < now()) {
                    return redirect()->route('subscription.expired');
                }
            }
        }

        return $next($request);
    }
}
