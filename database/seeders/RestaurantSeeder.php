<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Table;
use App\Models\Unit;
use Illuminate\Database\Seeder;

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

        $foods = [
            ['category_id' => 1, 'name' => 'Nasi Goreng Spesial', 'price' => 35000, 'is_available' => true],
            ['category_id' => 1, 'name' => 'Mie Goreng', 'price' => 30000, 'is_available' => true],
            ['category_id' => 1, 'name' => 'Ayam Geprek', 'price' => 28000, 'is_available' => true],
            ['category_id' => 1, 'name' => 'Sate Ayam', 'price' => 32000, 'is_available' => true],
            ['category_id' => 1, 'name' => 'Nasi Padang', 'price' => 35000, 'is_available' => true],
            ['category_id' => 2, 'name' => 'Es Teh Manis', 'price' => 8000, 'is_available' => true],
            ['category_id' => 2, 'name' => 'Jus Jeruk', 'price' => 15000, 'is_available' => true],
            ['category_id' => 2, 'name' => 'Kopi Susu', 'price' => 18000, 'is_available' => true],
            ['category_id' => 2, 'name' => 'Air Mineral', 'price' => 5000, 'is_available' => true],
            ['category_id' => 3, 'name' => 'Kentang Goreng', 'price' => 18000, 'is_available' => true],
            ['category_id' => 3, 'name' => 'Roti Bakar', 'price' => 15000, 'is_available' => true],
            ['category_id' => 4, 'name' => 'Puding Coklat', 'price' => 12000, 'is_available' => true],
            ['category_id' => 4, 'name' => 'Es Krim', 'price' => 15000, 'is_available' => true],
        ];

        foreach ($foods as $food) {
            $food['slug'] = \Str::slug($food['name']);
            Product::firstOrCreate(['slug' => $food['slug']], $food);
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
    }
}
