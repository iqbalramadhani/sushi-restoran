<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Table;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Makanan', 'slug' => 'makanan'],
            ['name' => 'Minuman', 'slug' => 'minuman'],
            ['name' => 'Camilan', 'slug' => 'camilan'],
            ['name' => 'Dessert', 'slug' => 'dessert'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug' => $cat['slug']], $cat);
        }

        $tables = [
            ['name' => 'A1', 'capacity' => 2, 'seat_count' => 2],
            ['name' => 'A2', 'capacity' => 2, 'seat_count' => 2],
            ['name' => 'B1', 'capacity' => 4, 'seat_count' => 4],
            ['name' => 'B2', 'capacity' => 4, 'seat_count' => 4],
            ['name' => 'C1', 'capacity' => 6, 'seat_count' => 6],
            ['name' => 'C2', 'capacity' => 6, 'seat_count' => 6],
        ];

        foreach ($tables as $table) {
            Table::firstOrCreate(['name' => $table['name']], $table);
        }

        $units = [
            ['name' => 'Gram', 'slug' => 'gram'],
            ['name' => 'Mililiter', 'slug' => 'ml'],
            ['name' => 'Potong', 'slug' => 'piece'],
            ['name' => 'Buah', 'slug' => 'buah'],
            ['name' => 'Sendok', 'slug' => 'sendok'],
            ['name' => 'Cakar', 'slug' => 'cakar'],
        ];

        foreach ($units as $unit) {
            Unit::firstOrCreate(['slug' => $unit['slug']], $unit);
        }

        User::firstOrCreate(
            ['email' => 'admin@restoran.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
    }
}
