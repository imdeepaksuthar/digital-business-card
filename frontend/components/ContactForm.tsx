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
        <div className="glass-panel p-6 md:p-8 rounded-[2rem] h-full flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-wide">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                Quick Enquiry
            </h3>

            {success ? (
                <div className="p-8 bg-green-500/10 text-green-600 rounded-2xl text-center border border-green-500/20 my-auto">
                    <p className="font-bold text-lg mb-2">Thank you!</p>
                    <p className="text-sm">We have received your message.</p>
                    <button onClick={() => setSuccess(false)} className="text-xs font-bold underline mt-4 hover:text-green-800">Send another</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                    <div>
                        <input
                            type="text"
                            placeholder="Your Name"
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-sm backdrop-blur-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="tel"
                            placeholder="Your Phone Number"
                            required
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-sm backdrop-blur-sm"
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Message (Optional)"
                            rows={3}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            className="w-full px-4 py-3.5 rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400 text-sm resize-none backdrop-blur-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-blue-500/30 mt-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Send Message
                    </button>
                </form>
            )}
        </div>
    );
}
