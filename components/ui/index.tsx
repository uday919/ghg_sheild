'use client';
// ============================================================
// GHG Shield — Base UI Components
// ============================================================
import React from 'react';

// --------------- Button ---------------
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0f0a] disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-[#4CAF80] hover:bg-[#3d9d6f] text-black focus:ring-[#4CAF80]',
        secondary: 'bg-[#0d1a0d] hover:bg-[#1a2e1a] text-[#4CAF80] border border-[#1a5c3844] focus:ring-[#4CAF80]',
        danger: 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 focus:ring-red-500',
        ghost: 'hover:bg-[#0d1a0d] text-gray-400 hover:text-white focus:ring-[#4CAF80]',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs gap-1.5',
        md: 'px-4 py-2 text-sm gap-2',
        lg: 'px-6 py-3 text-base gap-2.5',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
}

// --------------- Input ---------------
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-gray-300">{label}</label>
                )}
                <input
                    ref={ref}
                    className={`w-full px-3 py-2 bg-[#0a0f0a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF80] focus:border-transparent transition-colors ${error ? 'border-red-500' : 'border-[#1a5c3844]'
                        } ${className}`}
                    {...props}
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
        );
    }
);
Input.displayName = 'Input';

// --------------- Select ---------------
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, options, className = '', ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-gray-300">{label}</label>
                )}
                <select
                    ref={ref}
                    className={`w-full px-3 py-2 bg-[#0a0f0a] border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#4CAF80] focus:border-transparent transition-colors ${error ? 'border-red-500' : 'border-[#1a5c3844]'
                        } ${className}`}
                    {...props}
                >
                    <option value="">Select...</option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
        );
    }
);
Select.displayName = 'Select';

// --------------- Textarea ---------------
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label className="block text-sm font-medium text-gray-300">{label}</label>
                )}
                <textarea
                    ref={ref}
                    className={`w-full px-3 py-2 bg-[#0a0f0a] border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CAF80] focus:border-transparent transition-colors resize-none ${error ? 'border-red-500' : 'border-[#1a5c3844]'
                        } ${className}`}
                    {...props}
                />
                {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

// --------------- Card ---------------
interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
    return (
        <div
            className={`bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl p-6 ${hover ? 'hover:border-[#4CAF80]/30 transition-colors cursor-pointer' : ''
                } ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

// --------------- Badge ---------------
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'warning' | 'danger' | 'info' | 'default';
    size?: 'sm' | 'md';
    className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className = '' }: BadgeProps) {
    const variants = {
        success: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
        warning: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
        danger: 'bg-red-500/15 text-red-400 border-red-500/20',
        info: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
        default: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span className={`inline-flex items-center font-medium rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
            {children}
        </span>
    );
}

// --------------- Modal ---------------
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative bg-[#0d1a0d] border border-[#1a5c3844] rounded-xl shadow-2xl w-full ${sizes[size]} mx-4 max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between p-6 border-b border-[#1a5c3844]">
                    <h2 className="text-lg font-semibold text-white font-[family-name:var(--font-syne)]">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}

// --------------- Table ---------------
interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    className?: string;
}

interface TableProps<T> {
    columns: Column<T>[];
    data: T[];
    onRowClick?: (item: T) => void;
    emptyMessage?: string;
}

export function Table<T extends Record<string, unknown>>({ columns, data, onRowClick, emptyMessage = 'No data available' }: TableProps<T>) {
    return (
        <div className="overflow-x-auto rounded-lg border border-[#1a5c3844]">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-[#1a5c3844] bg-[#0a0f0a]">
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={`px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider ${col.className || ''}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#1a5c3844]">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, idx) => (
                            <tr
                                key={idx}
                                className={`bg-[#0d1a0d] hover:bg-[#1a2e1a] transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className={`px-4 py-3 text-sm text-gray-300 ${col.className || ''}`}>
                                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

// --------------- Stat Card ---------------
interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    trend?: { value: number; label: string };
}

export function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
    return (
        <Card>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-white mt-1 font-[family-name:var(--font-dm-mono)]">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                    {trend && (
                        <p className={`text-xs mt-2 ${trend.value >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-2 bg-[#4CAF80]/10 rounded-lg text-[#4CAF80]">{icon}</div>
                )}
            </div>
        </Card>
    );
}

// --------------- Skeleton Loader ---------------
export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`animate-pulse bg-[#1a5c3844] rounded ${className}`} />
    );
}
