import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Ingredient, Unit } from '@/types';

interface Props {
    ingredient: Ingredient;
    units: Unit[];
}

export default function IngredientEdit({ ingredient, units }: Props) {
    const [form, setForm] = useState({ name: ingredient.name, unit: ingredient.unit, stock: parseFloat(ingredient.stock ?? 0), min_stock: parseFloat(ingredient.min_stock ?? 0) });
    const [customUnit, setCustomUnit] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleUnitChange = (value: string) => {
        handleChange('unit', value);
        setCustomUnit('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let unit = form.unit;
        if (unit === 'custom') {
            if (!customUnit.trim()) {
                setErrors({ unit: 'Masukkan nama satuan baru' });
                return;
            }
            const csrf = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
            await fetch(route('units.store'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': csrf },
                body: JSON.stringify({ name: customUnit.trim() }),
            });
            unit = customUnit.trim();
        }
        router.put(route('ingredients.update', ingredient.id), { ...form, unit }, { preserveScroll: true, onError: (err) => setErrors(err) });
    };

    return (
        <>
            <Head title="Edit Bahan Baku" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Bahan Baku</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
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
                                            <select value={form.unit} onChange={(e) => handleUnitChange(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                                {units.map(u => (
                                                    <option key={u.id} value={u.name}>{u.name}</option>
                                                ))}
                                                <option value="custom">+ Tambah Satuan Baru</option>
                                            </select>
                                            {form.unit === 'custom' && (
                                                <input type="text" value={customUnit} onChange={(e) => setCustomUnit(e.target.value)} placeholder="Ketik satuan baru..." className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                            )}
                                            {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Stok Saat Ini</label>
                                            <input type="number" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} min="0" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Batas Minimum</label>
                                            <input type="number" value={form.min_stock} onChange={(e) => handleChange('min_stock', e.target.value)} min="0" step="0.01" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                            <p className="mt-1 text-xs text-gray-500">Peringatan akan muncul saat stok ≤ batas minimum</p>
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
