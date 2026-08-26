import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    ShoppingCart,
    UtensilsCrossed,
    PackageOpen,
    Table as TableIcon,
    Ruler,
    Tag,
    LogOut,
    User,
    Menu,
    X,
    ChevronDown,
    Clock,
} from 'lucide-react';

interface Props {
    children: React.ReactNode;
    header?: React.ReactNode;
}

export default function AuthenticatedLayout({ children, header }: Props) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { props } = usePage();
    const user = props.auth?.user;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { href: route('dashboard'), label: 'Dasbor', icon: LayoutDashboard, active: route().current('dashboard') },
        { href: route('orders.index'), label: 'Pesanan', icon: ShoppingCart, active: route().current('orders.*') },
        { href: route('products.index'), label: 'Menu', icon: UtensilsCrossed, active: route().current('products.*') },
        { href: route('ingredients.index'), label: 'Bahan Baku', icon: PackageOpen, active: route().current('ingredients.*') },
        { href: route('tables.index'), label: 'Meja', icon: TableIcon, active: route().current('tables.*') },
        { href: route('units.index'), label: 'Satuan', icon: Ruler, active: route().current('units.*') },
        { href: route('categories.index'), label: 'Kategori', icon: Tag, active: route().current('categories.*') },
        { href: route('activity-logs.index'), label: 'Riwayat', icon: Clock, active: route().current('activity-logs.*') },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-slate-100">
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <Link href={route('dashboard')} className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-md">
                                    <UtensilsCrossed className="w-4 h-4 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    Restoran
                                </span>
                            </Link>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center gap-1">
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    return (
                                        <Link
                                            key={link.label}
                                            href={link.href}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                link.active
                                                    ? 'bg-orange-50 text-orange-600 shadow-sm'
                                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" strokeWidth={2} />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center gap-3">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                {mobileMenuOpen
                                    ? <X className="w-5 h-5" strokeWidth={2} />
                                    : <Menu className="w-5 h-5" strokeWidth={2} />
                                }
                            </button>

                            {/* User dropdown */}
                            <div className="relative hidden sm:block" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                    <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden">
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <User className="w-4 h-4" strokeWidth={2} />
                                            Profil
                                        </Link>
                                        <button
                                            onClick={() => router.post(route('logout'))}
                                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" strokeWidth={2} />
                                            Keluar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white">
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                            link.active
                                                ? 'bg-orange-50 text-orange-600'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" strokeWidth={2} />
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <div className="pt-2 border-t border-gray-100 mt-2 px-4 py-2 flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                                <button
                                    onClick={() => { setMobileMenuOpen(false); router.post(route('logout')); }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <LogOut className="w-5 h-5" strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {/* Header */}
            {header && (
                <header className="bg-white/60 backdrop-blur-sm border-b border-gray-200">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main */}
            <main className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
