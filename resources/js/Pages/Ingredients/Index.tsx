import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Ingredient } from '@/types';
import {
    Plus,
    Pencil,
    Trash2,
    CircleCheck,
    AlertTriangle,
    Package,
    Box,
    Beaker,
} from 'lucide-react';

interface Props {
    ingredients: Ingredient[];
    success?: string;
}

export default function IngredientIndex({ ingredients, success }: Props) {
    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus bahan baku ini?')) return;
    };

    return (
        <>
            <Head title="Bahan Baku" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Bahan Baku</h2>}>
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
                                    <Beaker className="w-5 h-5 text-orange-500" strokeWidth={2} />
                                    <h3 className="text-lg font-semibold text-gray-800">Daftar Bahan Baku</h3>
                                </div>
                                <Link
                                    href={route('ingredients.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                                >
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                    Tambah Bahan Baku
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Satuan</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Stok</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Min</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ingredients.map((ingredient) => {
                                            const isLow = ingredient.stock <= ingredient.min_stock && ingredient.min_stock > 0;
                                            return (
                                                <tr key={ingredient.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLow ? 'bg-red-100' : 'bg-gray-100'}`}>
                                                                <Package className={`w-4 h-4 ${isLow ? 'text-red-600' : 'text-gray-500'}`} strokeWidth={2} />
                                                            </div>
                                                            <span className="font-medium text-gray-900">{ingredient.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                                                            <Box className="w-3 h-3" strokeWidth={2} />
                                                            {ingredient.unit}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 font-semibold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {isLow && (
                                                            <span className="inline-flex items-center gap-1 mr-1">
                                                                <AlertTriangle className="w-3.5 h-3.5" strokeWidth={2} />
                                                            </span>
                                                        )}
                                                        {parseFloat(ingredient.stock).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {ingredient.min_stock > 0 ? parseFloat(ingredient.min_stock).toLocaleString('id-ID') : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={route('ingredients.edit', ingredient.id)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">
                                                            <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                                            Ubah
                                                        </Link>
                                                        <button onClick={() => handleDelete(ingredient.id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium">
                                                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {ingredients.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                            <Beaker className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">Belum ada bahan baku</p>
                                                        <p className="text-gray-400 text-sm">Tambahkan bahan baku untuk tracking stok</p>
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
                                <p className="text-sm text-gray-500">{ingredients.length} bahan baku</p>
                                <Link
                                    href={route('ingredients.create')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold"
                                >
                                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    Tambah
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {ingredients.map((ingredient) => {
                                    const isLow = ingredient.stock <= ingredient.min_stock && ingredient.min_stock > 0;
                                    return (
                                        <div key={ingredient.id} className={`bg-white rounded-2xl border p-4 shadow-sm ${isLow ? 'border-red-200 bg-red-50/30' : 'border-gray-100'}`}>
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLow ? 'bg-red-100' : 'bg-gray-100'}`}>
                                                        <Package className={`w-5 h-5 ${isLow ? 'text-red-600' : 'text-gray-500'}`} strokeWidth={2} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{ingredient.name}</h4>
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-xs mt-0.5">
                                                            <Box className="w-3 h-3" strokeWidth={2} />
                                                            {ingredient.unit}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {parseFloat(ingredient.stock).toLocaleString('id-ID')}
                                                    </p>
                                                    {isLow && (
                                                        <p className="text-xs text-red-500 font-medium flex items-center justify-end gap-0.5 mt-0.5">
                                                            <AlertTriangle className="w-3 h-3" strokeWidth={2} />
                                                            Stok rendah!
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                                <Link href={route('ingredients.edit', ingredient.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                                    <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                                    Ubah
                                                </Link>
                                                <button onClick={() => handleDelete(ingredient.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {ingredients.length === 0 && (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                            <Beaker className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-gray-500 font-medium">Belum ada bahan baku</p>
                                        <p className="text-gray-400 text-sm mt-1">Tambahkan bahan baku pertama</p>
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
