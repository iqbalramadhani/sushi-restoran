import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function TableCreate() {
    const [form, setForm] = useState({ name: '', capacity: 4, seat_count: 4 });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (field: string, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(route('tables.store'), form, { preserveScroll: true, onError: (err) => setErrors(err), onSuccess: () => setForm({ name: '', capacity: 4, seat_count: 4 }) });
    };

    return (
        <>
            <Head title="Tambah Meja" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Tambah Meja</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Nama Meja</label>
                                            <input type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Contoh: Meja A1" required autoFocus className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Kapasitas</label>
                                            <input type="number" value={form.capacity} onChange={(e) => handleChange('capacity', parseInt(e.target.value))} min={1} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Jumlah Kursi</label>
                                            <input type="number" value={form.seat_count} onChange={(e) => handleChange('seat_count', parseInt(e.target.value))} min={1} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <Link href={route('tables.index')} className="px-4 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">Batal</Link>
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
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
