<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreOrderRequest;
use App\Http\Resources\Order\OrderCollection;
use App\Http\Resources\Order\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * @var OrderService
     */
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $page = $request->integer('page', 1);
        
        $orders = $this->orderService->getUserOrders($user, $page);

        return response()->json([
            'orders' => OrderCollection::make($orders),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreOrderRequest $request): Response
    {
        $user = Auth::user();
        $productsData = $request->safe()->collect('products');
        
        $this->orderService->createOrder($user, $productsData);

        return response()->noContent();
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order): JsonResponse
    {
        abort_if(
            $order->user_id !== Auth::id(),
            Response::HTTP_FORBIDDEN,
        );

        $order->load('products.category');

        return response()->json([
            'order' => OrderResource::make($order),
        ]);
    }
}
