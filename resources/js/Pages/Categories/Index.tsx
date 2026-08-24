import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category } from '@/types';

interface Props {
    categories: Category[];
    success?: string;
}

export default function CategoryIndex({ categories, success }: Props) {
    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus kategori ini?')) return;
        router.delete(route('categories.destroy', id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Kelola Kategori" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kelola Kategori</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                        {success && (
                            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{success}</div>
                        )}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Kategori</h3>
                                <Link href={route('categories.create')} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700">+ Tambah Kategori</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">Slug</th>
                                            <th className="px-6 py-3">Deskripsi</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {categories.map((cat) => (
                                            <tr key={cat.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                                                <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                                                <td className="px-6 py-4 text-gray-500">{cat.description || '-'}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Link href={route('categories.edit', cat.id)} className="text-blue-600 hover:text-blue-800">Ubah</Link>
                                                    <button onClick={() => handleDelete(cat.id)} className="text-red-600 hover:text-red-800">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && (
                                            <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Belum ada kategori.</td></tr>
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
