import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, className, value, ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">{label}</label>}
            <input
                className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${error ? 'border-red-500 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-900 dark:text-white'} ${className || ''}`}
                value={value ?? ''}
                {...props}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
