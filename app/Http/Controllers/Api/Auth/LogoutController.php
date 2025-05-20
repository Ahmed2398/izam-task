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
        // For token-based authentication, we only need to revoke the current token
        if ($request->user() && $request->user()->currentAccessToken()) {
            // Only delete the current token, not all tokens
            $request->user()->currentAccessToken()->delete();
        }
        
        return response()->noContent();
    }
}
