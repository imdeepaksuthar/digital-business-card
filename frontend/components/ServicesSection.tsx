'use client';

import { useState } from 'react';
import { Tag, ExternalLink, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    id: number;
    name: string;
    image?: string;
    price?: string;
    description?: string;
    link?: string;
    category?: string;
}

interface ServicesSectionProps {
    products: Product[];
    whatsappNumber?: string;
}

export default function ServicesSection({ products, whatsappNumber }: ServicesSectionProps) {
    const [filter, setFilter] = useState('All');

    // Extract categories
    const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

    const filteredProducts = filter === 'All'
        ? products
        : products.filter(p => p.category === filter);

    const handleEnquiry = (productName: string) => {
        if (!whatsappNumber) return;
        const text = `Hi, I am interested in ${productName}. Please provide more details.`;
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="glass-panel p-6 md:p-8 rounded-[2rem] transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <h3 className="text-sm font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4 text-[#d4af37]" />
                    Our Services
                </h3>

                {categories.length > 2 && (
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat as string}
                                onClick={() => setFilter(cat as string)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all backdrop-blur-md ${filter === cat
                                    ? 'bg-[#4f46e5] text-white shadow-lg shadow-indigo-500/30'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {cat as string}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory scroll-pl-6 pb-8 -mx-6 px-6 lg:grid lg:grid-cols-3 lg:pb-0 lg:mx-0 lg:px-0 lg:overflow-visible gap-6 no-scrollbar">
                <AnimatePresence mode='popLayout'>
                    {filteredProducts.map((product) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={product.id}
                            className="glass-card rounded-2xl overflow-hidden group hover:border-[#d4af37]/50 transition-all flex flex-col h-full min-w-[85vw] sm:min-w-[320px] md:min-w-[340px] snap-center md:snap-start lg:min-w-0 lg:w-auto bg-gradient-to-br from-white/5 to-transparent relative"
                        >
                            {/* Decorative background glow */}
                            <div className="absolute -right-12 -top-12 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-3xl group-hover:bg-[#d4af37]/20 transition-all duration-500 pointer-events-none" />

                            <div className="h-52 relative overflow-hidden bg-slate-900/50">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#1e1b4b]/30 text-slate-500">
                                        <Tag className="w-10 h-10 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />

                                {product.price && (
                                    <div className="absolute top-3 right-3 z-10">
                                        <span className="bg-black/70 backdrop-blur-md text-[#d4af37] text-xs font-bold px-3 py-1.5 rounded-xl border border-[#d4af37]/20 shadow-lg">
                                            {product.price}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-1 relative z-10">
                                <h4 className="font-bold text-white text-lg line-clamp-1 mb-2 group-hover:text-[#d4af37] transition-colors" title={product.name}>
                                    {product.name}
                                </h4>
                                {product.description && (
                                    <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 flex-1 mb-6 font-light">
                                        {product.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-3 mt-auto">
                                    <button
                                        onClick={() => handleEnquiry(product.name)}
                                        className="flex-1 py-3 px-4 bg-[#4f46e5] text-white uppercase tracking-wider text-[10px] font-bold rounded-xl hover:bg-[#4338ca] transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
                                    >
                                        Enquire Now
                                    </button>
                                    {product.link && (
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-3 bg-white/5 text-slate-400 rounded-xl hover:bg-[#d4af37] hover:text-[#1e1b4b] transition-all border border-white/5 hover:border-[#d4af37]/20 shadow-lg"
                                            title="View Details"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
