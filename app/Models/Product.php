<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'price',
        'quantity',
        'category_id',
    ];

    /**
     * The orders that belong to the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany<Order, covariant $this>
     */
    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class)
            ->withPivot(['quantity', 'price'])
            ->using(OrderProduct::class);
    }

    /**
     * Get the Product image
     *
     * @return Attribute<string, never>
     */
    protected function image(): Attribute
    {
        // Generate a reliable product image based on product ID
        return Attribute::get(function (): string {
            // Use product ID to ensure consistent but different images
            $id = $this->id % 20 + 1; // Get a number between 1-20
            
            // Use placeholder.com which is reliable for testing
            return "https://picsum.photos/seed/product{$id}/400/400";
        });
    }

    /**
     * Get the category that owns the Product
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Category, covariant $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
