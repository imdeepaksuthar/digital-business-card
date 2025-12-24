import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '../ui/Button';

interface ImageUploadProps {
    label?: string;
    value?: string;
    onChange: (file: File | null) => void;
    preview?: string;
    className?: string;
}

export function ImageUpload({ label, value, onChange, preview, className }: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(preview || value || null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
    };

    const handleFile = (file: File) => {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        onChange(file);
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewUrl(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = '';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    };

    return (
        <div className={className}>
            {label && <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">{label}</label>}

            <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`
                    relative group cursor-pointer
                    w-full h-40 rounded-2xl border-2 border-dashed transition-all duration-200 ease-in-out
                    flex flex-col items-center justify-center
                    ${isDragging
                        ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10'
                        : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'}
                    ${previewUrl ? 'border-none p-0 overflow-hidden' : ''}
                `}
            >
                {previewUrl ? (
                    <>
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <Button size="sm" variant="outline" className="mr-2 pointer-events-none text-white border-white hover:bg-white hover:text-slate-900">Change</Button>
                            <button
                                onClick={handleRemove}
                                className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
                            <Upload className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Click or drag to upload
                        </p>
                        <p className="text-xs text-slate-500 mt-1">SVG, PNG, JPG (Max 2MB)</p>
                    </div>
                )}

                <input
                    type="file"
                    ref={inputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}
