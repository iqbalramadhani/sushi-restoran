import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table } from '@/types';

interface Props {
    tables: Table[];
    success?: string;
}

export default function TableIndex({ tables, success }: Props) {
    const handleOccupied = (id: number) => router.post(route('tables.occupy', id), null, { preserveScroll: true });
    const handleFree = (id: number) => router.post(route('tables.free', id), null, { preserveScroll: true });

    return (
        <>
            <Head title="Kelola Meja" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Kelola Meja</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{success}</div>}
                        <div className="bg-white shadow-sm sm:rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-800">Peta Meja</h3>
                                <a href={route('tables.create')} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700">+ Tambah Meja</a>
                            </div>
                            <div className="flex gap-6 mb-6 text-sm">
                                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-400"></span> Tersedia ({tables.filter(t => t.status === 'available').length})</div>
                                <div className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-orange-400"></span> Terisi ({tables.filter(t => t.status === 'occupied').length})</div>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                {tables.map((table) => (
                                    <div key={table.id} onClick={() => table.status === 'available' ? handleOccupied(table.id) : handleFree(table.id)}
                                        className={`relative flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-colors ${table.status === 'available' ? 'bg-green-100 hover:bg-green-200' : 'bg-orange-100 hover:bg-orange-200'}`}>
                                        <span className="font-bold text-gray-800 text-lg">{table.name}</span>
                                        <span className="text-xs text-gray-500">{table.capacity} kursi</span>
                                        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${table.status === 'available' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                                            {table.status === 'available' ? 'Free' : 'Occupied'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            {tables.length === 0 && <div className="text-center py-12 text-gray-500">Belum ada meja.</div>}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
