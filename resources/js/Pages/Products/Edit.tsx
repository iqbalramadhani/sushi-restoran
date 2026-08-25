import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SearchableSelect from '@/Components/SearchableSelect';
import { Category, Ingredient, Product, ProductIngredient } from '@/types';

interface Props {
    product: Product;
    categories: Category[];
    ingredients: Ingredient[];
}

export default function ProductEdit({ product, categories, ingredients }: Props) {
    const initialIngredients: ProductIngredient[] = product.ingredients ?? [];
    const [form, setForm] = useState({
        category_id: product.category_id ?? '',
        name: product.name ?? '',
        price: Math.round(Number(product.price ?? 0)).toLocaleString('id-ID'),
        description: product.description ?? '',
        is_available: product.is_available ?? true,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [ingredientRows, setIngredientRows] = useState<{ ingredient_id: string; quantity: string; id?: number }[]>(
        initialIngredients.map(ing => ({
            ingredient_id: String(ing.id),
            quantity: String(Math.round(Number(ing.pivot?.quantity ?? 0))),
            id: ing.pivot?.id,
        }))
    );

    const handleChange = (field: string, value: string | boolean) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');
        const num = Number(raw);
        const formatted = isNaN(num) ? '' : Math.round(num).toLocaleString('id-ID');
        setForm(prev => ({ ...prev, price: formatted }));
    };

    const handlePriceBlur = () => {
        const raw = form.price.replace(/\D/g, '');
        const num = Number(raw);
        setForm(prev => ({ ...prev, price: isNaN(num) ? '' : Math.round(num).toLocaleString('id-ID') }));
    };

    const handleIngredientChange = (index: number, field: string, value: string) => {
        const rows = [...ingredientRows];
        rows[index] = { ...rows[index], [field]: value };
        setIngredientRows(rows);
    };

    const addIngredientRow = () => {
        setIngredientRows([...ingredientRows, { ingredient_id: '', quantity: '' }]);
    };

    const removeIngredientRow = (index: number) => {
        setIngredientRows(ingredientRows.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...form,
            price: parseInt(form.price.replace(/\./g, ''), 10),
            ingredients: ingredientRows.filter(r => r.ingredient_id),
        };
        router.put(route('products.update', product.id), payload, { preserveScroll: true, onError: (err) => setErrors(err) });
    };

    return (
        <>
            <Head title="Edit Produk" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Produk</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                            <SearchableSelect
                                                options={categories.map(c => ({ id: c.id, label: c.name }))}
                                                value={form.category_id}
                                                onChange={(v) => handleChange('category_id', v)}
                                                placeholder="Cari atau pilih kategori..."
                                            />
                                            {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                                            <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                                            <input type="text" value={form.price} onChange={handlePriceChange} onBlur={handlePriceBlur} inputMode="numeric" placeholder="0" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                            <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Bahan Baku</label>
                                            <div className="mt-2 space-y-2">
                                                {ingredientRows.map((row, index) => (
                                                    <div key={index} className="flex gap-2 items-center">
                                                        <SearchableSelect
                                                            options={ingredients.map(i => ({ id: i.id, label: `${i.name} (${i.unit})` }))}
                                                            value={row.ingredient_id}
                                                            onChange={(v) => handleIngredientChange(index, 'ingredient_id', v)}
                                                            placeholder="Cari bahan baku..."
                                                            className="flex-1"
                                                        />
                                                        <input type="number" value={row.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} placeholder="Qty" min="0" step="1" className="w-20 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                                        <button type="button" onClick={() => removeIngredientRow(index)} className="px-2 text-red-600 hover:text-red-800">✕</button>
                                                    </div>
                                                ))}
                                                <button type="button" onClick={addIngredientRow} className="text-sm text-blue-600 hover:text-blue-800">+ Tambah Bahan Baku</button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={form.is_available} onChange={(e) => handleChange('is_available', e.target.checked)} className="rounded border-gray-300 text-blue-600" />
                                            <label className="text-sm text-gray-700">Tersedia</label>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <Link href={route('products.index')} className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">Batal</Link>
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
