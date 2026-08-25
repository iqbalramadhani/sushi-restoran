import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ProfileEdit({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        router.patch(route('profile.update'), { name, email }, {
            onError: (err) => setErrors(err),
            onSuccess: () => setErrors({}),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <>
            <Head title="Profil" />
            <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Profil</h2>}>
                <div className="py-6">
                    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
                        {/* Success Alert */}
                        {status && (
                            <div className="mb-4 flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {status}
                            </div>
                        )}

                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header */}
                            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md">
                                        <span className="text-white text-xl font-bold">
                                            {name ? name.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Pengaturan Profil</h3>
                                        <p className="text-sm text-gray-500">Kelola informasi akun Anda</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="space-y-5">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                            placeholder="Masukkan nama lengkap"
                                        />
                                        {errors.name && <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Email
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                                            placeholder="Masukkan email"
                                        />
                                        {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
                                        {mustVerifyEmail && !email?.includes('@') && (
                                            <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                                <p className="text-sm text-blue-700">
                                                    Email Anda belum diverifikasi.
                                                    <button
                                                        type="button"
                                                        onClick={() => router.post(route('verification.send'))}
                                                        className="ml-1 font-medium text-blue-600 hover:text-blue-800 underline"
                                                    >
                                                        Klik di sini untuk mengirim ulang email verifikasi.
                                                    </button>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl text-sm font-semibold hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Menyimpan...
                                                </>
                                            ) : 'Simpan Perubahan'}
                                        </button>
                                        <Link
                                            href={route('dashboard')}
                                            className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
                                        >
                                            Batal
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Danger Zone - Delete Account */}
                        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-red-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-red-100 bg-red-50">
                                <h3 className="font-semibold text-red-800">Zona Bahaya</h3>
                                <p className="text-sm text-red-600 mt-0.5">Hapus akun secara permanen</p>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">Setelah menghapus akun, semua data Anda akan dihapus secara permanen.</p>
                                        <p className="text-xs text-gray-500 mt-1">Silakan hubungi admin jika Anda ingin membatalkan akun.</p>
                                    </div>
                                    <button
                                        onClick={() => { if (confirm('Yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) router.delete(route('profile.destroy')); }}
                                        className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors"
                                    >
                                        Hapus Akun
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}
