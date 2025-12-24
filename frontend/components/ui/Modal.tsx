import React, { Fragment, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Panel */}
            <div
                ref={modalRef}
                className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-6 text-left shadow-xl transition-all border border-slate-100 dark:border-slate-700"
                role="dialog"
                aria-modal="true"
            >
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold leading-6 text-slate-900 dark:text-white">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-500 transition-colors focus:outline-none"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-2">
                    {children}
                </div>
            </div>
        </div>
    );
}
