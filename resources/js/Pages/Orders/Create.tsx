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
    ingredientWarnings?: string[];
}

function getIngredientWarnings(product: Product, qty: number): string[] {
    if (!product.ingredients) return [];
    return product.ingredients
        .filter(ing => {
            const needed = ing.pivot.quantity * qty;
            return ing.stock < needed;
        })
        .map(ing => {
            const needed = ing.pivot.quantity * qty;
            return `Stok ${ing.name} kurang (tersedia ${ing.stock} ${ing.unit}, butuh ${needed} ${ing.unit})`;
        });
}

function getProductStockStatus(product: Product, qty: number): 'ok' | 'low' | 'insufficient' {
    if (!product.ingredients || product.ingredients.length === 0) return 'ok';
    const hasInsufficient = product.ingredients.some(ing => ing.stock < ing.pivot.quantity * qty);
    if (hasInsufficient) return 'insufficient';
    const hasLow = product.ingredients.some(ing => ing.stock < ing.pivot.quantity * qty * 3);
    return hasLow ? 'low' : 'ok';
}

function getMaxPossibleQty(product: Product): number {
    if (!product.ingredients || product.ingredients.length === 0) return 999;
    return Math.min(...product.ingredients.map(ing =>
        ing.pivot.quantity > 0 ? Math.floor(ing.stock / ing.pivot.quantity) : 999
    ));
}

