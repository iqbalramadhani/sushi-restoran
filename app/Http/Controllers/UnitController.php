<?php

namespace App\Http\Controllers;

use App\Services\UnitService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function __construct(protected UnitService $service) {}

    public function index()
    {
        return Inertia::render('Units/Index', [
            'units' => $this->service->getAll(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Units/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:units,name',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $this->service->create($validated);
        session()->flash('success', 'Satuan berhasil ditambahkan.');
        return redirect()->route('units.index');
    }

    public function edit(int $id)
    {
        return Inertia::render('Units/Edit', [
            'unit' => $this->service->findById($id),
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => "required|string|max:255|unique:units,name,{$id}",
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $this->service->update($id, $validated);
        session()->flash('success', 'Satuan berhasil diperbarui.');
        return redirect()->route('units.index');
    }

    public function destroy(int $id)
    {
        $this->service->delete($id);
        session()->flash('success', 'Satuan berhasil dihapus.');
        return redirect()->route('units.index');
    }
}
