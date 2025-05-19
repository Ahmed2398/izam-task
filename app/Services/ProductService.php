<?php

namespace App\Services;

use App\Models\Product;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class ProductService extends BaseService
{
    /**
     * Get filtered and paginated products
     */
    public function getFilteredProducts(?string $search = null, ?string $categories = null, ?float $minPrice = null, ?float $maxPrice = null): LengthAwarePaginator
    {
        return Product::query()
            ->with('category')
            ->when(
                $search,
                fn (Builder $builder, string $search): Builder => $builder->whereLike('name', "%$search%")
            )
            ->when(
                $categories !== null,
                fn (Builder $builder): Builder => $builder->whereIn(
                    'category_id',
                    explode(',', $categories),
                )
            )
            ->when(
                $minPrice !== null && $maxPrice !== null,
                fn (Builder $builder): Builder => $builder->whereBetween('price', [
                    $minPrice,
                    $maxPrice,
                ])
            )
            ->latest()
            ->paginate();
    }

    /**
     * Get a specific product with related data
     */
    public function getProduct(Product $product): Product
    {
        return $product->load('category');
    }
}
