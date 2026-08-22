<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(protected ProductService $service) {}

    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => $this->service->getAll(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $validated['slug'] = \Str::slug($validated['name']);
        $this->service->create($validated);

        return to_route('products.index')->with('success', 'Product created successfully.');
    }

    public function edit(int $id)
    {
        $product = $this->service->getAll()->first(fn($p) => $p->id === $id);
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_available' => 'boolean',
        ]);

        $validated['slug'] = \Str::slug($validated['name']);
        $this->service->update($id, $validated);

        return to_route('products.index')->with('success', 'Product updated successfully.');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return to_route('products.index')->with('success', 'Product deleted successfully.');
    }
}
