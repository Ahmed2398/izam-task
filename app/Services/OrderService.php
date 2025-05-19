<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Events\OrderPlacedEvent;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Services\BaseService;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection as SupportCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class OrderService extends BaseService
{
    /**
     * Get paginated orders for a specific user
     */
    public function getUserOrders(User $user, int $page = 1): LengthAwarePaginator
    {
        $key = "orders-{$page}-{$user->id}";

        return Cache::remember($key, Carbon::now()->addMinutes(5), function () use ($user) {
            return $user->orders()
                ->with('products')
                ->latest()
                ->paginate();
        });
    }

    /**
     * Create a new order
     */
    public function createOrder(User $user, SupportCollection $productsData): void
    {
        DB::transaction(function () use ($user, $productsData): void {
            // Get available products
            $products = $this->getAvailableProducts($productsData);

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
     * Get available products based on requested quantities
     */
    private function getAvailableProducts(SupportCollection $productsData): Collection
    {
        return Product::query()
            ->whereIn('id', $productsData->pluck('id'))
            ->get()
            ->filter(fn (Product $product): bool => 
                (int) $productsData->where('id', $product->id)->value('quantity', 1) <= $product->quantity
            );
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
