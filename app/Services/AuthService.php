<?php

namespace App\Services;

use App\Models\User;
use App\Services\BaseService;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService extends BaseService
{
    /**
     * Attempt to authenticate a user and return token
     *
     * @param string $email
     * @param string $password
     * @return array
     * @throws ValidationException
     */
    public function login(string $email, string $password): array
    {
        if (! Auth::attempt(['email' => $email, 'password' => $password])) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        /** @var \App\Models\User $user */
        $user = Auth::user();

        return [
            'token' => $user->createToken('token-name')->plainTextToken,
            'user' => $user,
        ];
    }

    /**
     * Register a new user
     *
     * @param array $userData
     * @return array
     */
    public function register(array $userData): array
    {
        $userData['password'] = Hash::make($userData['password']);
        
        /** @var \App\Models\User $user */
        $user = User::create($userData);
        
        return [
            'token' => $user->createToken('token-name')->plainTextToken,
            'user' => $user,
        ];
    }

    /**
     * Log the user out (revoke token and invalidate session)
     * 
     * @param \Illuminate\Http\Request|null $request
     * @return void
     */
    public function logout($request = null): void
    {
        // Handle token-based logout (API)
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        
        if ($user) {
            // Delete the current access token if using token authentication
            if (method_exists($user, 'currentAccessToken') && $user->currentAccessToken()) {
                $user->currentAccessToken()->delete();
            }
            
            // Or delete all tokens if needed
            if (method_exists($user, 'tokens')) {
                $user->tokens()->delete();
            }
        }
        
        // Handle session-based logout (web)
        Auth::guard('web')->logout();
        
        // Also invalidate the session if a request is provided
        if ($request && method_exists($request, 'session')) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }
    }

    /**
     * Get the authenticated user
     * 
     * @return User
     * @throws AuthenticationException
     */
    public function getAuthenticatedUser(): User
    {
        $user = Auth::user();
        
        if (!$user) {
            throw new AuthenticationException('Unauthenticated.');
        }
        
        return $user;
    }
}
