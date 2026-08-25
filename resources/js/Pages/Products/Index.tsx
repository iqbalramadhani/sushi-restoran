import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Product, ProductLowStock } from '@/types';
import {
    Plus,
    Pencil,
    Trash2,
    Boxes,
    ChevronDown,
    ChevronUp,
    CircleCheck,
    CircleX,
    Package,
    AlertTriangle,
    Utensils,
    Tag,
} from 'lucide-react';

interface Props {
    products: Product[];
    low_stock_products?: ProductLowStock[];
    success?: string;
}

export default function ProductIndex({ products, low_stock_products = [], success }: Props) {
    const [openId, setOpenId] = useState<number | null>(null);

    const handleDelete = (id: number, hasBeenOrdered: boolean) => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return;
        const route = hasBeenOrdered ? 'products.soft-destroy' : 'products.destroy';
        router.delete(route(id), { preserveScroll: true });
    };

    const getProductLowStock = (productId: number): ProductLowStock[] => {
        return low_stock_products.filter(ps => ps.product_id === productId);
    };

    return (
        <>
            <Head title="Menu" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Menu</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {success && (
                            <div className="mb-4 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl">
                                <CircleCheck className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                                {success}
                            </div>
                        )}

                        {/* Desktop Table */}
                        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Utensils className="w-5 h-5 text-orange-500" strokeWidth={2} />
                                    <h3 className="text-lg font-semibold text-gray-800">Daftar Menu</h3>
                                </div>
                                <Link
                                    href={route('products.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                                >
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                    Tambah Menu
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Kategori</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Harga</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stok Bahan</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.flatMap((product) => {
                                            const lowStockItems = getProductLowStock(product.id);
                                            const isOpen = openId === product.id;
                                            const hasIngredients = product.ingredients && product.ingredients.length > 0;
                                            return [
                                                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                                                                <Utensils className="w-4 h-4 text-orange-600" strokeWidth={2} />
                                                            </div>
                                                            <span className="font-medium text-gray-900">{product.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                                                            <Tag className="w-3 h-3" strokeWidth={2} />
                                                            {product.category?.name ?? '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-gray-900">
                                                        Rp {Number(product.price).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                            product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {product.is_available ? <CircleCheck className="w-3 h-3" strokeWidth={2.5} /> : <CircleX className="w-3 h-3" strokeWidth={2.5} />}
                                                            {product.is_available ? 'Tersedia' : 'Habis'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {lowStockItems.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {lowStockItems.map((item) => (
                                                                    <div key={item.ingredient_id} className="flex items-center gap-1.5">
                                                                        <AlertTriangle className="w-3 h-3 text-yellow-600 flex-shrink-0" strokeWidth={2} />
                                                                        <span className="text-xs text-yellow-700">{item.ingredient_name}</span>
                                                                        <span className="text-xs text-red-600 font-medium ml-1">
                                                                            {Number(item.stock).toLocaleString('id-ID')} {item.unit}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : product.id); }}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors mr-2"
                                                        >
                                                            <Boxes className="w-3 h-3" strokeWidth={2} />
                                                            Bahan
                                                            {isOpen ? <ChevronUp className="w-3 h-3" strokeWidth={2} /> : <ChevronDown className="w-3 h-3" strokeWidth={2} />}
                                                        </button>
                                                        <Link href={route('products.edit', product.id)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">
                                                            <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                                            Ubah
                                                        </Link>
                                                        <button onClick={() => handleDelete(product.id, product.has_been_ordered ?? false)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium">
                                                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>,
                                                isOpen && hasIngredients && (
                                                    <tr key={`detail-${product.id}`}>
                                                        <td colSpan={6} className="px-6 py-0">
                                                            <div className="px-6 py-4 bg-blue-50/50 border-t border-blue-100">
                                                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                                                    <Boxes className="w-3.5 h-3.5" strokeWidth={2} />
                                                                    Bahan Baku
                                                                </p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {product.ingredients.map((ing) => (
                                                                        <span key={ing.id} className="inline-flex items-center px-3 py-1.5 rounded-full text-xs bg-white text-gray-700 border border-blue-200 shadow-sm">
                                                                            <span className="font-medium text-blue-700">{ing.name}</span>
                                                                            <span className="mx-1 text-gray-300">·</span>
                                                                            <span>{Number(ing.pivot?.quantity ?? 0).toLocaleString('id-ID')} {ing.unit ?? ing.pivot?.unit ?? '-'}</span>
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            ];
                                        })}
                                        {products.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                            <Utensils className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">Belum ada menu</p>
                                                        <p className="text-gray-400 text-sm">Tambahkan menu pertama untuk restoran Anda</p>
                                                        <Link href={route('products.create')} className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                                                            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                                            Tambah Menu
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-sm text-gray-500">{products.length} menu</p>
                                <Link
                                    href={route('products.create')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold"
                                >
                                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    Tambah
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {products.map((product) => {
                                    const lowStockItems = getProductLowStock(product.id);
                                    return (
                                        <div key={product.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                                                    <Utensils className="w-5 h-5 text-orange-600" strokeWidth={2} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 truncate">{product.name}</h4>
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-xs mt-1">
                                                        <Tag className="w-3 h-3" strokeWidth={2} />
                                                        {product.category?.name ?? '-'}
                                                    </span>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <p className="font-bold text-gray-900">
                                                        Rp {Number(product.price).toLocaleString('id-ID')}
                                                    </p>
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                                                        product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {product.is_available ? <CircleCheck className="w-3 h-3" strokeWidth={2.5} /> : <CircleX className="w-3 h-3" strokeWidth={2.5} />}
                                                        {product.is_available ? 'Tersedia' : 'Habis'}
                                                    </span>
                                                </div>
                                            </div>

                                            {lowStockItems.length > 0 && (
                                                <div className="mb-3 p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl">
                                                    <p className="text-xs text-yellow-800 font-medium mb-1 flex items-center gap-1.5">
                                                        <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                                                        Stok bahan rendah:
                                                    </p>
                                                    <div className="space-y-0.5">
                                                        {lowStockItems.map((item) => (
                                                            <p key={item.ingredient_id} className="text-xs text-yellow-700 flex items-center gap-1">
                                                                {item.ingredient_name}: {Number(item.stock).toLocaleString('id-ID')} {item.unit}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                                <button
                                                    onClick={() => setOpenId(openId === product.id ? null : product.id)}
                                                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                                                >
                                                    <Boxes className="w-3.5 h-3.5" strokeWidth={2} />
                                                    Bahan Baku
                                                </button>
                                                <Link href={route('products.edit', product.id)} className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-1">
                                                    <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                                    Ubah
                                                </Link>
                                                <button onClick={() => handleDelete(product.id, product.has_been_ordered ?? false)} className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors flex items-center gap-1">
                                                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                    Hapus
                                                </button>
                                            </div>

                                            {openId === product.id && product.ingredients && product.ingredients.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-100">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {product.ingredients.map((ing) => (
                                                            <span key={ing.id} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                                                {ing.name} · {Number(ing.pivot?.quantity ?? 0).toLocaleString('id-ID')} {ing.unit ?? ing.pivot?.unit ?? '-'}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {products.length === 0 && (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                            <Utensils className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-gray-500 font-medium">Belum ada menu</p>
                                        <p className="text-gray-400 text-sm mt-1">Tambahkan menu pertama</p>
                                        <Link href={route('products.create')} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold">
                                            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            Tambah Menu
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
