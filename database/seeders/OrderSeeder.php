<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        $products = Product::get();

        Order::factory(10)->for($user)->create()->each(function ($order) use ($products) {
            $order->products()->attach(
                $products->random(rand(1, 4))->pluck('id')->toArray(),
                [
                    'quantity' => rand(1, 5),
                    'price' => rand(1, 5),
                ]
            );
        });
    }
}
