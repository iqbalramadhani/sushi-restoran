import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Users,
    CircleCheck,
    XCircle,
    Clock,
    Eye,
    CheckCircle2,
    X,
    ArrowLeft,
    UserPlus,
    LayoutList,
} from 'lucide-react';

interface AccountRequest {
    id: number;
    name: string;
    username: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    notes: string | null;
    created_at: string;
    approver?: { name: string };
}

interface Props {
    requests: {
        data: AccountRequest[];
        links: { url: string | null; label: string; active: boolean }[];
        next_page_url: string | null;
        prev_page_url: string | null;
    };
}

export default function AccountRequestsIndex({ requests }: Props) {
    const handleApprove = (id: number) => {
        router.post(route('account-requests.approve', id), {}, {
            onSuccess: () => {},
        });
    };

    const handleReject = (id: number) => {
        router.post(route('account-requests.reject', id), {});
    };

    const pendingCount = requests.data.filter(r => r.status === 'pending').length;

    const statusConfig = {
        pending: { label: 'Menunggu', bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500', icon: Clock },
        approved: { label: 'Disetujui', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', icon: CircleCheck },
        rejected: { label: 'Ditolak', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', icon: XCircle },
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-orange-500" strokeWidth={2} />
                        Pengajuan Akun
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Kelola pengajuan akun dari pelanggan baru</p>
                </div>
            }
        >
            <Head title="Pengajuan Akun" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-orange-500" strokeWidth={2} />
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">
                                            Daftar Pengajuan Akun
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {pendingCount} pengajuan menunggu
                                        </p>
                                    </div>
                                </div>
                                {pendingCount > 0 && (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 animate-pulse">
                                        <Clock className="w-3 h-3 mr-1" strokeWidth={2} />
                                        {pendingCount} baru
                                    </span>
                                )}
                            </div>
                            <Link
                                href={route('dashboard')}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                                Kembali ke Dasbor
                            </Link>
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nama</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Username</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {requests.data.map((req) => {
                                        const config = statusConfig[req.status] || statusConfig.pending;
                                        const StatusIcon = config.icon;
                                        return (
                                            <tr key={req.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                            {req.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{req.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{req.username}</td>
                                                <td className="px-6 py-4 text-gray-500">{req.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                                                        <StatusIcon className="w-3 h-3" strokeWidth={2} />
                                                        {config.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-xs">
                                                    {new Date(req.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Link href={route('account-requests.show', req.id)} className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium mr-2">
                                                        <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                                                        Detail
                                                    </Link>
                                                    {req.status === 'pending' && (
                                                        <>
                                                            <button onClick={() => handleApprove(req.id)} className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium mr-2">
                                                                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                                Setujui
                                                            </button>
                                                            <button onClick={() => handleReject(req.id)} className="inline-flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium">
                                                                <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
                                                                Tolak
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {requests.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-16 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">
                                                        <LayoutList className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                                    </div>
                                                    <p className="text-gray-500 font-medium">Belum ada pengajuan akun</p>
                                                    <p className="text-gray-400 text-sm">Pengajuan akun akan muncul di sini</p>
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
                                {requests.data.map((req) => {
                                    const config = statusConfig[req.status] || statusConfig.pending;
                                    const StatusIcon = config.icon;
                                    return (
                                        <div key={req.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                        {req.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{req.name}</p>
                                                        <p className="text-xs text-gray-500">{req.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
                                                    <StatusIcon className="w-3 h-3" strokeWidth={2} />
                                                    {config.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
                                                <span>Username: <span className="font-mono">{req.username}</span></span>
                                                <span>{new Date(req.created_at).toLocaleDateString('id-ID')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Link href={route('account-requests.show', req.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                                    <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                                                    Detail
                                                </Link>
                                                {req.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => handleApprove(req.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-green-700 bg-green-100 rounded-xl hover:bg-green-200 transition-colors">
                                                            <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                                                            Setujui
                                                        </button>
                                                        <button onClick={() => handleReject(req.id)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs font-medium text-red-600 bg-red-100 rounded-xl hover:bg-red-200 transition-colors">
                                                            <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
                                                            Tolak
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                {requests.data.length === 0 && (
                                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                                            <LayoutList className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                                        </div>
                                        <p className="text-gray-500 font-medium">Belum ada pengajuan</p>
                                        <p className="text-gray-400 text-sm mt-1">Pengajuan akun akan muncul di sini</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pagination */}
                        {requests.links.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-100">
                                <nav className="flex justify-center">
                                    <div className="inline-flex -space-x-px rounded-xl shadow-sm">
                                        {requests.links.map((link, i) => (
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
    );
}
