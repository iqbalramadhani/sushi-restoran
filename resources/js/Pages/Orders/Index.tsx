import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Order } from '@/types';

interface Props {
    orders: Order[];
    pending: Order[];
}

export default function OrderIndex({ orders, pending }: Props) {
    return (
        <>
            <Head title="Order" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Order</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">Daftar Order</h3>
                                <Link href={route('orders.create')} className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700">+ Order Baru</Link>
                            </div>
                            {pending && pending.length > 0 && (
                                <div className="border-b border-gray-100 p-6 bg-orange-50">
                                    <h4 className="font-semibold text-orange-700 mb-3">Order Pending ({pending.length})</h4>
                                    <div className="space-y-2">
                                        {pending.map((order) => (
                                            <div key={order.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                                                <div>
                                                    <span className="font-medium">Meja {order.table?.name}</span>
                                                    <span className="text-gray-500 text-sm ml-2">#{order.id}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-gray-600">{order.items?.length ?? 0} item</span>
                                                    <span className="font-semibold">Rp {Number(order.total).toLocaleString('id-ID')}</span>
                                                    <Link href={route('orders.show', order.id)} className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">Proses</Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-3">ID</th>
                                            <th className="px-6 py-3">Meja</th>
                                            <th className="px-6 py-3">Item</th>
                                            <th className="px-6 py-3">Total</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Waktu</th>
                                            <th className="px-6 py-3 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-mono text-gray-400">#{order.id}</td>
                                                <td className="px-6 py-4 font-medium">{order.table?.name ?? '-'}</td>
                                                <td className="px-6 py-4 text-gray-500">{order.items?.length ?? 0} item</td>
                                                <td className="px-6 py-4 font-semibold">Rp {Number(order.total).toLocaleString('id-ID')}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                        order.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                                                        order.status === 'processed' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>{order.status}</span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleString('id-ID')}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={route('orders.show', order.id)} className="text-blue-600 hover:text-blue-800">Detail</Link>
                                                </td>
                                            </tr>
                                        ))}
                                        {orders.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-500">Belum ada order.</td></tr>}
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
