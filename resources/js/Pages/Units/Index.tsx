import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Unit } from '@/types';
import {
    Plus,
    Pencil,
    Trash2,
    CircleCheck,
    Tag,
    Ruler as RulerIcon,
    Type,
} from 'lucide-react';

interface Props {
    units: Unit[];
    success?: string;
}

export default function UnitIndex({ units, success }: Props) {
    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus satuan ini?')) return;
    };

    return (
        <>
            <Head title="Satuan" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Satuan</h2>}>
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
                                    <RulerIcon className="w-5 h-5 text-orange-500" strokeWidth={2} />
                                    <h3 className="text-lg font-semibold text-gray-800">Daftar Satuan</h3>
                                </div>
                                <Link
                                    href={route('units.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                                >
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                    Tambah Satuan
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Slug</th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {units.map((unit) => (
                                            <tr key={unit.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                                            <RulerIcon className="w-4 h-4 text-white" strokeWidth={2} />
                                                        </div>
                                                        <span className="font-medium text-gray-900">{unit.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600">{unit.slug}</code>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={route('units.edit', unit.id)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">
                                                        <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                                        Ubah
                                                    </Link>
                                                    <button onClick={() => handleDelete(unit.id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium">
                                                        <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {units.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                            <RulerIcon className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">Belum ada satuan</p>
                                                        <p className="text-gray-400 text-sm">Tambahkan satuan untuk bahan baku</p>
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
                                <p className="text-sm text-gray-500">{units.length} satuan</p>
                                <Link
                                    href={route('units.create')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold"
                                >
                                    <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                                    Tambah
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {units.map((unit) => (
                                    <div key={unit.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                                                    <RulerIcon className="w-5 h-5 text-white" strokeWidth={2} />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{unit.name}</h4>
                                                    <code className="text-xs text-gray-400">{unit.slug}</code>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={route('units.edit', unit.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                                <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                                                Ubah
                                            </Link>
                                            <button onClick={() => handleDelete(unit.id)} className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {units.length === 0 && (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                            <RulerIcon className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-gray-500 font-medium">Belum ada satuan</p>
                                        <p className="text-gray-400 text-sm mt-1">Tambahkan satuan pertama</p>
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
