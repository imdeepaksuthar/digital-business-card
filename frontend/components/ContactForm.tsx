'use client';

import { useState } from 'react';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ContactFormProps {
    cardId: number;
    whatsappNumber?: string;
}

export default function ContactForm({ cardId, whatsappNumber }: ContactFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', message: '' });
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
            const res = await fetch(`${apiUrl}/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, business_card_id: cardId }),
            });

            if (res.ok) {
                setSuccess(true);
                setForm({ name: '', phone: '', message: '' });

                // Redirect to WhatsApp
                if (whatsappNumber) {
                    const text = `Hi, I am ${form.name}. I am interested in your services. ${form.message}`;
                    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
                    window.open(url, '_blank');
                }
            }
        } catch (error) {
            console.error('Error submitting form', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 md:rounded-[2rem] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Quick Enquiry
            </h3>

            {success ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center">
                    <p className="font-semibold">Thank you!</p>
                    <p className="text-sm">We have received your message.</p>
                    <button onClick={() => setSuccess(false)} className="text-xs underline mt-2">Send another</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            placeholder="Your Phone Number"
                            required
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Message (Optional)"
                            rows={3}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Send Message
                    </button>
                </form>
            )}
        </div>
    );
}
