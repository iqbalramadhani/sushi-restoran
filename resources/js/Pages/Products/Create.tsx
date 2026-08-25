import { useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SearchableSelect from '@/Components/SearchableSelect';
import { Category, Ingredient } from '@/types';

interface Props {
    categories: Category[];
    ingredients: Ingredient[];
}

export default function ProductCreate({ categories = [], ingredients = [] }: Props) {
    const [form, setForm] = useState({ category_id: '', name: '', price: '', description: '', is_available: true });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [categoryErrors, setCategoryErrors] = useState<Record<string, string>>({});
    const [ingredientRows, setIngredientRows] = useState<{ ingredient_id: string; quantity: string }[]>([{ ingredient_id: '', quantity: '' }]);
    const priceInputRef = useRef<HTMLInputElement>(null);

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
        const rows = ingredientRows.filter((_, i) => i !== index);
        setIngredientRows(rows);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...form,
            price: parseInt(form.price.replace(/\./g, ''), 10),
            ingredients: ingredientRows.filter(r => r.ingredient_id),
        };
        router.post(route('products.store'), payload, { preserveScroll: true, onError: (err) => setErrors(err), onSuccess: () => { setForm({ category_id: '', name: '', price: '', description: '', is_available: true }); setIngredientRows([{ ingredient_id: '', quantity: '' }]); } });
    };

    const handleAddCategory = () => {
        const errs: Record<string, string> = {};
        if (!newCategory.name.trim()) errs.name = 'Nama kategori wajib diisi';
        if (Object.keys(errs).length > 0) { setCategoryErrors(errs); return; }

        router.post(route('categories.store'), newCategory, {
            preserveScroll: true,
            onSuccess: (page) => {
                const cat = page.props.categories.find((c: Category) => c.name === newCategory.name.trim());
                if (cat) setForm(prev => ({ ...prev, category_id: String(cat.id) }));
                setShowCategoryModal(false);
                setNewCategory({ name: '', description: '' });
                setCategoryErrors({});
            },
            onError: (err) => setCategoryErrors(err),
        });
    };

    return (
        <>
            <Head title="Tambah Produk" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tambah Produk</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-4 sm:p-6">
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
                                            <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required autoFocus className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Harga (Rp)</label>
                                            <input ref={priceInputRef} type="text" value={form.price} onChange={handlePriceChange} onBlur={handlePriceBlur} inputMode="numeric" placeholder="0" required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
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
                                                        <input type="number" value={row.quantity} onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)} placeholder="Qty" min="0" step="0.01" className="w-20 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
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
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {showCategoryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                            <div className="p-4 sm:p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tambah Kategori Baru</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Nama Kategori</label>
                                        <input type="text" value={newCategory.name} onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))} autoFocus className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                        {categoryErrors.name && <p className="mt-1 text-sm text-red-600">{categoryErrors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
                                        <textarea value={newCategory.description} onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))} rows={2} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                    </div>
                                    <div className="flex justify-end gap-3">
                                        <button type="button" onClick={() => { setShowCategoryModal(false); setCategoryErrors({}); }} className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">Batal</button>
                                        <button type="button" onClick={handleAddCategory} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}
