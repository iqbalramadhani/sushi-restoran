import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table } from '@/types';
import {
    Plus,
    Pencil,
    Trash2,
    CircleCheck,
    CircleX,
    Users,
    LayoutGrid,
    CheckCircle2,
    Clock,
    MoveRight,
} from 'lucide-react';

interface Props {
    tables: Table[];
    success?: string;
}

export default function TableIndex({ tables, success }: Props) {
    const availableCount = tables.filter(t => t.status === 'available').length;
    const occupiedCount = tables.filter(t => t.status === 'occupied').length;

    const handleOccupied = (id: number) => router.post(route('tables.occupy', id), null, { preserveScroll: true });
    const handleFree = (id: number) => router.post(route('tables.free', id), null, { preserveScroll: true });
    const handleDelete = (id: number) => {
        if (!confirm('Yakin ingin menghapus meja ini? Semua pesanan terkait juga akan dihapus.')) return;
        router.delete(route('tables.destroy', id), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Kelola Meja" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kelola Meja</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Success Alert */}
                        {success && (
                            <div className="mb-4 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl">
                                <CircleCheck className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                                {success}
                            </div>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                                    <CircleCheck className="w-6 h-6 text-emerald-600" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
                                    <p className="text-sm text-gray-500">Meja Tersedia</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-amber-600" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{occupiedCount}</p>
                                    <p className="text-sm text-gray-500">Meja Terisi</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-600" strokeWidth={2} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{tables.length}</p>
                                    <p className="text-sm text-gray-500">Total Meja</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <LayoutGrid className="w-5 h-5 text-orange-500" strokeWidth={2} />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">Denah Restoran</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">Klik meja untuk mengubah status</p>
                                    </div>
                                </div>
                                <Link
                                    href={route('tables.create')}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 border border-transparent rounded-lg font-semibold text-sm text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                    Tambah Meja
                                </Link>
                            </div>

                            {/* Table Grid */}
                            <div className="p-4 sm:p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                    {tables.map((table) => (
                                        <div
                                            key={table.id}
                                            onClick={() => table.status === 'available' ? handleOccupied(table.id) : handleFree(table.id)}
                                            className={`
                                                relative group rounded-xl border-2 cursor-pointer transition-all duration-200
                                                ${table.status === 'available'
                                                    ? 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:shadow-md'
                                                    : 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            {/* Status Badge */}
                                            <div className={`
                                                absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center
                                                ${table.status === 'available' ? 'bg-emerald-500' : 'bg-amber-500'}
                                            `}>
                                                {table.status === 'available'
                                                    ? <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={2.5} />
                                                    : <Clock className="w-3 h-3 text-white" strokeWidth={2.5} />
                                                }
                                            </div>

                                            {/* Content */}
                                            <div className="p-4 pt-6">
                                                {/* Icon */}
                                                <div className={`
                                                    w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center
                                                    ${table.status === 'available' ? 'bg-emerald-100' : 'bg-amber-100'}
                                                `}>
                                                    <Users className={`w-6 h-6 ${table.status === 'available' ? 'text-emerald-600' : 'text-amber-600'}`} strokeWidth={2} />
                                                </div>

                                                {/* Name */}
                                                <p className="text-center font-semibold text-gray-900 text-sm mb-1">
                                                    {table.name}
                                                </p>

                                                {/* Capacity */}
                                                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                                    <Users className="w-3.5 h-3.5" strokeWidth={2} />
                                                    <span>{table.capacity} orang</span>
                                                </div>

                                                {/* Status Label */}
                                                <div className="mt-3 text-center">
                                                    <span className={`
                                                        inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium
                                                        ${table.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}
                                                    `}>
                                                        {table.status === 'available' ? <CircleCheck className="w-3 h-3" strokeWidth={2.5} /> : <CircleX className="w-3 h-3" strokeWidth={2.5} />}
                                                        {table.status === 'available' ? 'Tersedia' : 'Terisi'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div
                                                className="absolute inset-x-0 bottom-0 px-3 pb-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Link
                                                    href={route('tables.edit', table.id)}
                                                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                                                >
                                                    <Pencil className="w-3 h-3" strokeWidth={2} />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(table.id)}
                                                    className="flex items-center justify-center gap-1 px-2 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3" strokeWidth={2} />
                                                    Hapus
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Empty State */}
                                {tables.length === 0 && (
                                    <div className="text-center py-16">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                            <LayoutGrid className="w-8 h-8 text-gray-400" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-gray-500 font-medium mb-2">Belum ada meja</p>
                                        <p className="text-gray-400 text-sm mb-4">Mulai tambahkan meja untuk restoran Anda</p>
                                        <Link
                                            href={route('tables.create')}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                                            Tambah Meja Pertama
                                        </Link>
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
