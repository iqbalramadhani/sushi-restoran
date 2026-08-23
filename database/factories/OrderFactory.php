<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Table;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    public function definition(): array
    {
        return [
            'table_id' => Table::factory(),
            'user_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'processed', 'completed']),
            'total' => $this->faker->randomFloat(2, 10, 500),
        ];
    }
}
