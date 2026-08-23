import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Ingredient } from '@/types';

interface Props {
    ingredients: Ingredient[];
    success?: string;
}

export default function IngredientIndex({ ingredients, success }: Props) {
    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus bahan baku ini?')) return;
        router.delete(route('ingredients.destroy', id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Bahan Baku" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Bahan Baku</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{success}</div>}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Bahan Baku</h3>
                                <Link href={route('ingredients.create')} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700">+ Tambah Bahan Baku</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3">Nama</th>
                                            <th className="px-6 py-3">Satuan</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {ingredients.map((ingredient) => (
                                            <tr key={ingredient.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium text-gray-900">{ingredient.name}</td>
                                                <td className="px-6 py-4 text-gray-500">{ingredient.unit}</td>
                                                <td className="px-6 py-4 text-right space-x-2">
                                                    <Link href={route('ingredients.edit', ingredient.id)} className="text-blue-600 hover:text-blue-800">Ubah</Link>
                                                    <button onClick={() => handleDelete(ingredient.id)} className="text-red-600 hover:text-red-800">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                        {ingredients.length === 0 && (
                                            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">Belum ada bahan baku.</td></tr>
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
