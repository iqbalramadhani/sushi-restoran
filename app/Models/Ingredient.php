<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ingredient extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'slug', 'unit', 'stock', 'min_stock'];

    protected $casts = [
        'stock' => 'float',
        'min_stock' => 'float',
    ];

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'product_ingredient')
            ->withPivot('id', 'quantity', 'unit')
            ->withTimestamps();
    }
}
