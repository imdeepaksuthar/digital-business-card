import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function Section({ title, children, defaultOpen = false }: SectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 mb-6 overflow-hidden">
            <button
                type="button"
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none bg-slate-50/50 hover:bg-slate-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                    {title}
                </h3>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
            </button>

            {isOpen && (
                <div className="p-6 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    );
}
