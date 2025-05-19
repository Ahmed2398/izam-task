<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;

class LogoutController extends Controller
{
    /**
     * Handle the API logout request by revoking tokens and clearing cookies.
     */
    public function __invoke(Request $request): Response
    {
        // 1. Revoke all tokens if using token-based auth
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }
        
        // 2. Logout from the session if using session-based auth
        Auth::guard('web')->logout();
        
        // 3. Clear the session
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        // 4. Clear all cookies related to authentication
        $cookies = $request->cookies->all();
        $response = response()->noContent();
        
        // Clear Laravel session cookie
        $response->cookie(Cookie::forget('laravel_session'));
        
        // Clear Sanctum cookie if using SPA authentication
        $response->cookie(Cookie::forget('XSRF-TOKEN'));
        
        // Clear any other authentication-related cookies
        if (isset($cookies['remember_web'])) {
            $response->cookie(Cookie::forget('remember_web'));
        }
        
        return $response;
    }
}