export default function OrderCreate({ tables, products, table_id }: Props) {
    const [form, setForm] = useState({ table_id: table_id ?? '' as string | number, items: [] as CartItem[] });
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const groupedProducts = useMemo(() => {
        const groups: Record<number, { name: string; items: Product[] }> = {};
        products.forEach(p => {
            const catId = p.category?.id ?? 0;
            if (!groups[catId]) groups[catId] = { name: p.category?.name ?? 'Lainnya', items: [] };
            groups[catId].items.push(p);
        });
        return groups;
    }, [products]);

    const cartItemCount = useMemo(() => form.items.reduce((sum, i) => sum + i.quantity, 0), [form.items]);

    const addToOrder = () => {
        if (!selectedProductId) return;
        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;
        const maxQty = getMaxPossibleQty(product);
        const qtyToAdd = Math.min(selectedQuantity, maxQty > 0 && maxQty < selectedQuantity ? maxQty : selectedQuantity);
        const warnings = getIngredientWarnings(product, qtyToAdd);
        const existing = form.items.find(i => i.product_id === product.id);
        if (existing) {
            const newQty = existing.quantity + qtyToAdd;
            setForm(prev => ({
                ...prev,
                items: prev.items.map(i =>
                    i.product_id === product.id
                        ? { ...i, quantity: newQty, ingredientWarnings: getIngredientWarnings(product, newQty) }
                        : i
                ),
            }));
        } else {
            setForm(prev => ({
                ...prev,
                items: [...prev.items, {
                    product_id: product.id,
                    product_name: product.name,
                    price: product.price,
                    quantity: qtyToAdd,
                    ingredientWarnings: warnings,
                }],
            }));
        }
        setSelectedProductId(0);
        setSelectedQuantity(1);
    };

    const updateQuantity = (productId: number, delta: number) => {
        setForm(prev => ({
            ...prev,
            items: prev.items.map(i => {
                if (i.product_id !== productId) return i;
                const product = products.find(p => p.id === productId);
                if (!product) return i;
                const newQty = Math.max(1, i.quantity + delta);
                const maxQty = getMaxPossibleQty(product);
                if (newQty > maxQty) return { ...i, quantity: maxQty, ingredientWarnings: getIngredientWarnings(product, maxQty) };
                return { ...i, quantity: newQty, ingredientWarnings: getIngredientWarnings(product, newQty) };
            }),
        }));
    };

    const removeFromOrder = (index: number) => {
        setForm(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
        setSubmitError(null);
    };

    const total = useMemo(() => form.items.reduce((sum, item) => sum + item.price * item.quantity, 0), [form.items]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        if (!form.table_id) { setSubmitError('Pilih meja terlebih dahulu'); return; }
        if (form.items.length === 0) { setSubmitError('Tambahkan minimal 1 produk'); return; }

        router.post(
            route('orders.store'),
            { table_id: Number(form.table_id), items: form.items.map(i => ({ product_id: i.product_id, quantity: i.quantity })) },
            {
                onError: (errors) => {
                    if (errors.stock) {
                        setSubmitError(errors.stock);
                    }
                },
            }
        );
    };

    return (
        <>
            <Head title="Buat Order" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Buat Order</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                        {/* Table Selection */}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Pilih Meja</label>
                                    <p className="text-xs text-gray-400 mt-0.5">Meja yang tersedia untuk placed order</p>
                                </div>
                            </div>
                            <select
                                value={form.table_id}
                                onChange={(e) => setForm(prev => ({ ...prev, table_id: e.target.value }))}
                                className="mt-1 block w-full sm:w-64 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                            >
                                <option value="">-- Pilih Meja --</option>
                                {tables.filter(t => t.status === 'available').map(table => (
                                    <option key={table.id} value={table.id}>{table.name} ({table.capacity} kursi)</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Products Section */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Quick Add */}
                                <div className="bg-white shadow-sm sm:rounded-lg p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-800">Tambah Cepat</h4>
                                            <p className="text-xs text-gray-400 mt-0.5">Pilih produk dan tambahkan ke order</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <select
                                            value={selectedProductId}
                                            onChange={(e) => {
                                                setSelectedProductId(Number(e.target.value));
                                                const product = products.find(p => p.id === Number(e.target.value));
                                                if (product) setSelectedQuantity(Math.min(1, getMaxPossibleQty(product)));
                                            }}
                                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5"
                                        >
                                            <option value={0}>Pilih produk...</option>
                                            {Object.entries(groupedProducts).map(([catId, group]) => (
                                                <optgroup key={catId} label={group.name}>
                                                    {group.items.map(product => {
                                                        const status = getProductStockStatus(product, selectedQuantity);
                                                        const maxQty = getMaxPossibleQty(product);
                                                        const label = status === 'insufficient' ? ' [Habis]' : status === 'low' ? ` [Sisa ${maxQty}]` : '';
                                                        return (
                                                            <option key={product.id} value={product.id} disabled={status === 'insufficient'}>
                                                                {product.name} - Rp {Number(product.price).toLocaleString('id-ID')}{label}
                                                            </option>
                                                        );
                                                    })}
                                                </optgroup>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            min={1}
                                            max={(() => { const p = products.find(pp => pp.id === selectedProductId); return p ? getMaxPossibleQty(p) : 999; })()}
                                            value={selectedQuantity}
                                            onChange={(e) => setSelectedQuantity(Math.max(1, Number(e.target.value)))}
                                            className="w-20 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2.5 text-center"
                                        />
                                        <button
                                            onClick={addToOrder}
                                            disabled={!selectedProductId}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                        >
                                            + Tambah
                                        </button>
                                    </div>
                                </div>

                                {/* Product Grid */}
                                {Object.entries(groupedProducts).map(([catId, group]) => (
                                    <div key={catId} className="bg-white shadow-sm sm:rounded-lg p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{group.name}</h5>
                                            <span className="text-xs text-gray-400">{group.items.length} produk</span>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                            {group.items.map(product => {
                                                const status = getProductStockStatus(product, selectedQuantity);
                                                const isInCart = form.items.find(i => i.product_id === product.id);
                                                const maxQty = getMaxPossibleQty(product);
                                                return (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => {
                                                            setSelectedProductId(product.id);
                                                            setSelectedQuantity(Math.min(1, maxQty));
                                                            addToOrder();
                                                        }}
                                                        disabled={status === 'insufficient'}
                                                        className={`relative p-3 text-left border-2 rounded-xl transition-all ${
                                                            status === 'insufficient'
                                                                ? 'border-red-200 bg-red-50 opacity-60 cursor-not-allowed'
                                                                : status === 'low'
                                                                ? 'border-yellow-300 bg-yellow-50 hover:border-yellow-500 hover:bg-yellow-100'
                                                                : isInCart
                                                                ? 'border-green-500 bg-green-50 hover:border-green-600'
                                                                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                                                        }`}
                                                    >
                                                        {isInCart && (
                                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                                {isInCart.quantity}
                                                            </div>
                                                        )}
                                                        <div className="font-semibold text-gray-900 text-sm leading-tight mb-1">{product.name}</div>
                                                        <div className="text-blue-600 font-bold text-sm">Rp {Number(product.price).toLocaleString('id-ID')}</div>
                                                        {product.ingredients && product.ingredients.length > 0 && (
                                                            <div className="mt-2 space-y-0.5">
                                                                {product.ingredients.slice(0, 2).map(ing => (
                                                                    <div key={ing.id} className={`text-xs ${ing.stock < ing.pivot.quantity * selectedQuantity ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                                                                        {ing.name}: <span className="font-medium">{ing.stock}</span> {ing.unit}
                                                                    </div>
                                                                ))}
                                                                {product.ingredients.length > 2 && (
                                                                    <div className="text-xs text-gray-400">+{product.ingredients.length - 2} bahan lain</div>
                                                                )}
                                                            </div>
                                                        )}
                                                        {status === 'insufficient' && (
                                                            <div className="mt-2 text-xs text-red-600 font-semibold">Stok habis</div>
                                                        )}
                                                        {status === 'low' && (
                                                            <div className="mt-2 text-xs text-yellow-700 font-semibold">Sisa {maxQty} porsi</div>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart Sidebar */}
                            <div className="lg:col-span-1">
                                <div className="bg-white shadow-sm sm:rounded-lg p-6 sticky top-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-semibold text-gray-800">Keranjang</h4>
                                        {cartItemCount > 0 && (
                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                                {cartItemCount} item
                                            </span>
                                        )}
                                    </div>

                                    {submitError && (
                                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                                            {submitError}
                                        </div>
                                    )}

                                    {form.items.length === 0 ? (
                                        <div className="text-center py-10">
                                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                                            </svg>
                                            <div className="text-gray-400 text-sm">Keranjang kosong</div>
                                            <div className="text-gray-300 text-xs mt-1">Pilih produk untuk memulai</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                                            {form.items.map((item, index) => (
                                                <div key={index} className="border border-gray-200 rounded-lg p-3">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium text-gray-900 text-sm truncate">{item.product_name}</div>
                                                            <div className="text-blue-600 font-semibold text-sm">
                                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFromOrder(index)}
                                                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>

                                                    {/* Quantity Control */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => updateQuantity(item.product_id, -1)}
                                                                className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                                </svg>
                                                            </button>
                                                            <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.product_id, 1)}
                                                                className="w-7 h-7 rounded-md border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                            >
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            Rp {item.price.toLocaleString('id-ID')} /psn
                                                        </div>
                                                    </div>

                                                    {/* Warnings */}
                                                    {item.ingredientWarnings && item.ingredientWarnings.length > 0 && (
                                                        <div className="mt-2 pt-2 border-t border-red-100">
                                                            {item.ingredientWarnings.map((w, i) => (
                                                                <div key={i} className="text-xs text-red-600 flex items-start gap-1">
                                                                    <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                    {w}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {form.items.length > 0 && (
                                        <>
                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-600 font-medium">Total</span>
                                                    <span className="text-xl font-bold text-blue-600">
                                                        Rp {total.toLocaleString('id-ID')}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 space-y-2">
                                                <button
                                                    onClick={handleSubmit}
                                                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                                                >
                                                    Buat Order
                                                </button>
                                                <Link
                                                    href={route('orders.index')}
                                                    className="block text-center px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 font-medium transition-colors"
                                                >
                                                    Batal
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
