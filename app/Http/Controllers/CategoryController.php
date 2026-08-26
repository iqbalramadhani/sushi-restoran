<?php

namespace App\Http\Controllers;

use App\Services\CategoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(protected CategoryService $service) {}

    public function index()
    {
        return Inertia::render('Categories/Index', [
            'categories' => $this->service->getAll(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'description' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $category = $this->service->create($validated);
        $this->logActivity('category_created', $category, $request);
        session()->flash('success', 'Kategori berhasil ditambahkan.');
        return redirect()->route('categories.index');
    }

    public function edit(int $id)
    {
        return Inertia::render('Categories/Edit', [
            'category' => $this->service->findById($id),
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => "required|string|max:255|unique:categories,name,{$id}",
            'description' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $category = $this->service->findById($id);
        $this->service->update($id, $validated);
        $this->logActivity('category_updated', $category, $request);
        session()->flash('success', 'Kategori berhasil diperbarui.');
        return redirect()->route('categories.index');
    }

    public function destroy(Request $request, int $id)
    {
        $category = $this->service->findById($id);
        $this->service->delete($id);
        $this->logActivity('category_deleted', $category, $request);
        session()->flash('success', 'Kategori berhasil dihapus.');
        return redirect()->route('categories.index');
    }
}
