import { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

interface Props {
    email?: string;
    token?: string;
}

export default function ResetPassword({ email, token }: Props) {
    const [form, setForm] = useState({
        email: email || '',
        password: '',
        password_confirmation: '',
    });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (email) {
            setForm(prev => ({ ...prev, email }));
        }
    }, [email]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post(route('password.store'), { ...form, token }, { onFinish: () => setProcessing(false) });
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />

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
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                            autoComplete="username"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password Baru
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                            autoComplete="new-password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                            Konfirmasi Password
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={form.password_confirmation}
                            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                            required
                            autoComplete="new-password"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {processing ? 'Memproses...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
