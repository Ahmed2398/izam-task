<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = ['Clothing', 'Shoes', 'Accessories', 'T-Shirts'];

        foreach ($categories as $category) {
            Category::factory()->hasProducts(5)->create([
                'name' => $category,
            ]);
        }
    }
}
