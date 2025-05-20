<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Events\OrderPlacedEvent;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\BaseService;
use App\Services\ProductService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\DB;

class OrderService extends BaseService
{
    /**
     * @var ProductService
     */
    protected $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Get paginated orders for a specific user
     */
    public function getUserOrders(User $user, int $page = 1): LengthAwarePaginator
    {
        return $user->orders()
            ->with('products')
            ->latest()
            ->paginate();
    }

    /**
     * Create a new order
     */
    public function createOrder(User $user, SupportCollection $productsData): void
    {
        DB::transaction(function () use ($user, $productsData): void {
            // Get available products
            $products = $this->productService->getAvailableProducts($productsData);

            // Create order
            $order = $this->storeOrder($user, $products, $productsData);

            // Update product quantities
            $this->updateProductQuantities($products, $productsData);

            // Attach products to order
            $this->attachProductsToOrder($order, $products, $productsData);

            // Dispatch event
            OrderPlacedEvent::dispatch($order);
        });
    }



    /**
     * Store the order in database
     */
    private function storeOrder(User $user, Collection $products, SupportCollection $productsData): Order
    {
        return $user->orders()->create([
            'total_price' => $products->sum('price') * $productsData->sum('quantity'),
            'status' => OrderStatus::PENDING,
        ]);
    }

    /**
     * Update product quantities after order
     */
    private function updateProductQuantities(Collection $products, SupportCollection $productsData): void
    {
        $products->each(fn (Product $product) => $product->decrement(
            'quantity',
            $productsData->where('id', $product->id)->value('quantity', 1)
        ));
    }

    /**
     * Attach products to the order
     */
    private function attachProductsToOrder(Order $order, Collection $products, SupportCollection $productsData): void
    {
        $orderProducts = $products->mapWithKeys(fn (Product $product): array => [
            $product->id => [
                'price' => $product->price,
                'quantity' => $productsData->where('id', $product->id)->value('quantity', 1),
            ],
        ])->toArray();

        $order->products()->attach($orderProducts);
    }
}
