import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Category } from '@/types';
import {
    Plus,
    Pencil,
    Trash2,
    Tag,
    CircleCheck,
    AlertCircle,
} from 'lucide-react';

interface Props {
    categories: Category[];
    success?: string;
}

export default function CategoryIndex({ categories, success }: Props) {
    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    };

    return (
        <>
            <Head title="Kategori" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kategori</h2>}>
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
                                    <Tag className="w-5 h-5 text-orange-500" strokeWidth={2} />
                                    <h3 className="text-lg font-semibold text-gray-800">Daftar Kategori</h3>
                                </div>
                                <Link
                                    href={route('categories.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                                >
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                    Tambah Kategori
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Slug</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Deskripsi</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {categories.map((cat) => (
                                            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center flex-shrink-0">
                                                            <Tag className="w-4 h-4 text-white" strokeWidth={2} />
                                                        </div>
                                                        <span className="font-medium text-gray-900">{cat.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{cat.slug}</code>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{cat.description || '-'}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={route('categories.edit', cat.id)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">
                                                        <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                                        Ubah
                                                    </Link>
                                                    {!cat.has_products && (
                                                        <button onClick={() => handleDelete(cat.id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium">
                                                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                            Hapus
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                            <Tag className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">Belum ada kategori</p>
                                                        <p className="text-gray-400 text-sm">Tambahkan kategori untuk mengatur menu</p>
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
                                <p className="text-sm text-gray-500">{categories.length} kategori</p>
                                <Link
                                    href={route('categories.create')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold"
                                >
                                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    Tambah
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                                                    <Tag className="w-5 h-5 text-white" strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{cat.name}</h4>
                                                    <code className="text-xs text-gray-400">{cat.slug}</code>
                                                </div>
                                            </div>
                                        </div>
                                        {cat.description && (
                                            <p className="text-sm text-gray-500 mb-3 pb-3 border-b border-gray-100">{cat.description}</p>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Link href={route('categories.edit', cat.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                                <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                                Ubah
                                            </Link>
                                            {!cat.has_products && (
                                                <button onClick={() => handleDelete(cat.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                            <Tag className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-gray-500 font-medium">Belum ada kategori</p>
                                        <p className="text-gray-400 text-sm mt-1">Tambahkan kategori pertama</p>
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
