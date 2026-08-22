import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Product, Table } from '@/types';

interface Props {
    tables: Table[];
    products: Product[];
    table_id?: number;
}

interface CartItem {
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
}

export default function OrderCreate({ tables, products, table_id }: Props) {
    const [form, setForm] = useState({ table_id: table_id ?? '' as string | number, items: [] as CartItem[] });
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const [selectedQuantity, setSelectedQuantity] = useState(1);

    const groupedProducts = useMemo(() => {
        const groups: Record<number, { name: string; items: Product[] }> = {};
        products.forEach(p => {
            const catId = p.category?.id ?? 0;
            if (!groups[catId]) groups[catId] = { name: p.category?.name ?? 'Lainnya', items: [] };
            groups[catId].items.push(p);
        });
        return groups;
    }, [products]);

    const addToOrder = () => {
        if (!selectedProductId) return;
        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;
        const existing = form.items.find(i => i.product_id === product.id);
        if (existing) {
            setForm(prev => ({ ...prev, items: prev.items.map(i => i.product_id === product.id ? { ...i, quantity: i.quantity + selectedQuantity } : i) }));
        } else {
            setForm(prev => ({ ...prev, items: [...prev.items, { product_id: product.id, product_name: product.name, price: product.price, quantity: selectedQuantity }] }));
        }
        setSelectedProductId(0);
        setSelectedQuantity(1);
    };

    const removeFromOrder = (index: number) => {
        setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
    };

    const total = useMemo(() => form.items.reduce((sum, item) => sum + item.price * item.quantity, 0), [form.items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.table_id) { alert('Pilih meja terlebih dahulu'); return; }
        if (form.items.length === 0) { alert('Tambahkan minimal 1 produk'); return; }
        router.post(route('orders.store'), { table_id: Number(form.table_id), items: form.items.map(i => ({ product_id: i.product_id, quantity: i.quantity })) });
    };

    return (
        <>
            <Head title="Buat Order" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Buat Order</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-white shadow-sm sm:rounded-lg p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Pilih Meja</label>
                                    <select value={form.table_id} onChange={(e) => setForm(prev => ({ ...prev, table_id: e.target.value }))} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option value="">-- Pilih Meja --</option>
                                        {tables.filter(t => t.status === 'available').map(table => <option key={table.id} value={table.id}>{table.name} ({table.capacity} kursi)</option>)}
                                    </select>
                                </div>
                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-semibold text-gray-700 mb-3">Pilih Produk</h4>
                                    <div className="flex gap-2 mb-4">
                                        <select value={selectedProductId} onChange={(e) => setSelectedProductId(Number(e.target.value))} className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                            <option value={0}>Pilih produk...</option>
                                            {Object.entries(groupedProducts).map(([catId, group]) => (
                                                <optgroup key={catId} label={group.name}>
                                                    {group.items.map(product => <option key={product.id} value={product.id}>{product.name} - Rp {Number(product.price).toLocaleString('id-ID')}</option>)}
                                                </optgroup>
                                            ))}
                                        </select>
                                        <input type="number" min={1} value={selectedQuantity} onChange={(e) => setSelectedQuantity(Number(e.target.value))} className="w-20 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" placeholder="Qty" />
                                        <button onClick={addToOrder} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">+ Tambah</button>
                                    </div>
                                </div>
                                {Object.entries(groupedProducts).map(([catId, group]) => (
                                    <div key={catId} className="mt-4">
                                        <h5 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{group.name}</h5>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {group.items.map(product => (
                                                <button key={product.id} onClick={() => { setSelectedProductId(product.id); setSelectedQuantity(1); addToOrder(); }} className="p-3 text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                                    <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                                                    <div className="text-blue-600 font-semibold text-sm">Rp {Number(product.price).toLocaleString('id-ID')}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="bg-white shadow-sm sm:rounded-lg p-6 h-fit">
                                <h4 className="font-semibold text-gray-800 mb-4">Ringkasan Order</h4>
                                {form.items.length === 0 ? (
                                    <div className="text-gray-500 text-sm text-center py-8">Belum ada item</div>
                                ) : (
                                    <div className="space-y-2 mb-4">
                                        {form.items.map((item, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <div className="flex-1"><span className="font-medium">{item.product_name}</span> <span className="text-gray-500 ml-1">x{item.quantity}</span></div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                                    <button onClick={() => removeFromOrder(index)} className="text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-blue-600">Rp {total.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <button onClick={handleSubmit} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Buat Order</button>
                                    <Link href={route('orders.index')} className="block text-center px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">Batal</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
