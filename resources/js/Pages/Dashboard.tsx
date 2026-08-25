import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { DashboardStats } from '@/types';
import {
    ShoppingCart,
    Users,
    Clock,
    Plus,
    UtensilsCrossed,
    Table as TableIcon,
    ReceiptText,
    PartyPopper,
    Activity,
    BarChart3,
} from 'lucide-react';

interface Props {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: Props) {
    return (
        <>
            <Head title="Dasbor" />
            <AuthenticatedLayout
                header={
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-orange-500" strokeWidth={2} />
                            Dasbor
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">Selamat datang kembali! Berikut ringkasan hari ini.</p>
                    </div>
                }
            >
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                                <span className="text-white font-bold text-sm">Rp</span>
                            </div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pendapatan Hari Ini</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                            Rp {stats.revenue_today.toLocaleString('id-ID')}
                        </p>
                    </div>

                    <div className="bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-sm">
                                <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2} />
                            </div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Hari Ini</p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                            <BarChart3 className="w-5 h-5 text-blue-500" strokeWidth={2} />
                            {stats.total_orders_today}
                        </p>
                    </div>

                    <div className="bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-sm">
                                <Users className="w-5 h-5 text-white" strokeWidth={2} />
                            </div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Meja Tersedia</p>
                        </div>
                        <p className="text-2xl font-bold text-green-600">
                            {stats.available_tables}
                        </p>
                    </div>

                    <div className="bg-white overflow-hidden rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
                                <Clock className="w-5 h-5 text-white" strokeWidth={2} />
                            </div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Pending</p>
                        </div>
                        <p className="text-2xl font-bold text-orange-500">
                            {stats.pending_orders}
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6">
                    <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <PartyPopper className="w-5 h-5 text-orange-500" strokeWidth={2} />
                        Aksi Cepat
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href={route('orders.create')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 border border-transparent rounded-xl font-semibold text-sm text-white hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all shadow-md hover:shadow-lg"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Order Baru
                        </Link>
                        <Link
                            href={route('products.index')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 border border-transparent rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-200 focus:bg-gray-200 transition-colors"
                        >
                            <UtensilsCrossed className="w-4 h-4" strokeWidth={2} />
                            Kelola Menu
                        </Link>
                        <Link
                            href={route('tables.index')}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 border border-transparent rounded-xl font-semibold text-sm text-gray-700 hover:bg-gray-200 focus:bg-gray-200 transition-colors"
                        >
                            <TableIcon className="w-4 h-4" strokeWidth={2} />
                            Kelola Meja
                        </Link>
                    </div>
                </div>

                {/* Pending Orders Alert */}
                {stats.pending_orders > 0 && (
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-orange-600" strokeWidth={2} />
                            </div>
                            <div>
                                <p className="font-semibold text-orange-800">
                                    Ada {stats.pending_orders} order pending
                                </p>
                                <p className="text-sm text-orange-600 mt-0.5">
                                    Silakan proses order tersebut segera.
                                </p>
                            </div>
                            <Link
                                href={route('orders.index')}
                                className="ml-auto px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-xl hover:bg-orange-700 transition-colors flex-shrink-0 inline-flex items-center gap-1.5"
                            >
                                <ReceiptText className="w-4 h-4" strokeWidth={2} />
                                Lihat Order
                            </Link>
                        </div>
                    </div>
                )}
            </AuthenticatedLayout>
        </>
    );
}
