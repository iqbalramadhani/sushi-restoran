import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ActivityLog } from '@/types';
import { Clock, User, ArrowLeft, AlertCircle } from 'lucide-react';

interface Props {
    logs: {
        data: ActivityLog[];
        links: { url: string | null; label: string; active: boolean }[];
        next_page_url: string | null;
        prev_page_url: string | null;
        total: number;
        per_page: number;
        current_page: number;
        last_page: number;
    };
}

const actionLabels: Record<string, { label: string; color: string; bg: string }> = {
    'order_created': { label: 'Order Baru', color: 'text-blue-700', bg: 'bg-blue-100' },
    'order_processed': { label: 'Order Diproses', color: 'text-purple-700', bg: 'bg-purple-100' },
    'order_completed': { label: 'Order Selesai', color: 'text-green-700', bg: 'bg-green-100' },
    'order_cancelled': { label: 'Order Dibatalkan', color: 'text-red-700', bg: 'bg-red-100' },
    'product_created': { label: 'Produk Dibuat', color: 'text-blue-700', bg: 'bg-blue-100' },
    'product_updated': { label: 'Produk Diperbarui', color: 'text-amber-700', bg: 'bg-amber-100' },
    'product_deleted': { label: 'Produk Dihapus', color: 'text-red-700', bg: 'bg-red-100' },
    'product_soft_deleted': { label: 'Produk Dipindahkan ke Sampah', color: 'text-gray-700', bg: 'bg-gray-100' },
    'table_created': { label: 'Meja Dibuat', color: 'text-blue-700', bg: 'bg-blue-100' },
    'table_updated': { label: 'Meja Diperbarui', color: 'text-amber-700', bg: 'bg-amber-100' },
    'table_deleted': { label: 'Meja Dihapus', color: 'text-red-700', bg: 'bg-red-100' },
    'table_occupied': { label: 'Meja Ditempati', color: 'text-orange-700', bg: 'bg-orange-100' },
    'table_freed': { label: 'Meja Dikosongkan', color: 'text-green-700', bg: 'bg-green-100' },
    'category_created': { label: 'Kategori Dibuat', color: 'text-blue-700', bg: 'bg-blue-100' },
    'category_updated': { label: 'Kategori Diperbarui', color: 'text-amber-700', bg: 'bg-amber-100' },
    'category_deleted': { label: 'Kategori Dihapus', color: 'text-red-700', bg: 'bg-red-100' },
    'ingredient_created': { label: 'Bahan Baku Dibuat', color: 'text-blue-700', bg: 'bg-blue-100' },
    'ingredient_updated': { label: 'Bahan Baku Diperbarui', color: 'text-amber-700', bg: 'bg-amber-100' },
    'ingredient_deleted': { label: 'Bahan Baku Dihapus', color: 'text-red-700', bg: 'bg-red-100' },
    'unit_created': { label: 'Satuan Dibuat', color: 'text-blue-700', bg: 'bg-blue-100' },
    'unit_updated': { label: 'Satuan Diperbarui', color: 'text-amber-700', bg: 'bg-amber-100' },
    'unit_deleted': { label: 'Satuan Dihapus', color: 'text-red-700', bg: 'bg-red-100' },
    'account_request_approved': { label: 'Pengajuan Disetujui', color: 'text-green-700', bg: 'bg-green-100' },
    'account_request_rejected': { label: 'Pengajuan Ditolak', color: 'text-red-700', bg: 'bg-red-100' },
};

export default function ActivityLogsIndex({ logs }: Props) {
    return (
        <>
            <Head title="Riwayat Aktivitas" />
            <AuthenticatedLayout
                header={
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-500" strokeWidth={2} />
                            Riwayat Aktivitas
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">Catatan semua aktivitas dalam sistem</p>
                    </div>
                }
            >
                <div className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-orange-500" strokeWidth={2} />
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Log Aktivitas
                                    </h3>
                                </div>
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700">
                                    {logs.total} entri
                                </span>
                            </div>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 text-gray-500">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Waktu</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Pengguna</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Aksi</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Deskripsi</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {logs.data.map((log) => {
                                            const actionConfig = actionLabels[log.action] || {
                                                label: log.action,
                                                color: 'text-gray-600',
                                                bg: 'bg-gray-100',
                                            };
                                            return (
                                                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs">
                                                        {new Date(log.created_at).toLocaleString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                                {log.user?.name?.charAt(0).toUpperCase() ?? '?'}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{log.user?.name ?? 'System'}</p>
                                                                <p className="text-xs text-gray-400">{log.user?.username ?? '-'}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${actionConfig.bg} ${actionConfig.color}`}>
                                                            {actionConfig.label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {log.description || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-xs font-mono">
                                                        {log.ip_address || '-'}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        {logs.data.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-16 text-center">
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                            <AlertCircle className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                                        </div>
                                                        <p className="text-gray-500 font-medium">Belum ada aktivitas</p>
                                                        <p className="text-gray-400 text-sm">Aktivitas akan muncul saat ada pengguna melakukan perubahan</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden">
                                <div className="p-4 space-y-3">
                                    {logs.data.map((log) => {
                                        const actionConfig = actionLabels[log.action] || {
                                            label: log.action,
                                            color: 'text-gray-600',
                                            bg: 'bg-gray-100',
                                        };
                                        return (
                                            <div key={log.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                            {log.user?.name?.charAt(0).toUpperCase() ?? '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">{log.user?.name ?? 'System'}</p>
                                                            <p className="text-xs text-gray-400">{log.user?.username}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${actionConfig.bg} ${actionConfig.color}`}>
                                                        {actionConfig.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-2 pb-2 border-b border-gray-200">
                                                    <span>
                                                        {new Date(log.created_at).toLocaleString('id-ID', {
                                                            day: '2-digit',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                    {log.ip_address && (
                                                        <span className="font-mono text-gray-400">{log.ip_address}</span>
                                                    )}
                                                </div>
                                                <p className="text-gray-600 text-sm">{log.description || '-'}</p>
                                            </div>
                                        );
                                    })}
                                    {logs.data.length === 0 && (
                                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                                <AlertCircle className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                            </div>
                                            <p className="text-gray-500 font-medium">Belum ada aktivitas</p>
                                            <p className="text-gray-400 text-sm mt-1">Aktivitas akan muncul saat ada pengguna melakukan perubahan</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Pagination */}
                            {logs.links.length > 3 && (
                                <div className="px-6 py-4 border-t border-gray-100">
                                    <nav className="flex justify-center">
                                        <div className="inline-flex -space-x-px rounded-xl shadow-sm">
                                            {logs.links.map((link, i) => (
                                                link.url && (
                                                    <button
                                                        key={i}
                                                        onClick={() => router.get(link.url)}
                                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                                            link.active
                                                                ? 'bg-orange-500 text-white'
                                                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                                        }`}
                                                    >
                                                        {link.label.replace('&laquo;', '←').replace('&raquo;', '→')}
                                                    </button>
                                                )
                                            ))}
                                        </div>
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
