<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * @var AuthService
     */
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }
    
    /**
     * Handle the incoming request.
     */
    public function __invoke(): JsonResponse
    {
        $user = $this->authService->getAuthenticatedUser();
        
        return response()->json([
            'user' => UserResource::make($user),
        ]);
    }
}
