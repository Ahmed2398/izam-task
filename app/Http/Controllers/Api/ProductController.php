<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\ProductFilterRequest;
use App\Http\Resources\Product\ProductCollection;
use App\Http\Resources\Product\ProductResource;
use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class ProductController extends Controller
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
     * Display a listing of the resource.
     */
    public function index(ProductFilterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $products = $this->productService->getFilteredProducts(
            $validated['search'] ?? null,
            $validated['categories'] ?? null,
            $validated['min_price'] ?? null,
            $validated['max_price'] ?? null
        );

        return response()->json([
            'products' => ProductCollection::make($products),
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product): JsonResponse
    {
        $product = $this->productService->getProduct($product);
        
        return response()->json([
            'product' => ProductResource::make($product),
        ]);
    }
}
