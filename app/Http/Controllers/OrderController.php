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

        session()->flash('success', 'Order created successfully.');
        return redirect()->route('orders.show', $order->id);
    }

    public function show(int $id)
    {
        $order = $this->service->find($id);
        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    public function process(int $id)
    {
        $this->service->processOrder($id);
        session()->flash('success', 'Order is now being processed.');
        return redirect()->route('orders.index');
    }

    public function complete(int $id)
    {
        $this->service->completeOrder($id);
        session()->flash('success', 'Order completed.');
        return redirect()->route('orders.index');
    }

    public function cancel(int $id)
    {
        $this->service->cancelOrder($id);
        session()->flash('success', 'Order cancelled.');
        return redirect()->route('orders.index');
    }
}
