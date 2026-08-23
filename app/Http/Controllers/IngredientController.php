<?php

namespace App\Http\Controllers;

use App\Services\IngredientService;
use App\Services\UnitService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class IngredientController extends Controller
{
    public function __construct(
        protected IngredientService $service,
        protected UnitService $unitService
    ) {}

    public function index()
    {
        return Inertia::render('Ingredients/Index', [
            'ingredients' => $this->service->getAll(),
            'low_stock_ingredients' => $this->service->getLowStockIngredients(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Ingredients/Create', [
            'units' => $this->unitService->getAll(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:10',
            'stock' => 'nullable|numeric|min:0',
            'min_stock' => 'nullable|numeric|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $validated['stock'] = $validated['stock'] ?? 0;
        $validated['min_stock'] = $validated['min_stock'] ?? 0;
        $this->service->create($validated);

        session()->flash('success', 'Bahan baku berhasil ditambahkan.');
        return inertia()->location(route('ingredients.index'));
    }

    public function edit(int $id)
    {
        $ingredient = $this->service->getAll()->first(fn($i) => $i->id === $id);
        return Inertia::render('Ingredients/Edit', [
            'ingredient' => $ingredient,
            'units' => $this->unitService->getAll(),
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'unit' => 'required|string|max:10',
            'stock' => 'nullable|numeric|min:0',
            'min_stock' => 'nullable|numeric|min:0',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $this->service->update($id, $validated);

        session()->flash('success', 'Bahan baku berhasil diperbarui.');
        return inertia()->location(route('ingredients.index'));
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        session()->flash('success', 'Bahan baku berhasil dihapus.');
        return inertia()->location(route('ingredients.index'));
    }
}
