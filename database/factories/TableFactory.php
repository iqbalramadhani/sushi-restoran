<?php

namespace Database\Factories;

use App\Models\Table;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<table>
 */
class TableFactory extends Factory
{
    protected $model = Table::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->word(),
            'capacity' => $this->faker->numberBetween(1, 12),
            'seat_count' => $this->faker->numberBetween(1, 12),
            'status' => $this->faker->randomElement(['available', 'occupied']),
        ];
    }
}
