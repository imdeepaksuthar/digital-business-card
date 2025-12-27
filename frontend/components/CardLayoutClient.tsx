'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Phone, Mail, Globe, MapPin, Facebook, Twitter, Instagram, Linkedin, Github, MessageCircle, Share2, Download, UserPlus, Briefcase, CheckCircle2, Home, CreditCard, ShoppingBag, Users, Save } from 'lucide-react';

import ServicesSection from './ServicesSection';
import ContactForm from './ContactForm';
import PaymentSection from './PaymentSection';
import FloatingActions from './FloatingActions';

interface CardLayoutClientProps {
    card: any;
}

const WhatsappIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

export default function CardLayoutClient({ card }: CardLayoutClientProps) {
    const { scrollY } = useScroll();
    const [isMobile, setIsMobile] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const rightColumnRef = useRef<HTMLDivElement>(null);

    // Parallax background effect for Desktop
    const bgY = useTransform(scrollY, [0, 500], [0, 150]);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle scroll spy
    useEffect(() => {
        const handleScrollSpy = () => {
            if (!isMobile && rightColumnRef.current) {
                // Desktop Logic
                if (rightColumnRef.current.scrollTop < 150) {
                    setActiveSection('home');
                    return;
                }
                // Check other sections
                const sections = ['leadership', 'visit-us', 'about', 'services', 'payment', 'contact'];
                let current = 'home'; // Default fallback
                let minDistance = Infinity;

                sections.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        // For desktop, right column items are relative to viewport but inside the scroll container
                        // We want the one closest to the top of the container (e.g. 40px offset)
                        const targetTop = 40;
                        const distance = Math.abs(rect.top - targetTop);
                        if (distance < minDistance) {
                            minDistance = distance;
                            current = id;
                        }
                    }
                });
                setActiveSection(current);
            } else {
                // Mobile Logic (Window Scroll)
                const sections = ['home', 'leadership', 'visit-us', 'about', 'services', 'payment', 'contact'];
                let current = 'home';
                let minDistance = Infinity;

                sections.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        const rect = element.getBoundingClientRect();
                        const targetTop = 100;
                        const distance = Math.abs(rect.top - targetTop);
                        if (distance < minDistance) {
                            minDistance = distance;
                            current = id;
                        }
                    }
                });
                setActiveSection(current);
            }
        };

        if (rightColumnRef.current) {
            rightColumnRef.current.addEventListener('scroll', handleScrollSpy);
        }
        window.addEventListener('scroll', handleScrollSpy);
        return () => {
            if (rightColumnRef.current) rightColumnRef.current.removeEventListener('scroll', handleScrollSpy);
            window.removeEventListener('scroll', handleScrollSpy);
        };
    }, [isMobile]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    const getIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'facebook': return <Facebook className="w-5 h-5" />;
            case 'twitter': return <Twitter className="w-5 h-5" />;
            case 'instagram': return <Instagram className="w-5 h-5" />;
            case 'linkedin': return <Linkedin className="w-5 h-5" />;
            case 'github': return <Github className="w-5 h-5" />;
            case 'youtube': return <Globe className="w-5 h-5" />;
            default: return <Globe className="w-5 h-5" />;
        }
    };

    // VCF Generator
    const handleSaveContact = () => {
        // Construct VCF data (simplified)
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${card.business_name}
TEL;TYPE=CELL:${card.phone}
EMAIL:${card.email}
URL:${window.location.href}
END:VCARD`;
        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${card.business_name}.vcf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Navigation Items
    const navItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'leadership', icon: Users, label: 'Leadership' },
        { id: 'visit-us', icon: MapPin, label: 'Visit Us' },
        { id: 'about', icon: Briefcase, label: 'About Us' },
        { id: 'services', icon: ShoppingBag, label: 'Services' },
        { id: 'payment', icon: CreditCard, label: 'Payment Options' },
        { id: 'contact', icon: MessageCircle, label: 'Quick Enquiry' },
    ];

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            if (isMobile) {
                const offset = 100;
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
            } else if (rightColumnRef.current) {
                // Determine offset based on section
                const offset = 40;
                // Simple scroll into view might be easier for fixed height container
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

    return (
        <>
            <FloatingActions card={card} />

            {/* BACKGROUND TEXTURE */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `url("https://www.transparenttextures.com/patterns/cubes.png")`,
                    backgroundBlendMode: 'overlay'
                }}
            />

            {/* DESKTOP NAV SIDEBAR (Floating) */}
            <div className={`hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-50 flex-col gap-4 py-6 px-3 bg-black/20 backdrop-blur-xl rounded-full border border-white/10 transition-all duration-300 shadow-2xl`}>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`relative group p-3 rounded-full transition-all duration-300 ${activeSection === item.id
                            ? 'bg-[#d4af37] text-[#1e1b4b] shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-110'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                            }`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="absolute right-full mr-4 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap backdrop-blur-sm pointer-events-none">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* MAIN CONTENT WRAPPER */}
            <motion.main
                className="relative z-10 max-w-7xl mx-auto p-4 md:p-4 lg:p-6 md:h-screen md:overflow-hidden flex flex-col"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 md:h-full">

                    {/* === LEFT COLUMN (Profile / Fixed) === */}
                    <motion.div className="md:col-span-4 lg:col-span-4 flex flex-col gap-6 md:h-full md:overflow-y-auto no-scrollbar pb-10" variants={itemVariants} id="home">

                        {/* PROFILE CARD */}
                        <div className="glass-panel rounded-[2rem] overflow-hidden relative group border border-white/10 shadow-2xl">
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
                                    <div className="absolute inset-0 bg-[#1e1b4b]" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
                            </div>

                            {/* Profile Info */}
                            <div className="relative px-4 sm:px-6 pb-8 -mt-24 flex flex-col items-center text-center">
                                {/* Avatar */}
                                <motion.div
                                    className="w-40 h-40 rounded-full p-1.5 bg-[#0f172a] shadow-2xl border border-[#d4af37]/50 z-10"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 border-4 border-[#1e1b4b]">
                                        {card.profile_photo ? (
                                            <img src={card.profile_photo} alt={card.business_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-slate-500">
                                                {card.business_name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                <div className="mt-6 space-y-2 w-full">
                                    <h1 className="text-2xl font-bold tracking-tight text-white">{card.business_name}</h1>
                                    {card.tagline && <p className="text-sm font-medium text-[#8c9f90] italic">"{card.tagline}"</p>}

                                    {(card.primary_contact_designation || card.sub_header) && (
                                        <div className="mt-4">
                                            <span className="inline-block px-5 py-2 rounded-xl bg-[#d4af37]/10 text-[#d4af37] text-xs font-bold uppercase tracking-wider border border-[#d4af37]/20 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                                                {card.primary_contact_designation || card.sub_header}
                                            </span>
                                        </div>
                                    )}

                                    {/* Socials */}
                                    {card.social_links?.length > 0 && (
                                        <div className="flex gap-3 mt-8 justify-center flex-wrap">
                                            {card.social_links.map((link: any, i: number) => (
                                                <motion.a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    className="w-11 h-11 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#d4af37] hover:text-[#1e1b4b] transition-all shadow-lg border border-white/10 hover:border-[#d4af37]/50 group"
                                                    whileHover={{ y: -3 }}
                                                >
                                                    {getIcon(link.platform)}
                                                </motion.a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full mt-8">
                                        <a href={`tel:${card.phone}`} className="col-span-1 h-14 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#4f46e5] text-white hover:brightness-110 transition-all flex items-center justify-center p-0 shadow-lg shadow-indigo-500/25 group" aria-label="Call">
                                            <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        </a>
                                        <a href={`mailto:${card.email}`} className="col-span-1 h-14 rounded-xl bg-[#1e293b] text-[#d4af37] hover:bg-[#334155] transition-all flex items-center justify-center p-0 border border-[#d4af37]/20 shadow-lg group" aria-label="Email">
                                            <Mail className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        </a>

                                        <a href={`https://wa.me/${card.phone}`} target="_blank" rel="noopener noreferrer" className="col-span-1 h-14 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:brightness-110 transition-all flex items-center justify-center p-0 shadow-lg shadow-emerald-500/25 group" aria-label="Whatsapp">
                                            <WhatsappIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        </a>
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${card.address || ''} ${card.city || ''} ${card.state || ''} ${card.pincode || ''}`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="col-span-1 h-14 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white hover:brightness-110 transition-all flex items-center justify-center p-0 shadow-lg shadow-orange-500/25 group"
                                            aria-label="Get Directions"
                                        >
                                            <MapPin className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        </a>

                                        <button
                                            onClick={handleSaveContact}
                                            className="col-span-4 py-4 px-4 rounded-xl bg-white text-[#0f172a] hover:bg-slate-100 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1"
                                        >
                                            <Save className="w-4 h-4" /> Save Contact
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </motion.div>


                    {/* === RIGHT COLUMN (Content Scroll) === */}
                    <div ref={rightColumnRef} className="md:col-span-8 lg:col-span-8 flex flex-col gap-6 pb-24 md:pb-32 md:h-full md:overflow-y-auto no-scrollbar pt-1 md:pr-2 relative scroll-smooth">

                        {/* Leadership - REFACTORED DESIGN */}
                        {card.proprietors?.length > 0 && (
                            <motion.section id="leadership" variants={itemVariants} className="glass-panel p-6 rounded-[2rem] scroll-mt-24">
                                <h2 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-[#d4af37] opacity-90">
                                    <Users className="w-4 h-4" /> Leadership
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {card.proprietors.map((p: any, i: number) => (
                                        <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl glass-card bg-gradient-to-br from-white/5 to-transparent hover:border-[#d4af37]/50 transition-all group relative overflow-hidden">
                                            {/* Decorative background element */}
                                            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#d4af37]/10 rounded-full blur-2xl group-hover:bg-[#d4af37]/20 transition-all duration-500" />

                                            <div className="w-20 h-20 rounded-full bg-slate-800 overflow-hidden shrink-0 border-2 border-white/10 group-hover:border-[#d4af37] transition-colors shadow-lg z-10">
                                                {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 text-xl">{p.name[0]}</div>}
                                            </div>

                                            <div className="flex-1 min-w-0 text-center sm:text-left z-10">
                                                <h4 className="font-bold text-lg text-white truncate group-hover:text-[#d4af37] transition-colors">{p.name}</h4>
                                                <p className="text-sm text-slate-300 font-medium truncate mb-3">{p.designation}</p>

                                                <div className="flex gap-3 justify-center sm:justify-start">
                                                    {p.phone && (
                                                        <a href={`tel:${p.phone}`} className="w-9 h-9 rounded-xl bg-[#1e1b4b] flex items-center justify-center text-white hover:bg-[#d4af37] hover:text-[#1e1b4b] transition-all border border-white/5 hover:scale-105 shadow-md" title="Call">
                                                            <Phone className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                    {p.email && (
                                                        <a href={`mailto:${p.email}`} className="w-9 h-9 rounded-xl bg-[#1e1b4b] flex items-center justify-center text-white hover:bg-[#d4af37] hover:text-[#1e1b4b] transition-all border border-white/5 hover:scale-105 shadow-md" title="Email">
                                                            <Mail className="w-4 h-4" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}



                        {/* Visit Us */}
                        <motion.section id="visit-us" variants={itemVariants} className="glass-panel p-6 rounded-[2rem] scroll-mt-24">
                            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-[#d4af37] uppercase tracking-wider border-b border-white/5 pb-2">
                                <MapPin className="w-4 h-4 text-[#d4af37]" /> Visit Us
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6 bg-gradient-to-br from-white/5 to-transparent p-6 rounded-2xl border border-white/5 h-full flex flex-col justify-center backdrop-blur-sm relative overflow-hidden group">
                                    {/* Decorative Glow */}
                                    <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#d4af37]/10 rounded-full blur-2xl group-hover:bg-[#d4af37]/20 transition-all duration-500 pointer-events-none" />

                                    <div className="flex gap-4 items-start relative z-10">
                                        <div className="p-3 rounded-xl bg-[#cfaa48]/10 text-[#cfaa48] shrink-0 border border-[#cfaa48]/20 shadow-lg shadow-[#cfaa48]/5"><MapPin className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1 tracking-wider">Address</p>
                                            <p className="text-sm text-slate-200 font-medium leading-relaxed">{card.address}, {card.city}, {card.state} {card.pincode}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center relative z-10">
                                        <div className="p-3 rounded-xl bg-[#cfaa48]/10 text-[#cfaa48] shrink-0 border border-[#cfaa48]/20 shadow-lg shadow-[#cfaa48]/5"><Phone className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1 tracking-wider">Phone</p>
                                            <p className="text-sm text-slate-200 font-medium">{card.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center relative z-10">
                                        <div className="p-3 rounded-xl bg-[#cfaa48]/10 text-[#cfaa48] shrink-0 border border-[#cfaa48]/20 shadow-lg shadow-[#cfaa48]/5"><Mail className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase mb-1 tracking-wider">Email</p>
                                            <p className="text-sm text-slate-200 font-medium">{card.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-full min-h-[16rem] rounded-2xl overflow-hidden bg-slate-800 border border-white/10 relative shadow-2xl group">
                                    {(() => {
                                        let mapSrc = card.google_map_embed_url;
                                        if (!mapSrc && (card.address || card.city)) {
                                            const addressQuery = encodeURIComponent(`${card.address || ''} ${card.city || ''} ${card.state || ''} ${card.pincode || ''}`);
                                            mapSrc = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                                        }
                                        return mapSrc ? (
                                            <iframe src={mapSrc} className="w-full h-full border-0 opacity-70 group-hover:opacity-100 transition-opacity grayscale-[0.5] group-hover:grayscale-0 duration-500" loading="lazy" title="Business Location" allowFullScreen />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-medium text-sm bg-slate-900">
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

                        {/* About Section */}
                        {card.description && (
                            <motion.section id="about" variants={itemVariants} className="glass-panel p-6 md:p-8 rounded-[2rem] scroll-mt-24 relative overflow-hidden">
                                <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-[#cfaa48] uppercase tracking-wider border-b border-white/5 pb-2 relative z-10">
                                    <Briefcase className="w-4 h-4 text-[#cfaa48]" /> About Us
                                </h3>

                                <div className="bg-gradient-to-br from-white/5 to-transparent p-6 sm:p-8 rounded-2xl border border-white/5 relative overflow-hidden group w-full min-h-[200px] flex flex-col justify-center">
                                    {/* Decorative Glow */}
                                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-[#d4af37]/10 rounded-full blur-3xl group-hover:bg-[#d4af37]/20 transition-all duration-500 pointer-events-none" />

                                    <div className="absolute bottom-0 right-0 p-8 opacity-[0.03] pointer-events-none transform translate-x-1/4 translate-y-1/4">
                                        <Briefcase className="w-48 h-48 text-white" />
                                    </div>

                                    <div className="text-slate-200 text-sm leading-relaxed font-light mb-8 relative z-10 whitespace-pre-line">
                                        <p>{card.description}</p>
                                    </div>

                                    <div className="flex gap-3 flex-wrap relative z-10 mt-auto">
                                        {['Premium Quality', 'Trusted Service', '24/7 Support'].map((tag, i) => (
                                            <span key={i} className="px-3 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[10px] font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5 shadow-lg shadow-black/20 hover:scale-105 transition-transform cursor-default">
                                                <CheckCircle2 className="w-3 h-3 text-[#cfaa48]" /> {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {/* Services Section */}
                        <section id="services" className="scroll-mt-24">
                            <ServicesSection products={card.products || []} whatsappNumber={card.phone} />
                        </section>

                        {/* Payment Section */}
                        <section id="payment" className="scroll-mt-24">
                            <PaymentSection
                                bankDetails={card.bank_details}
                                paymentQrCode={card.payment_qr_code}
                                paymentMethods={card.payment_methods}
                            />
                        </section>

                        {/* Contact Section */}
                        <section id="contact" className="scroll-mt-24">
                            <ContactForm cardId={card.id} whatsappNumber={card.phone} />
                        </section>

                        {/* Footer Spacer */}
                        <div className="h-20 md:hidden" />
                    </div>
                </div>
            </motion.main>
        </>
    );
}
