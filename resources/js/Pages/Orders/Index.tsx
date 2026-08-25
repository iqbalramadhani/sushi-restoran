import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Order } from '@/types';

interface Props {
    orders: Order[];
    pending: Order[];
}

export default function OrderIndex({ orders, pending }: Props) {
    const statusColors = {
        pending: { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500' },
        processed: { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
        completed: { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
        cancelled: { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
    };

    return (
        <>
            <Head title="Pesanan" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Pesanan</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Pending Section */}
                        {pending && pending.length > 0 && (
                            <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-orange-800">
                                            Order Pending ({pending.length})
                                        </h3>
                                    </div>
                                    <Link
                                        href={route('orders.create')}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Order Baru
                                    </Link>
                                </div>
                                <div className="space-y-3">
                                    {pending.map((order) => (
                                        <div key={order.id} className="bg-white rounded-xl border border-orange-100 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-shadow">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm flex-shrink-0">
                                                    #{order.id}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">Meja {order.table?.name ?? '-'}</p>
                                                    <p className="text-xs text-gray-500">{order.items?.length ?? 0} item</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 sm:gap-4">
                                                <span className="font-bold text-gray-900">Rp {Number(order.total).toLocaleString('id-ID')}</span>
                                                <Link
                                                    href={route('orders.show', order.id)}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Proses
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* All Orders */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Desktop Table */}
                            <div className="hidden md:block">
                                <div className="p-4 sm:p-6 border-b border-gray-100">
                                    <h3 className="text-lg font-semibold text-gray-800">Semua Pesanan</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-500">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Meja</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Item</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Total</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Waktu</th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {orders.map((order) => {
                                                const colors = statusColors[order.status as keyof typeof statusColors] || statusColors.pending;
                                                return (
                                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{order.id}</td>
                                                        <td className="px-6 py-4 font-medium text-gray-900">{order.table?.name ?? '-'}</td>
                                                        <td className="px-6 py-4 text-gray-500">{order.items?.length ?? 0} item</td>
                                                        <td className="px-6 py-4 font-semibold text-gray-900">Rp {Number(order.total).toLocaleString('id-ID')}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-gray-500 text-xs">{new Date(order.created_at).toLocaleString('id-ID')}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Link href={route('orders.show', order.id)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Detail</Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {orders.length === 0 && (
                                                <tr><td colSpan={7} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                        </svg>
                                                        <p className="text-gray-500 font-medium">Belum ada pesanan</p>
                                                        <p className="text-gray-400 text-sm">Order pertama Anda akan muncul di sini</p>
                                                    </div>
                                                </td></tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden">
                                <div className="p-4 border-b border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-800">Semua Pesanan</h3>
                                        <Link
                                            href={route('orders.create')}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg text-xs font-semibold"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Order
                                        </Link>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    {orders.map((order) => {
                                        const colors = statusColors[order.status as keyof typeof statusColors] || statusColors.pending;
                                        return (
                                            <Link
                                                key={order.id}
                                                href={route('orders.show', order.id)}
                                                className="block bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors border border-gray-100"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                                                            #{order.id}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">Meja {order.table?.name ?? '-'}</p>
                                                            <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}></span>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-500">{order.items?.length ?? 0} item</span>
                                                    <span className="font-bold text-gray-900">Rp {Number(order.total).toLocaleString('id-ID')}</span>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                    {orders.length === 0 && (
                                        <div className="text-center py-12">
                                            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            <p className="text-gray-500 font-medium">Belum ada pesanan</p>
                                            <p className="text-gray-400 text-sm mt-1">Order pertama Anda akan muncul di sini</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
