import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function RegisterSuccess() {
    return (
        <GuestLayout>
            <Head title="Pengajuan Berhasil" />

            <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Pengajuan Akun Berhasil!</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Terima kasih telah mengajukan akun. Permintaan Anda sedang menunggu persetujuan dari admin.
                </p>
                <p className="mt-2 text-sm text-gray-600">
                    Anda akan dapat masuk setelah akun disetujui.
                </p>
                <div className="mt-6">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Kembali ke Masuk
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
