<?php

namespace App\Http\Controllers;

use App\Services\UnitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function __construct(protected UnitService $service) {}

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:units,name',
        ]);

        $validated['slug'] = \Str::slug($validated['name']);
        $this->service->create($validated);

        return response()->json(['id' => \DB::getPdo()->lastInsertId(), 'name' => $validated['name'], 'slug' => $validated['slug']]);
    }
}
