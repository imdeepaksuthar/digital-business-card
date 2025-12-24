'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, Variants } from 'framer-motion';
import { Phone, Mail, Globe, MapPin, Facebook, Twitter, Instagram, Linkedin, Github, MessageCircle, Share2, Download, UserPlus, ArrowRight, ChevronDown, Award, Briefcase, CheckCircle2, Home, CreditCard, ShoppingBag, Users } from 'lucide-react';
import Link from 'next/link';

import ServicesSection from './ServicesSection';
import ContactForm from './ContactForm';
import PaymentSection from './PaymentSection';
import FloatingActions from './FloatingActions';

interface CardLayoutClientProps {
    card: any;
}

export default function CardLayoutClient({ card }: CardLayoutClientProps) {
    const { scrollY } = useScroll();
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const rightColumnRef = useRef<HTMLDivElement>(null);

    // Parallax background effect for Desktop
    const bgY = useTransform(scrollY, [0, 500], [0, 150]);
    const opacityHero = useTransform(scrollY, [0, 300], [1, 0.5]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle scroll spy to highlight active section
    useEffect(() => {
        const handleScrollSpy = () => {
            const sections = ['home', 'leadership', 'visit-us', 'about', 'services', 'payment', 'contact'];

            // Find the section that is currently most visible
            let current = 'home';
            let minDistance = Infinity;

            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Distance from top of viewport/container
                    const targetTop = isMobile ? 100 : 40;
                    const distance = Math.abs(rect.top - targetTop);

                    if (distance < minDistance) {
                        minDistance = distance;
                        current = id;
                    }
                }
            });

            if (current) setActiveSection(current);
        };

        const container = rightColumnRef.current;

        if (isMobile) {
            window.addEventListener('scroll', handleScrollSpy);
        } else if (container) {
            container.addEventListener('scroll', handleScrollSpy);
        }

        // Initial check
        handleScrollSpy();

        return () => {
            if (isMobile) {
                window.removeEventListener('scroll', handleScrollSpy);
            } else if (container) {
                container.removeEventListener('scroll', handleScrollSpy);
            }
        };
    }, [isMobile]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    const getIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('facebook')) return <Facebook className="w-5 h-5" />;
        if (p.includes('twitter') || p.includes('x.com')) return <Twitter className="w-5 h-5" />;
        if (p.includes('instagram')) return <Instagram className="w-5 h-5" />;
        if (p.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
        if (p.includes('github')) return <Github className="w-5 h-5" />;
        return <Globe className="w-5 h-5" />;
    };

    const scrollToSection = (id: string) => {
        if (isMobile) {
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            // Desktop: Scroll the right column container
            const element = document.getElementById(id);
            const container = rightColumnRef.current;
            if (element && container) {
                // Determine the container's current scroll position
                const containerTop = container.getBoundingClientRect().top;
                const elementTop = element.getBoundingClientRect().top;

                // Calculate the relative position from the container's current view
                // We want to scroll BY the distance from container top to element top
                // But we also want some padding (e.g. 20px)
                const offset = elementTop - containerTop - 20;

                container.scrollBy({ top: offset, behavior: 'smooth' });
            }
        }
        setActiveSection(id);
    };

    return (
        <div id="home" className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans selection:bg-blue-500/30 text-slate-900 dark:text-slate-100 overflow-x-hidden scroll-mt-0">

            {/* Ambient Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                {card.cover_photo ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0 bg-cover bg-center opacity-40 blur-[80px] scale-110"
                        style={{ backgroundImage: `url(${card.cover_photo})` }}
                    />
                ) : (
                    <>
                        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
                    </>
                )}
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <motion.main
                className="relative z-10 max-w-7xl mx-auto p-0 md:p-6 lg:p-10 md:h-screen md:overflow-hidden flex flex-col"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* --- LAYOUT SWITCHER BASED ON SCREEN SIZE (Responsive CSS Grid) --- */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 md:h-full">

                    {/* === LEFT COLUMN (Profile / Fixed) === */}
                    <motion.div className="md:col-span-4 lg:col-span-4 flex flex-col gap-6" variants={itemVariants}>

                        {/* PROFILE CARD */}
                        <div className="">
                            <div className="glass-card rounded-[2rem] overflow-hidden border border-white/40 dark:border-white/5 relative group">

                                {/* Cover Photo */}
                                <div className="h-48 md:h-56 relative overflow-hidden">
                                    {card.cover_photo ? (
                                        <motion.div
                                            className="absolute inset-0 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${card.cover_photo})` }}
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>

                                {/* Profile Image & Info */}
                                <div className="relative px-6 pb-8 -mt-24 flex flex-col items-center text-center">
                                    <motion.div
                                        className="w-48 h-48 rounded-full p-2 bg-white/20 backdrop-blur-md shadow-2xl border border-white/40"
                                        whileHover={{ scale: 1.1, rotate: 2 }}
                                    >
                                        <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                            {card.profile_photo ? (
                                                <img src={card.profile_photo} alt={card.business_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-3xl font-bold text-slate-400">
                                                    {card.business_name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>

                                    <div className="mt-4 space-y-2">
                                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{card.business_name}</h1>
                                        {card.tagline && <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic">"{card.tagline}"</p>}

                                        {(card.primary_contact_designation || card.sub_header) && (
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                                                {card.primary_contact_designation || card.sub_header}
                                            </span>
                                        )}
                                    </div>

                                    {/* Social Row */}
                                    {card.social_links?.length > 0 && (
                                        <div className="flex gap-3 mt-6 justify-center flex-wrap">
                                            {card.social_links.map((link: any, i: number) => (
                                                <motion.a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    className="w-10 h-10 rounded-full bg-white/50 dark:bg-slate-800/50 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-blue-500 hover:text-white transition-all shadow-sm border border-white/20"
                                                    whileHover={{ y: -3 }}
                                                >
                                                    {getIcon(link.platform)}
                                                </motion.a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Main Actions (Grid) - Visible on Desktop/Tablet in sidebar */}
                                    <div className="grid grid-cols-2 gap-3 w-full mt-8">
                                        <a href={`tel:${card.phone}`} className="col-span-1 py-3 px-4 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all flex items-center justify-center gap-2 font-bold text-sm border border-emerald-100 dark:border-emerald-800">
                                            <Phone className="w-4 h-4" /> Call
                                        </a>
                                        <a href={`mailto:${card.email}`} className="col-span-1 py-3 px-4 rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-all flex items-center justify-center gap-2 font-bold text-sm border border-orange-100 dark:border-orange-800">
                                            <Mail className="w-4 h-4" /> Email
                                        </a>
                                        <button
                                            onClick={() => alert("Save VCF logic here")}
                                            className="col-span-2 py-3 px-4 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:opacity-90 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-xl"
                                        >
                                            <Download className="w-4 h-4" /> Save Contact
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>

                    {/* === RIGHT COLUMN (Content Scroll) === */}
                    <div ref={rightColumnRef} className="md:col-span-8 lg:col-span-8 flex flex-col gap-6 pb-20 md:pb-32 md:h-full md:overflow-y-auto no-scrollbar pt-1 md:pr-2 relative scroll-smooth">

                        {/* TEAM SECTION (Moved above About Us) */}
                        {card.proprietors?.length > 0 && (
                            <motion.section id="leadership" variants={itemVariants} className="glass-panel p-6 md:p-8 rounded-[2rem] scroll-mt-32">
                                <h2 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                                    <Briefcase className="w-5 h-5" /> Leadership
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {card.proprietors.map((p: any, i: number) => (
                                        <div key={i} className="flex flex-col gap-3 p-4 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/20 hover:bg-white/60 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                                    {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">{p.name[0]}</div>}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.name}</h4>
                                                    <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">{p.designation}</p>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            {(p.phone || p.email) && (
                                                <div className="grid grid-cols-2 gap-2 mt-1">
                                                    {p.phone && (
                                                        <a href={`tel:${p.phone}`} className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors border border-emerald-100 dark:border-emerald-800/50">
                                                            <Phone className="w-3.5 h-3.5" /> Call
                                                        </a>
                                                    )}
                                                    {p.email && (
                                                        <a href={`mailto:${p.email}`} className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs font-bold hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors border border-orange-100 dark:border-orange-800/50">
                                                            <Mail className="w-3.5 h-3.5" /> Email
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Map & Address Block */}
                        <motion.section id="visit-us" variants={itemVariants} className="glass-panel p-6 rounded-[2rem] md:order-none scroll-mt-32">
                            <h3 className="text-lg font-bold mb-4 px-2 flex items-center gap-2 text-slate-900 dark:text-white">
                                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Visit Us
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 bg-white/40 dark:bg-white/5 p-6 rounded-2xl border border-white/20 h-full flex flex-col justify-center">
                                    <div className="flex gap-3 items-start">
                                        <div className="p-2 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 shrink-0"><MapPin className="w-4 h-4" /></div>
                                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{card.address}, {card.city}, {card.state} {card.pincode}</p>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900/40 shrink-0"><Phone className="w-4 h-4" /></div>
                                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{card.phone}</p>
                                    </div>
                                    <div className="flex gap-3 items-center">
                                        <div className="p-2 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/40 shrink-0"><Mail className="w-4 h-4" /></div>
                                        <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{card.email}</p>
                                    </div>
                                </div>
                                <div className="h-full min-h-[14rem] rounded-xl overflow-hidden bg-slate-200 border border-white/20 relative">
                                    {(() => {
                                        let mapSrc = card.google_map_embed_url;
                                        // Fallback: Generate embed URL from address if explicit URL is missing
                                        if (!mapSrc && (card.address || card.city)) {
                                            const addressQuery = encodeURIComponent(`${card.address || ''} ${card.city || ''} ${card.state || ''} ${card.pincode || ''}`);
                                            mapSrc = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                                        }

                                        return mapSrc ? (
                                            <iframe
                                                src={mapSrc}
                                                className="w-full h-full border-0"
                                                loading="lazy"
                                                title="Business Location"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium text-sm bg-slate-100">
                                                <div className="text-center p-4">
                                                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                    <p>Location not available</p>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </motion.section>

                        {/* ABOUT SECTION (Glass Card) */}
                        {card.description && (
                            <motion.section id="about" variants={itemVariants} className="glass-panel p-6 md:p-8 rounded-[2rem] scroll-mt-32">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                    <Briefcase className="w-24 h-24" />
                                </div>
                                <h2 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 px-2">
                                    <Briefcase className="w-5 h-5" /> About Us
                                </h2>
                                <div className="bg-white/40 dark:bg-white/5 p-6 rounded-2xl border border-white/20">
                                    <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line text-sm md:text-base font-medium">
                                        {card.description}
                                    </p>
                                </div>

                                {/* Why Choose Us Pills */}
                                <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-700/50">
                                    <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> Why Choose Us
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Premium Quality', '24/7 Support', 'Best Pricing', 'Verified'].map(tag => (
                                            <span key={tag} className="px-3 py-1.5 rounded-full bg-white/40 dark:bg-white/5 border border-white/20 text-xs font-semibold backdrop-blur-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* SERVICES HORIZONTAL SCROLL (Mobile) / GRID (Desktop) */}
                        {card.products?.length > 0 && (
                            <motion.div id="services" variants={itemVariants} className="scroll-mt-32">
                                <ServicesSection products={card.products} whatsappNumber={card.phone} />
                            </motion.div>
                        )}

                        {/* CONTACT & PAYMENT GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div id="payment" variants={itemVariants} className="scroll-mt-32">
                                <PaymentSection
                                    bankDetails={card.bank_details}
                                    paymentQrCode={card.payment_qr_code}
                                    paymentMethods={card.payment_methods || []}
                                />
                            </motion.div>
                            <motion.div id="contact" variants={itemVariants} className="h-full scroll-mt-32">
                                {/* Contact Form handles its own glass styling now */}
                                <ContactForm cardId={card.id} whatsappNumber={card.phone} />
                            </motion.div>
                        </div>



                    </div>
                </div>

                <div className="py-12 text-center text-xs text-slate-400">
                    <p>© {new Date().getFullYear()} {card.business_name}. Powered by DigitalCard.</p>
                </div>
            </motion.main>

            {/* FLOATING ACTION BUTTON (Mobile Only or Always?) 
                The requirements said Mobile has Floating row, Tablet/Desktop has them in sidebar. 
                I've added grid in sidebar for Tablet+. 
                For mobile, FloatingActions component handles its own fixed positioning.
                We might want to hide it on Desktop if we have them in sidebar, or keep it for easy access.
                Let's hide it on lg screens. */}
            <div className="lg:hidden">
                <FloatingActions card={card} />
            </div>

            {/* Desktop Right Side Navigation */}
            <div className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-4">
                {[
                    { id: 'home', icon: Home, label: 'Home' },
                    { id: 'leadership', icon: Users, label: 'Leadership' },
                    { id: 'visit-us', icon: MapPin, label: 'Visit Us' },
                    { id: 'about', icon: Briefcase, label: 'About' },
                    { id: 'services', icon: ShoppingBag, label: 'Services' },
                    { id: 'payment', icon: CreditCard, label: 'Payment' },
                    { id: 'contact', icon: Mail, label: 'Contact' }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`p-3 rounded-full backdrop-blur-md border shadow-lg transition-all group relative ${activeSection === item.id
                            ? 'bg-blue-600 text-white border-blue-500 scale-110'
                            : 'bg-white/20 dark:bg-slate-800/40 border-white/30 dark:border-white/10 hover:bg-white/40 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200'
                            }`}
                        aria-label={`Scroll to ${item.label}`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded-md bg-slate-900 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

        </div>
    );
}
