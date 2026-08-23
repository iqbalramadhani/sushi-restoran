<?php

namespace App\Http\Controllers;

use App\Services\TableService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TableController extends Controller
{
    public function __construct(protected TableService $service) {}

    public function index()
    {
        return Inertia::render('Tables/Index', [
            'tables' => $this->service->getAll(),
        ]);
    }

    public function occupy(int $id)
    {
        $this->service->occupy($id);
        session()->flash('success', 'Table is now occupied.');
        return inertia()->location(route('tables.index'));
    }

    public function free(int $id)
    {
        $this->service->free($id);
        session()->flash('success', 'Table is now available.');
        return inertia()->location(route('tables.index'));
    }

    public function create()
    {
        return Inertia::render('Tables/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:tables,name',
            'capacity' => 'required|integer|min:1',
            'seat_count' => 'required|integer|min:1',
        ]);

        $this->service->create($validated);
        session()->flash('success', 'Table created successfully.');
        return inertia()->location(route('tables.index'));
    }

    public function edit(int $id)
    {
        return Inertia::render('Tables/Edit', [
            'table' => $this->service->findById($id),
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'name' => "required|string|max:255|unique:tables,name,{$id}",
            'capacity' => 'required|integer|min:1',
            'seat_count' => 'required|integer|min:1',
        ]);

        $this->service->update($id, $validated);
        session()->flash('success', 'Table updated successfully.');
        return inertia()->location(route('tables.index'));
    }

    public function destroy(int $id)
    {
        $this->service->destroy($id);
        session()->flash('success', 'Table deleted successfully.');
        return inertia()->location(route('tables.index'));
    }
}
