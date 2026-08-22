import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Product } from '@/types';

interface Props {
    products: Product[];
    success?: string;
}

export default function ProductIndex({ products, success }: Props) {
    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus produk ini?')) return;
        router.delete(route('products.destroy', id), { preserveScroll: true });
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
                                <Link href={route('products.create')} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700">+ Tambah Produk</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">Kategori</th>
                                            <th className="px-6 py-3">Harga</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {products.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                                <td className="px-6 py-4 text-gray-500">{product.category?.name ?? '-'}</td>
                                                <td className="px-6 py-4 font-semibold">Rp {Number(product.price).toLocaleString('id-ID')}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {product.is_available ? 'Tersedia' : 'Tidak Tersedia'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Link href={route('products.edit', product.id)} className="text-blue-600 hover:text-blue-800">Edit</Link>
                                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {products.length === 0 && (
                                            <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Belum ada produk.</td></tr>
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
