import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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
            onSuccess: () => {
                // Will redirect to dashboard after approval creates user
            }
        });
    };

    const handleReject = (id: number) => {
        router.post(route('account-requests.reject', id), {});
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Pengajuan Akun
                </h2>
            }
        >
            <Head title="Pengajuan Akun" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Daftar Pengajuan Akun
                                </h3>
                                <Link
                                    href={route('dashboard')}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    ← Kembali ke Dasbor
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Nama
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Username
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Tanggal
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {requests.data.map((req) => (
                                            <tr key={req.id}>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                                    {req.name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {req.username}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {req.email}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm">
                                                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                                        req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        req.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {req.status === 'pending' ? 'Menunggu' :
                                                         req.status === 'approved' ? 'Disetujui' :
                                                         'Ditolak'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                                    {new Date(req.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('account-requests.show', req.id)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        Detail
                                                    </Link>
                                                    {req.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleApprove(req.id)}
                                                            className="text-green-600 hover:text-green-900 mr-3"
                                                        >
                                                            Setujui
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {requests.data.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    Belum ada pengajuan akun.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {requests.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                                        {requests.links.map((link, i) => (
                                            link.url && (
                                                <button
                                                    key={i}
                                                    onClick={() => router.get(link.url)}
                                                    disabled={!link.url}
                                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                                    } ${i === 0 ? 'rounded-l-md' : ''} ${i === requests.links.length - 1 ? 'rounded-r-md' : ''}`}
                                                >
                                                    {link.label.replace('&laquo;', '←').replace('&raquo;', '→')}
                                                </button>
                                            )
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
