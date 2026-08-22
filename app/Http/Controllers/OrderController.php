<?php

namespace App\Http\Controllers;

use App\Services\OrderService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function __construct(protected OrderService $service) {}

    public function index()
    {
        return Inertia::render('Orders/Index', [
            'orders' => $this->service->getAll(),
            'pending' => $this->service->getPending(),
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Orders/Create', [
            'tables' => \App\Models\Table::where('status', 'available')->get(),
            'products' => \App\Models\Product::where('is_available', true)->with('category')->get(),
            'table_id' => $request->query('table_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $order = $this->service->createOrder(
            $validated['table_id'],
            $request->user()->id,
            $validated['items']
        );

        return to_route('orders.show', $order->id)->with('success', 'Order created successfully.');
    }

    public function show(int $id)
    {
        $order = $this->service->find($id);
        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    public function process(int $id)
    {
        $this->service->processOrder($id);
        return to_route('orders.index')->with('success', 'Order is now being processed.');
    }

    public function complete(int $id)
    {
        $this->service->completeOrder($id);
        return to_route('orders.index')->with('success', 'Order completed.');
    }

    public function cancel(int $id)
    {
        $this->service->cancelOrder($id);
        return to_route('orders.index')->with('success', 'Order cancelled.');
    }
}
