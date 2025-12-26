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
                            className="glass-card rounded-2xl overflow-hidden group hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors flex flex-col h-full min-w-[85vw] sm:min-w-[320px] md:min-w-[340px] snap-center md:snap-start lg:min-w-0 lg:w-auto"
                        >
                            <div className="h-48 relative overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[#4f46e5]/5 text-slate-400">
                                        <Tag className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                                {product.price && (
                                    <div className="absolute top-3 right-3">
                                        <span className="bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                                            {product.price}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <h4 className="font-bold text-slate-900 dark:text-white text-base line-clamp-1 mb-1" title={product.name}>
                                    {product.name}
                                </h4>
                                {product.description && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1 mb-4">
                                        {product.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-2 mt-auto">
                                    <button
                                        onClick={() => handleEnquiry(product.name)}
                                        className="flex-1 py-2.5 bg-[#4f46e5]/10 text-[#4f46e5] uppercase tracking-wide text-[10px] font-bold rounded-xl hover:bg-[#4f46e5] hover:text-white transition-all border border-[#4f46e5]/20 hover:shadow-lg hover:shadow-indigo-500/20"
                                    >
                                        Enquire Now
                                    </button>
                                    {product.link && (
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 bg-white/5 text-slate-400 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
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
