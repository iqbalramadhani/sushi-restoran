import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Ingredient } from '@/types';

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
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {success}
                            </div>
                        )}

                        {/* Desktop Table */}
                        <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Bahan Baku</h3>
                                <Link
                                    href={route('ingredients.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
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
                                                    <td className="px-6 py-4 font-medium text-gray-900">{ingredient.name}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium">
                                                            {ingredient.unit}
                                                        </span>
                                                    </td>
                                                    <td className={`px-6 py-4 font-semibold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>
                                                        {isLow && (
                                                            <span className="inline-flex items-center gap-1 mr-1">
                                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                        {parseFloat(ingredient.stock).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">
                                                        {ingredient.min_stock > 0 ? parseFloat(ingredient.min_stock).toLocaleString('id-ID') : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <Link href={route('ingredients.edit', ingredient.id)} className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Ubah</Link>
                                                        <button onClick={() => handleDelete(ingredient.id)} className="text-red-600 hover:text-red-800 text-sm font-medium">Hapus</button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {ingredients.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
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
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
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
                                                        <svg className={`w-5 h-5 ${isLow ? 'text-red-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{ingredient.name}</h4>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 text-xs mt-0.5">
                                                            {ingredient.unit}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-lg font-bold ${isLow ? 'text-red-600' : 'text-gray-900'}`}>
                                                        {parseFloat(ingredient.stock).toLocaleString('id-ID')}
                                                    </p>
                                                    {isLow && (
                                                        <p className="text-xs text-red-500 font-medium">Stok rendah!</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                                <Link href={route('ingredients.edit', ingredient.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    Ubah
                                                </Link>
                                                <button onClick={() => handleDelete(ingredient.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {ingredients.length === 0 && (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
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
