import { useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Login({ status, errors }: { status?: string; errors?: Record<string, string> }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [processing, setProcessing] = useState(false);

    useEffect(() => { return () => setForm({ email: '', password: '' }); }, []);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.post(route('login'), form, { onFinish: () => setProcessing(false) });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />
            {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input id="email" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} required autoFocus autoComplete="username" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        {errors?.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} required autoComplete="current-password" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                        {errors?.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <Link href={route('register')} className="text-sm text-gray-600 hover:text-gray-900">Belum punya akun? Daftar</Link>
                    </div>
                    <button type="submit" disabled={processing} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none disabled:opacity-50">
                        {processing ? 'Memproses...' : 'Masuk'}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
