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
        <div className="glass-panel p-6 md:p-8 rounded-[2rem] h-full flex flex-col relative overflow-hidden">
            {/* Decorative Background Icon */}
            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                <MessageCircle className="w-32 h-32 text-white" />
            </div>

            <h3 className="text-sm font-bold text-[#cfaa48] mb-6 uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-2 relative z-10">
                <MessageCircle className="w-4 h-4 text-[#cfaa48]" />
                Quick Enquiry
            </h3>

            {success ? (
                <div className="p-8 bg-[#d4af37]/10 text-[#d4af37] rounded-2xl text-center border border-[#d4af37]/20 my-auto relative z-10 animate-in fade-in zoom-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 flex items-center justify-center mx-auto mb-4">
                        <MessageCircle className="w-6 h-6 text-[#cfaa48]" />
                    </div>
                    <p className="font-bold text-lg mb-2 text-white">Message Sent!</p>
                    <p className="text-xs text-slate-400">We'll get back to you shortly.</p>
                    <button onClick={() => setSuccess(false)} className="text-xs font-bold uppercase tracking-wider underline mt-6 hover:text-white transition-colors">Send another</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 flex-1 relative z-10">
                    <div className="group">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5 block group-focus-within:text-[#cfaa48] transition-colors">Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            required
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:border-[#cfaa48]/50 focus:ring-1 focus:ring-[#cfaa48]/50 transition-all placeholder:text-slate-600 text-sm text-slate-200 backdrop-blur-sm"
                        />
                    </div>
                    <div className="group">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5 block group-focus-within:text-[#cfaa48] transition-colors">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Enter your mobile number"
                            required
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:border-[#cfaa48]/50 focus:ring-1 focus:ring-[#cfaa48]/50 transition-all placeholder:text-slate-600 text-sm text-slate-200 backdrop-blur-sm"
                        />
                    </div>
                    <div className="group">
                        <label className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1.5 block group-focus-within:text-[#cfaa48] transition-colors">Message</label>
                        <textarea
                            placeholder="How can we help you?"
                            rows={3}
                            value={form.message}
                            onChange={e => setForm({ ...form, message: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-black/20 border border-white/10 focus:outline-none focus:border-[#cfaa48]/50 focus:ring-1 focus:ring-[#cfaa48]/50 transition-all placeholder:text-slate-600 text-sm text-slate-200 resize-none backdrop-blur-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3.5 rounded-xl bg-[#d4af37] hover:bg-[#b08d26] text-[#0f172a] font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 mt-4"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Send Message
                    </button>
                </form>
            )}
        </div>
    );
}
