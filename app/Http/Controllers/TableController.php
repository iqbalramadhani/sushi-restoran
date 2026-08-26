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

    public function occupy(Request $request, int $id)
    {
        $table = $this->service->findById($id);
        $this->service->occupy($id);
        $this->logActivity('table_occupied', $table, $request);
        session()->flash('success', 'Table is now occupied.');
        return redirect()->route('tables.index');
    }

    public function free(Request $request, int $id)
    {
        $table = $this->service->findById($id);
        $this->service->free($id);
        $this->logActivity('table_freed', $table, $request);
        session()->flash('success', 'Table is now available.');
        return redirect()->route('tables.index');
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

        $table = $this->service->create($validated);
        $this->logActivity('table_created', $table, $request);
        session()->flash('success', 'Table created successfully.');
        return redirect()->route('tables.index');
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

        $table = $this->service->findById($id);
        $this->service->update($id, $validated);
        $this->logActivity('table_updated', $table, $request);
        session()->flash('success', 'Table updated successfully.');
        return redirect()->route('tables.index');
    }

    public function destroy(Request $request, int $id)
    {
        $table = $this->service->findById($id);
        $this->service->destroy($id);
        $this->logActivity('table_deleted', $table, $request);
        session()->flash('success', 'Table deleted successfully.');
        return redirect()->route('tables.index');
    }
}
