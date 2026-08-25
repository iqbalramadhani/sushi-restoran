import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Approver {
    name: string;
}

interface AccountRequest {
    id: number;
    name: string;
    username: string;
    email: string;
    status: 'pending' | 'approved' | 'rejected';
    notes: string | null;
    created_at: string;
    approver?: Approver;
}

interface Props {
    request: AccountRequest;
}

export default function AccountRequestShow({ request }: Props) {
    const [rejectNotes, setRejectNotes] = useState('');

    const handleApprove = () => {
        router.post(route('account-requests.approve', request.id), {});
    };

    const handleReject = () => {
        router.post(route('account-requests.reject', request.id), { notes: rejectNotes });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Detail Pengajuan Akun
                </h2>
            }
        >
            <Head title="Detail Pengajuan" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-4">
                        <Link
                            href={route('account-requests.index')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            ← Kembali ke Daftar
                        </Link>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Informasi Pengajuan
                                </h3>
                                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
                                    request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {request.status === 'pending' ? 'Menunggu Persetujuan' :
                                     request.status === 'approved' ? 'Disetujui' :
                                     'Ditolak'}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <p className="mt-1 text-sm text-gray-900">{request.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Username</label>
                                    <p className="mt-1 text-sm text-gray-900">{request.username}</p>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="mt-1 text-sm text-gray-900">{request.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Tanggal Pengajuan</label>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(request.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                {request.approver && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-700">Disetujui Oleh</label>
                                        <p className="mt-1 text-sm text-gray-900">{request.approver.name}</p>
                                    </div>
                                )}
                                {request.notes && (
                                    <div className="sm:col-span-2">
                                        <label className="text-sm font-medium text-gray-700">Catatan</label>
                                        <p className="mt-1 text-sm text-gray-900">{request.notes}</p>
                                    </div>
                                )}
                            </div>

                            {request.status === 'pending' && (
                                <div className="mt-8 flex items-center justify-end space-x-4">
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Catatan Penolakan (opsional)</label>
                                        <textarea
                                            value={rejectNotes}
                                            onChange={(e) => setRejectNotes(e.target.value)}
                                            placeholder="Alasan penolakan..."
                                            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={handleReject}
                                            className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                                        >
                                            Tolak
                                        </button>
                                        <button
                                            onClick={handleApprove}
                                            className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                                        >
                                            Setujui & Masuk
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
