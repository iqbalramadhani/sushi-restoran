import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardStats } from '@/types';

interface Props {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Dashboard
                    </h2>
                }
            >
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                                        Pendapatan Hari Ini
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        Rp {stats.revenue_today.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                                        Total Order Hari Ini
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-gray-900">
                                        {stats.total_orders_today}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                                        Meja Tersedia
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-green-600">
                                        {stats.available_tables}
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                                        Order Pending
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-orange-500">
                                        {stats.pending_orders}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Aksi Cepat
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    <Link
                                        href={route('orders.create')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:bg-blue-700"
                                    >
                                        + Order Baru
                                    </Link>
                                    <Link
                                        href={route('products.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-100 border border-transparent rounded-md font-semibold text-gray-800 hover:bg-gray-200 focus:bg-gray-200"
                                    >
                                        Kelola Menu
                                    </Link>
                                    <Link
                                        href={route('tables.index')}
                                        className="inline-flex items-center px-4 py-2 bg-gray-100 border border-transparent rounded-md font-semibold text-gray-800 hover:bg-gray-200 focus:bg-gray-200"
                                    >
                                        Kelola Meja
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="mt-6 bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                    Order Terbaru
                                </h3>
                                {stats.pending_orders > 0 ? (
                                    <div className="text-orange-500 font-medium">
                                        Ada {stats.pending_orders} order pending yang perlu diproses.
                                    </div>
                                ) : (
                                    <div className="text-gray-500">Tidak ada order pending.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
