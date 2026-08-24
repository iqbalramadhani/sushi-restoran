import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Product, ProductLowStock } from '@/types';

interface Props {
    products: Product[];
    low_stock_products?: ProductLowStock[];
    success?: string;
}

export default function ProductIndex({ products, low_stock_products = [], success }: Props) {
    const [openId, setOpenId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return;
        router.delete(route('products.destroy', id), { preserveScroll: true });
    };

    const getProductLowStock = (productId: number): ProductLowStock[] => {
        return low_stock_products.filter(ps => ps.product_id === productId);
    };
    

    return (
        <>
            <Head title="Produk / Menu" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Produk / Menu</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{success}</div>}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Menu</h3>
                                <Link href={route('products.create')} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700">+ Tambah Menu</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">Kategori</th>
                                            <th className="px-6 py-3">Harga</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Stok Bahan</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.flatMap((product) => {
                                            const lowStockItems = getProductLowStock(product.id);
                                            const isOpen = openId === product.id;
                                            const hasIngredients = product.ingredients && product.ingredients.length > 0;
                                            return [
                                                <tr key={product.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                                    <td className="px-6 py-4 text-gray-500">{product.category?.name ?? '-'}</td>
                                                    <td className="px-6 py-4 font-semibold">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {product.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {lowStockItems.length > 0 ? (
                                                            <div className="space-y-1">
                                                                {lowStockItems.map((item) => (
                                                                    <div key={item.ingredient_id} className="flex items-center gap-2">
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            ⚠ {item.ingredient_name}
                                                                        </span>
                                                                        <span className="text-xs text-red-600 font-medium">
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
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors mr-2"
                                                        >
                                                            Bahan Baku
                                                            <svg className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </button>
                                                        <Link href={route('products.edit', product.id)} className="text-blue-600 hover:text-blue-800 mr-3">Ubah</Link>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} className="text-red-600 hover:text-red-800">Hapus</button>
                                                    </td>
                                                </tr>,
                                                isOpen && hasIngredients && (
                                                    <tr key={`detail-${product.id}`}>
                                                        <td colSpan={6} className="px-6 py-0">
                                                            <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
                                                                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">Bahan Baku</p>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {product.ingredients.map((ing) => (
                                                                        <span key={ing.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white text-gray-700 border border-blue-200 shadow-sm">
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
                                            <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Belum ada produk.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
