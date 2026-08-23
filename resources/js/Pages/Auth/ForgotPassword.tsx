import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

interface Props {
    status?: string;
}

export default function ForgotPassword({ status }: Props) {
    const [email, setEmail] = useState('');
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post(route('password.email'), { email });
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <div className="mb-4 text-sm text-gray-600">
                Lupa password Anda? Tidak masalah. Beritahu kami alamat email Anda dan kami akan mengirimkan tautan untuk mereset password Anda.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">{status}</div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                            autoComplete="username"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Tautan Reset'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
