import { useState, useRef, useEffect } from 'react';

interface Option {
    id: number | string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Cari...',
    disabled = false,
    className = '',
}: SearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selected = options.find(o => String(o.id) === value);

    const filtered = search.trim()
        ? options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()))
        : options;

    const handleChange = (id: number | string) => {
        onChange(String(id));
        setOpen(false);
        setSearch('');
    };

    const handleFocus = () => {
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={handleFocus}
                disabled={disabled}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
                <span className={`flex-1 truncate ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
                    {selected ? selected.label : placeholder}
                </span>
                {selected && (
                    <span
                        onClick={handleClear}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer flex-shrink-0"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                )}
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                    <div className="p-2 border-b border-gray-100">
                        <input
                            ref={inputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Ketik untuk mencari..."
                            className="w-full px-2 py-1 text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <ul className="max-h-60 overflow-auto py-1">
                        {filtered.length === 0 ? (
                            <li className="px-3 py-2 text-sm text-gray-500 text-center">Tidak ditemukan</li>
                        ) : (
                            filtered.map((opt) => (
                                <li
                                    key={opt.id}
                                    onClick={() => handleChange(opt.id)}
                                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 ${
                                        String(opt.id) === value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                                    }`}
                                >
                                    {opt.label}
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
