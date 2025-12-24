'use client';

import { useState } from 'react';
import { Plus, X, Phone, Share2, UserPlus, MessageCircle } from 'lucide-react';
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
        // Simple VCF generation logic or link to backend endpoint
        // For now, alert or mock
        alert('Download VCF feature coming soon!');
        // Logic: Create Blob with VCF data and download
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
                            className="w-12 h-12 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center hover:bg-green-600 transition-colors"
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
                            className="w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
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
                            className="w-12 h-12 rounded-full bg-indigo-500 text-white shadow-lg flex items-center justify-center hover:bg-indigo-600 transition-colors"
                            title="Save Contact"
                        >
                            <UserPlus className="w-5 h-5" />
                        </motion.button>
                    </>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all bg-[#1e1b4b] text-white active:scale-95"
            >
                <span className="font-bold text-sm tracking-wide ml-1">{isOpen ? 'Close' : 'Actions'}</span>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1e1b4b]">
                    <Plus className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} strokeWidth={3} />
                </div>
            </button>
        </div>
    );
}
