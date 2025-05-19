<?php

declare(strict_types=1);

namespace App\Http\Resources\Order;

use App\Http\Resources\PaginationResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

final class OrderCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => OrderResource::collection($this->collection),
            ...PaginationResource::make($this->resource)->toArray($request),
        ];
    }
}
