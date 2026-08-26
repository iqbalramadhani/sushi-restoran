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
            'products' => \App\Models\Product::where('is_available', true)->with('category', 'ingredients')->get(),
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

        try {
            $order = $this->service->createOrder(
                $validated['table_id'],
                $request->user()->id,
                $validated['items']
            );

            $this->logActivity('order_created', $order, $request);
            session()->flash('success', 'Order created successfully.');
            return redirect()->route('orders.show', $order->id);
        } catch (\Exception $e) {
            return back()->withErrors(['stock' => $e->getMessage()]);
        }
    }

    public function show(int $id)
    {
        $order = $this->service->find($id);
        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    public function process(Request $request, int $id)
    {
        $order = $this->service->find($id);
        $this->service->processOrder($id);
        $this->logActivity('order_processed', $order, $request);
        session()->flash('success', 'Order is now being processed.');
        return redirect()->route('orders.index');
    }

    public function complete(Request $request, int $id)
    {
        $order = $this->service->find($id);
        $this->service->completeOrder($id);
        $this->logActivity('order_completed', $order, $request);
        session()->flash('success', 'Order completed.');
        return redirect()->route('orders.index');
    }

    public function cancel(Request $request, int $id)
    {
        $order = $this->service->find($id);
        try {
            $this->service->cancelOrder($id);
            $this->logActivity('order_cancelled', $order, $request);
            session()->flash('success', 'Order cancelled.');
        } catch (\Exception $e) {
            session()->flash('error', $e->getMessage());
        }
        return redirect()->route('orders.index');
    }
}
