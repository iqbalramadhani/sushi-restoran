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
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $this->service->create($validated);

        return to_route('ingredients.index')->with('success', 'Bahan baku berhasil ditambahkan.');
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
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $this->service->update($id, $validated);

        return to_route('ingredients.index')->with('success', 'Bahan baku berhasil diperbarui.');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        return to_route('ingredients.index')->with('success', 'Bahan baku berhasil dihapus.');
    }
}
