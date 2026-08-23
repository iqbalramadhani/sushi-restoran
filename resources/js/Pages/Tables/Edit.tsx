import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table } from '@/types';

interface Props {
    table: Table;
    errors?: Record<string, string>;
}

export default function TableEdit({ table, errors }: Props) {
    const [form, setForm] = useState({
        name: table.name ?? '',
        capacity: table.capacity ?? 4,
        seat_count: table.seat_count ?? 4,
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>(errors ?? {});

    const handleChange = (field: string, value: string | number) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) setFormErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.put(route('tables.update', table.id), form, {
            preserveScroll: true,
            onError: (err) => setFormErrors(err),
        });
    };

    return (
        <>
            <Head title="Edit Meja" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Edit Meja</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-xl sm:px-6 lg:px-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Edit Meja</h3>
                                        <p className="text-sm text-gray-500">Perbarui informasi meja</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Nama Meja
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) => handleChange('name', e.target.value)}
                                            required
                                            autoFocus
                                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                        />
                                        {formErrors.name && <p className="mt-1.5 text-sm text-red-600">{formErrors.name}</p>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Kapasitas
                                            </label>
                                            <input
                                                type="number"
                                                value={form.capacity}
                                                onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
                                                min={1}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                            />
                                            {formErrors.capacity && <p className="mt-1.5 text-sm text-red-600">{formErrors.capacity}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Jumlah Kursi
                                            </label>
                                            <input
                                                type="number"
                                                value={form.seat_count}
                                                onChange={(e) => handleChange('seat_count', parseInt(e.target.value))}
                                                min={1}
                                                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                                            />
                                            {formErrors.seat_count && <p className="mt-1.5 text-sm text-red-600">{formErrors.seat_count}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                                    <Link
                                        href={route('tables.index')}
                                        className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
