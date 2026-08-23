import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ProfileEdit({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(route('profile.update'), { name, email }, {
            onError: (err) => setErrors(err),
            onSuccess: () => setErrors({}),
        });
    };

    return (
        <>
            <Head title="Profil" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Profil</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                        {status && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">{status}</div>}
                        <div className="bg-white shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama</label>
                                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Surel</label>
                                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                            {mustVerifyEmail && !email?.includes('@') && (
                                                <p className="mt-2 text-sm text-gray-500">
                                                    Email Anda belum diverifikasi.
                                                    <button type="button" onClick={() => router.post(route('verification.send'))} className="ml-1 text-blue-600 hover:text-blue-800">
                                                        Klik di sini untuk mengirim ulang email verifikasi.
                                                    </button>
                                                </p>
                                            )}
                                        </div>
                                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Simpan</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
