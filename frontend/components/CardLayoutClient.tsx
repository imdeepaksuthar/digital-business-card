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
            const sections = ['home', 'leadership', 'visit-us', 'about', 'services', 'payment', 'contact'];
            let current = 'home';
            let minDistance = Infinity;

            sections.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const targetTop = isMobile ? 100 : 40;
                    const distance = Math.abs(rect.top - targetTop);
                    if (distance < minDistance) {
                        minDistance = distance;
                        current = id;
                    }
                }
            });
            setActiveSection(current);
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
        { id: 'services', icon: ShoppingBag, label: 'Services' },
        { id: 'visit-us', icon: MapPin, label: 'Visit' },
        { id: 'about', icon: Briefcase, label: 'About' },
        { id: 'payment', icon: CreditCard, label: 'Pay' },
        { id: 'contact', icon: MessageCircle, label: 'Contact' },
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
                            ? 'bg-[#cfaa48] text-[#1c2e22] shadow-[0_0_20px_rgba(207,170,72,0.4)] scale-110'
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
                className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 lg:p-10 md:h-screen md:overflow-hidden flex flex-col"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 md:h-full">

                    {/* === LEFT COLUMN (Profile / Fixed) === */}
                    <motion.div className="md:col-span-4 lg:col-span-4 flex flex-col gap-6" variants={itemVariants} id="home">

                        {/* PROFILE CARD */}
                        <div className="bg-[#1c2e22]/40 backdrop-blur-md rounded-[2rem] overflow-hidden border border-white/5 relative group shadow-2xl">
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
                                    <div className="absolute inset-0 bg-[#2f331e]" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1c2e22] via-[#1c2e22]/50 to-transparent" />
                            </div>

                            {/* Profile Info */}
                            <div className="relative px-6 pb-8 -mt-24 flex flex-col items-center text-center">
                                {/* Avatar */}
                                <motion.div
                                    className="w-40 h-40 rounded-full p-1.5 bg-[#1c2e22] shadow-2xl border border-white/10 z-10"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-800 border-4 border-[#2f331e]">
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
                                        <div className="mt-3">
                                            <span className="inline-block px-4 py-1.5 rounded-full bg-[#cfaa48]/10 text-[#cfaa48] text-xs font-bold uppercase tracking-wider border border-[#cfaa48]/20">
                                                {card.primary_contact_designation || card.sub_header}
                                            </span>
                                        </div>
                                    )}

                                    {/* Socials */}
                                    {card.social_links?.length > 0 && (
                                        <div className="flex gap-3 mt-6 justify-center flex-wrap">
                                            {card.social_links.map((link: any, i: number) => (
                                                <motion.a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-[#cfaa48] hover:text-[#1c2e22] transition-all shadow-lg border border-white/5"
                                                    whileHover={{ y: -3 }}
                                                >
                                                    {getIcon(link.platform)}
                                                </motion.a>
                                            ))}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-3 w-full mt-8">
                                        <a href={`tel:${card.phone}`} className="col-span-1 py-3.5 px-4 rounded-xl bg-[#2f331e] text-[#4ade80] hover:bg-[#3a4131] transition-all flex items-center justify-center gap-2 font-bold text-sm border border-white/5 shadow-lg group">
                                            <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Call
                                        </a>
                                        <a href={`mailto:${card.email}`} className="col-span-1 py-3.5 px-4 rounded-xl bg-[#4b2c20] text-[#fb923c] hover:bg-[#5d3a2b] transition-all flex items-center justify-center gap-2 font-bold text-sm border border-white/5 shadow-lg group">
                                            <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Email
                                        </a>
                                        <button
                                            onClick={handleSaveContact}
                                            className="col-span-2 py-4 px-4 rounded-xl bg-white text-[#1c2e22] hover:bg-slate-100 transition-all flex items-center justify-center gap-2 font-bold text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1"
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
                            <motion.section id="leadership" variants={itemVariants} className="bg-[#3a4131] p-6 rounded-[2rem] scroll-mt-24 border border-white/5 shadow-2xl">
                                <h2 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-[#cfaa48] opacity-90">
                                    <Users className="w-4 h-4" /> Leadership
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {card.proprietors.map((p: any, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-[#2f331e] border border-white/5 hover:border-[#cfaa48]/30 transition-all group">
                                            <div className="w-16 h-16 rounded-full bg-slate-800 overflow-hidden shrink-0 border-2 border-white/10 group-hover:border-[#cfaa48] transition-colors shadow-lg">
                                                {p.photo ? <img src={p.photo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">{p.name[0]}</div>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-lg text-white truncate group-hover:text-[#cfaa48] transition-colors">{p.name}</h4>
                                                <p className="text-sm text-[#8c9f90] font-medium truncate mb-2">{p.designation}</p>

                                                <div className="flex gap-3">
                                                    {p.phone && (
                                                        <a href={`tel:${p.phone}`} className="w-8 h-8 rounded-full bg-[#1c2e22] flex items-center justify-center text-[#4ade80] hover:bg-[#4ade80] hover:text-[#1c2e22] transition-colors border border-white/5">
                                                            <Phone className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                    {p.email && (
                                                        <a href={`mailto:${p.email}`} className="w-8 h-8 rounded-full bg-[#1c2e22] flex items-center justify-center text-[#fb923c] hover:bg-[#fb923c] hover:text-[#1c2e22] transition-colors border border-white/5">
                                                            <Mail className="w-3.5 h-3.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Services Section */}
                        <section id="services" className="scroll-mt-24">
                            <ServicesSection products={card.products || []} whatsappNumber={card.phone} />
                        </section>

                        {/* Visit Us */}
                        <motion.section id="visit-us" variants={itemVariants} className="glass-panel p-6 rounded-[2rem] scroll-mt-24">
                            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-[#cfaa48] uppercase tracking-wider border-b border-white/5 pb-2">
                                <MapPin className="w-4 h-4 text-[#cfaa48]" /> Visit Us
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/5 h-full flex flex-col justify-center backdrop-blur-sm">
                                    <div className="flex gap-4 items-start">
                                        <div className="p-2.5 rounded-xl bg-[#cfaa48]/10 text-[#cfaa48] shrink-0 border border-[#cfaa48]/20"><MapPin className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Address</p>
                                            <p className="text-sm text-slate-200 font-medium leading-relaxed">{card.address}, {card.city}, {card.state} {card.pincode}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="p-2.5 rounded-xl bg-[#cfaa48]/10 text-[#cfaa48] shrink-0 border border-[#cfaa48]/20"><Phone className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Phone</p>
                                            <p className="text-sm text-slate-200 font-medium">{card.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <div className="p-2.5 rounded-xl bg-[#cfaa48]/10 text-[#cfaa48] shrink-0 border border-[#cfaa48]/20"><Mail className="w-5 h-5" /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Email</p>
                                            <p className="text-sm text-slate-200 font-medium">{card.email}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-full min-h-[16rem] rounded-2xl overflow-hidden bg-slate-800 border border-white/10 relative shadow-2xl">
                                    {(() => {
                                        let mapSrc = card.google_map_embed_url;
                                        if (!mapSrc && (card.address || card.city)) {
                                            const addressQuery = encodeURIComponent(`${card.address || ''} ${card.city || ''} ${card.state || ''} ${card.pincode || ''}`);
                                            mapSrc = `https://maps.google.com/maps?q=${addressQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
                                        }
                                        return mapSrc ? (
                                            <iframe src={mapSrc} className="w-full h-full border-0 opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0" loading="lazy" title="Business Location" allowFullScreen />
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
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                                    <Briefcase className="w-32 h-32 text-white" />
                                </div>
                                <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-[#cfaa48] uppercase tracking-wider border-b border-white/5 pb-2 relative z-10">
                                    <Briefcase className="w-4 h-4 text-[#cfaa48]" /> About Us
                                </h3>
                                <div className="prose prose-sm max-w-none text-slate-300 relative z-10 leading-relaxed font-light">
                                    <p>{card.description}</p>
                                </div>

                                <div className="flex gap-2 mt-8 flex-wrap relative z-10">
                                    {['Premium Quality', 'Trusted Service', '24/7 Support'].map((tag, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                                            <CheckCircle2 className="w-3 h-3 text-[#cfaa48]" /> {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.section>
                        )}

                        {/* Payment Section */}
                        <section id="payment" className="scroll-mt-24 h-full min-h-[400px]">
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
