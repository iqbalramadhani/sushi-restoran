import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ConfirmPassword() {
    const [form, setForm] = useState({ password: '' });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post(route('password.confirm'), form, { onFinish: () => setProcessing(false) });
    };

    return (
        <GuestLayout>
            <Head title="Konfirmasi Password" />

            <div className="mb-4 text-sm text-gray-600">
                Harap konfirmasi password Anda sebelum melanjutkan.
            </div>

            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={(e) => setForm({ password: e.target.value })}
                            required
                            autoComplete="current-password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Konfirmasi'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
