'use client';

import { useState } from 'react';
import { Tag, ExternalLink } from 'lucide-react';
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
        <div className="bg-slate-50 dark:bg-slate-800/50 md:bg-white md:dark:bg-slate-900 md:shadow-lg md:rounded-[2rem] p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    Our Services
                </h3>

                {categories.length > 2 && (
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat as string}
                                onClick={() => setFilter(cat as string)}
                                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${filter === cat
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                                        : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100'
                                    }`}
                            >
                                {cat as string}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredProducts.map((product) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            key={product.id}
                            className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700 flex flex-col h-full"
                        >
                            <div className="h-40 bg-slate-100 dark:bg-slate-700 relative group overflow-hidden">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                        <Tag className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                                {product.price && (
                                    <span className="absolute top-2 right-2 bg-black/70 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-lg">
                                        {product.price}
                                    </span>
                                )}
                            </div>
                            <div className="p-4 flex flex-col flex-1">
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1" title={product.name}>
                                    {product.name}
                                </h4>
                                {product.description && (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 flex-1">
                                        {product.description}
                                    </p>
                                )}

                                <div className="mt-4 flex items-center gap-2">
                                    <button
                                        onClick={() => handleEnquiry(product.name)}
                                        className="flex-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        Enquire Now
                                    </button>
                                    {product.link && (
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-slate-50 dark:bg-slate-700 text-slate-500 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors"
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
