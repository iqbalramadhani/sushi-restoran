import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

interface Props {
    status?: string;
}

export default function VerifyEmail({ status }: Props) {
    return (
        <GuestLayout>
            <Head title="Verifikasi Email" />

            <div className="mb-4 text-sm text-gray-600">
                Terima kasih telah mendaftar! Sebelum memulai, bisakah Anda memverifikasi alamat email Anda dengan mengklik tautan yang baru saja kami kirimkan?
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Tautan verifikasi baru telah dikirim ke alamat email Anda.
                </div>
            )}

            <div className="mt-6 flex items-center justify-between">
                <form method="POST" action={route('verification.send')}>
                    <button
                        type="submit"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Kirim Ulang Email Verifikasi
                    </button>
                </form>

                <form method="POST" action={route('logout')}>
                    <button
                        type="submit"
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Keluar
                    </button>
                </form>
            </div>
        </GuestLayout>
    );
}
