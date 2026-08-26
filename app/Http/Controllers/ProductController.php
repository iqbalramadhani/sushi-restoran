<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Ingredient;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(protected ProductService $service) {}

    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => $this->service->getAllWithOrderStatus(),
            'low_stock_products' => app(\App\Services\IngredientService::class)->getLowStockIngredients(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create', [
            'categories' => Category::all(),
            'ingredients' => Ingredient::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
            'ingredients' => 'nullable|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'nullable|numeric|min:0',
            'ingredients.*.unit' => 'nullable|string|max:10',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $product = $this->service->create($validated);

        if (!empty($validated['ingredients'])) {
            $product->ingredients()->syncWithoutDetaching(
                collect($validated['ingredients'])->mapWithKeys(fn($ing) => [$ing['ingredient_id'] => ['quantity' => $ing['quantity'] ?? 0, 'unit' => $ing['unit'] ?? 'g']])->toArray()
            );
        }

        $this->logActivity('product_created', $product, $request);
        session()->flash('success', 'Product created successfully.');
        return redirect()->route('products.index');
    }

    public function edit(int $id)
    {
        $product = $this->service->getAll()->first(fn($p) => $p->id === $id);
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => Category::all(),
            'ingredients' => Ingredient::all(),
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
            'ingredients' => 'nullable|array',
            'ingredients.*.ingredient_id' => 'required|exists:ingredients,id',
            'ingredients.*.quantity' => 'nullable|numeric|min:0',
            'ingredients.*.unit' => 'nullable|string|max:10',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $product = $this->service->getAll()->first(fn($p) => $p->id === $id);
        $this->service->update($id, $validated);

        $this->logActivity('product_updated', $product, $request);
        session()->flash('success', 'Product updated successfully.');
        return redirect()->route('products.index');
    }

    public function destroy(Request $request, int $id)
    {
        $product = $this->service->getAll()->first(fn($p) => $p->id === $id);
        $this->service->delete($id);
        $this->logActivity('product_deleted', $product, $request);
        session()->flash('success', 'Product deleted successfully.');
        return redirect()->route('products.index');
    }

    public function softDestroy(Request $request, int $id)
    {
        $product = $this->service->getAll()->first(fn($p) => $p->id === $id);
        $this->service->softDelete($id);
        $this->logActivity('product_soft_deleted', $product, $request);
        session()->flash('success', 'Product moved to trash.');
        return redirect()->route('products.index');
    }
}
