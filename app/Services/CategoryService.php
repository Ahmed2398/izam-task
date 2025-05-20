<?php

namespace App\Services;

use App\Models\Category;
use App\Services\BaseService;
use Illuminate\Database\Eloquent\Collection;

class CategoryService extends BaseService
{
    /**
     * Get all categories
     */
    public function getAllCategories(): Collection
    {
        return Category::query()->get();
    }
}
