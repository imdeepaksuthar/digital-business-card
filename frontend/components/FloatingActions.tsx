'use client';

import { useState } from 'react';
import { Plus, X, Share2, UserPlus, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface FloatingActionsProps {
    card: any;
}

export default function FloatingActions({ card }: FloatingActionsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: card.business_name,
                text: `Check out my digital business card: ${card.business_name}`,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    const handleDownloadVcf = () => {
        alert('Download VCF feature coming soon!');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.button
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            transition={{ delay: 0.05 }}
                            onClick={() => window.open(`https://wa.me/${card.phone}`, '_blank')}
                            className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:bg-[#20bd5a] transition-colors border border-white/20"
                            title="WhatsApp"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            transition={{ delay: 0.1 }}
                            onClick={handleShare}
                            className="w-12 h-12 rounded-full bg-[#1c2e22] text-[#cfaa48] shadow-lg flex items-center justify-center hover:bg-[#2d4a36] transition-colors border border-[#cfaa48]/20"
                            title="Share Card"
                        >
                            <Share2 className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.8 }}
                            transition={{ delay: 0.15 }}
                            onClick={handleDownloadVcf}
                            className="w-12 h-12 rounded-full bg-white text-[#1c2e22] shadow-lg flex items-center justify-center hover:bg-slate-100 transition-colors border border-white/20"
                            title="Save Contact"
                        >
                            <UserPlus className="w-5 h-5" />
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all bg-[#cfaa48] text-[#1c2e22] active:scale-95 border border-[#cfaa48]/50"
            >
                <span className="font-bold text-sm tracking-wide ml-1">{isOpen ? 'Close' : 'Actions'}</span>
                <div className="w-10 h-10 rounded-full bg-[#1c2e22] flex items-center justify-center text-[#cfaa48]">
                    <Plus className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} strokeWidth={3} />
                </div>
            </button>
        </div>
    );
}
