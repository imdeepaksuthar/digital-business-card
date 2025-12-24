"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateCard() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        business_name: '',
        tagline: '',
        description: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        theme_color: '#3b82f6',
    });

    const [errors, setErrors] = useState<any>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.post('/cards', formData);
            router.push('/dashboard');
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                alert('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-900">
            <div className="max-w-2xl mx-auto">
                <Link href="/dashboard" className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-8">Create New Card</h1>

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl space-y-6">
                    <div className="space-y-4">
                        <Input
                            label="Business Name *"
                            value={formData.business_name}
                            onChange={e => setFormData({ ...formData, business_name: e.target.value })}
                            error={errors.business_name?.[0]}
                            placeholder="Acme Corp"
                        />
                        <Input
                            label="Tagline"
                            value={formData.tagline}
                            onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                            error={errors.tagline?.[0]}
                            placeholder="Innovation at its best"
                        />

                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Description</label>
                            <textarea
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Tell us about your business..."
                            ></textarea>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Phone"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                error={errors.phone?.[0]}
                                placeholder="+1 234 567 890"
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                error={errors.email?.[0]}
                                placeholder="hello@acme.com"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Website"
                                value={formData.website}
                                onChange={e => setFormData({ ...formData, website: e.target.value })}
                                error={errors.website?.[0]}
                                placeholder="https://acme.com"
                            />
                            <Input
                                label="Address"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                error={errors.address?.[0]}
                                placeholder="123 Main St, City"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Theme Color</label>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="color"
                                    value={formData.theme_color}
                                    onChange={e => setFormData({ ...formData, theme_color: e.target.value })}
                                    className="h-10 w-20 rounded cursor-pointer border-0"
                                />
                                <span className="text-sm text-slate-500">{formData.theme_color}</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                        <Button type="submit" isLoading={loading}>
                            Create Card
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
