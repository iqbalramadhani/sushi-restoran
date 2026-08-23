import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Ingredient } from '@/types';

interface Props {
    ingredient: Ingredient;
}

export default function IngredientEdit({ ingredient }: Props) {
    const [form, setForm] = useState({ name: ingredient.name, unit: ingredient.unit });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('ingredients.update', ingredient.id), form, { preserveScroll: true, onError: (err) => setErrors(err) });
    };

    return (
        <>
            <Head title="Edit Bahan Baku" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Bahan Baku</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nama Bahan Baku</label>
                                            <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required autoFocus className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Satuan</label>
                                            <select value={form.unit} onChange={(e) => handleChange('unit', e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                                <option value="gram">Gram (g)</option>
                                                <option value="ml">Mililiter (ml)</option>
                                                <option value="piece">Potong (pcs)</option>
                                                <option value="buah">Buah</option>
                                                <option value="sendok">Sendok (sdt)</option>
                                                <option value="cakar">Cakar (cup)</option>
                                            </select>
                                            {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <Link href={route('ingredients.index')} className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">Batal</Link>
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
