import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Phone, Mail, Globe, MapPin, Facebook, Twitter, Instagram, Linkedin, Github, Calendar, Map, Smartphone, Download, MessageCircle, Clock, Award, Briefcase, Users, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

// Components
import ContactForm from '@/components/ContactForm';
import ServicesSection from '@/components/ServicesSection';
import PaymentSection from '@/components/PaymentSection';
import FloatingActions from '@/components/FloatingActions';

async function getCard(slug: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
    try {
        const res = await fetch(`${apiUrl}/cards/${slug}`, {
            cache: 'no-store',
        });
        if (!res.ok) return null;

        // Track visit
        // We do not await this to avoid blocking response, or we just trust the client side useEffect method if we implemented it. 
        // But since this is server component, we can fire and forget or just await it quickly.
        // Actually, let's keep it simple and just fetch data. Analytics can be client side or middleware.

        return res.json();
    } catch (e) {
        return null;
    }
}

export async function generateMetadata(props: any): Promise<Metadata> {
    const params = await props.params;
    const { slug } = params;
    const card = await getCard(slug);
    if (!card) return { title: 'Card Not Found' };
    return {
        title: `${card.business_name} | Digital Business Card`,
        description: card.tagline || card.description || `Connect with ${card.business_name}`,
    };
}

export default async function PublicCard(props: any) {
    const params = await props.params;
    const { slug } = params;
    const card = await getCard(slug);
    if (!card) notFound();

    const getIcon = (platform: string) => {
        const p = platform.toLowerCase();
        if (p.includes('facebook')) return <Facebook className="w-5 h-5" />;
        if (p.includes('twitter') || p.includes('x.com')) return <Twitter className="w-5 h-5" />;
        if (p.includes('instagram')) return <Instagram className="w-5 h-5" />;
        if (p.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
        if (p.includes('github')) return <Github className="w-5 h-5" />;
        if (p.includes('map')) return <Map className="w-5 h-5" />;
        return <Globe className="w-5 h-5" />;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex justify-center items-start pt-0 sm:pt-6 md:pt-10 pb-0 sm:pb-6 md:pb-10 px-0 sm:px-4">

            <main className="w-full max-w-md md:max-w-5xl lg:max-w-7xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden min-h-screen sm:min-h-0 sm:rounded-[2.5rem] relative flex flex-col md:flex-row md:items-stretch md:gap-0 md:bg-transparent md:shadow-none md:overflow-visible">

                {/* === LEFT SIDEBAR / PROFILE CARD === */}
                <div className="w-full md:w-[40%] lg:w-[30%] bg-white dark:bg-slate-900 md:rounded-[2.5rem] md:shadow-2xl md:sticky md:top-10 md:h-fit z-10 overflow-hidden flex flex-col">

                    {/* 1. HERO / COVER SECTION */}
                    <div className="relative h-48 sm:h-56 md:h-48 lg:h-56 bg-slate-200 dark:bg-slate-800 shrink-0">
                        {card.cover_photo ? (
                            <>
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url(${card.cover_photo})` }}
                                ></div>
                                <div className="absolute inset-0 bg-black/30"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            </>
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900"></div>
                        )}
                    </div>

                    {/* 2. PROFILE IMAGE */}
                    <div className="relative px-6 -mt-20 flex flex-col items-center shrink-0">
                        <div className="relative w-40 h-40 rounded-full p-2 bg-white dark:bg-slate-900 shadow-xl z-20">
                            {card.profile_photo ? (
                                <img
                                    src={card.profile_photo}
                                    alt={card.business_name}
                                    className="w-full h-full object-cover rounded-full bg-slate-100 dark:bg-slate-800"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl font-bold text-slate-400">
                                    {card.business_name.substring(0, 2).toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 3. HERO INFO & ACTIONS */}
                    <div className="px-6 pt-6 pb-8 text-center space-y-6 flex-1 flex flex-col">

                        {/* Text Info */}
                        <div className="space-y-3">
                            <div>
                                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
                                    {card.business_name}
                                </h1>
                                {(card.primary_contact_designation || card.sub_header) && (
                                    <p className="text-blue-600 dark:text-blue-400 font-medium text-sm uppercase tracking-wide mt-1">
                                        {card.primary_contact_designation || card.sub_header}
                                    </p>
                                )}
                            </div>

                            {card.tagline && (
                                <p className="text-slate-500 dark:text-slate-400 italic text-sm">
                                    "{card.tagline}"
                                </p>
                            )}

                            {/* Meta Tags */}
                            <div className="flex flex-wrap justify-center gap-2 pt-2">
                                {card.years_of_experience && (
                                    <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 gap-1.5">
                                        <Award className="w-3.5 h-3.5" /> {card.years_of_experience}+ Years
                                    </span>
                                )}
                                {(card.city || card.country) && (
                                    <span className="inline-flex items-center px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" /> {[card.city, card.country].filter(Boolean).join(', ')}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Social Links */}
                        {card.social_links && card.social_links.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-3">
                                {card.social_links.map((link: any) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 hover:-translate-y-1 transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm"
                                    >
                                        {getIcon(link.platform)}
                                    </a>
                                ))}
                            </div>
                        )}

                        {/* Primary Actions */}
                        <div className="grid grid-cols-4 gap-2">
                            <a href={`tel:${card.phone}`} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">Call</span>
                            </a>
                            <a href={`mailto:${card.email}`} className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">Email</span>
                            </a>
                            <a href={`https://wa.me/${card.phone}`} target="_blank" className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <MessageCircle className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-bold text-slate-500">Chat</span>
                            </a>
                            {card.website && (
                                <Link
                                    href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
                                    target="_blank"
                                    className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Globe className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500">Web</span>
                                </Link>
                            )}
                        </div>

                        <button className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Save Contact
                        </button>

                    </div>
                </div>


                {/* === RIGHT CONTENT AREA === */}
                <div className="w-full md:w-[60%] lg:w-[70%] md:pl-8 flex flex-col gap-6 pb-24 md:pb-0">

                    {/* Content Sections */}
                    <div className="space-y-6 px-6 md:px-0 pb-6 pt-6 md:pt-0">

                        {/* About Us */}
                        {(card.description) && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 md:bg-white md:dark:bg-slate-900 md:shadow-lg md:rounded-[2rem] p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-blue-500" />
                                    About Us
                                </h3>
                                <div className="space-y-4">
                                    {card.tagline && (
                                        <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                                            {card.tagline}
                                        </p>
                                    )}
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                        {card.description}
                                    </p>
                                    {/* Why Choose Us Placeholders - can be dynamic later */}
                                    <div className="pt-4">
                                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                            Why Choose Us?
                                        </h4>
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {['Professional Quality', 'On-time Delivery', 'Affordable Pricing'].map(item => (
                                                <li key={item} className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                                                    <div className="w-2 h-2 rounded-full bg-green-500" /> {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Services (formerly Products) */}
                        {card.products && card.products.length > 0 && (
                            <ServicesSection products={card.products} whatsappNumber={card.phone} />
                        )}

                        {/* Team Section */}
                        {card.proprietors && card.proprietors.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-800/50 md:bg-white md:dark:bg-slate-900 md:shadow-lg md:rounded-[2rem] p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    Management Team
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {card.proprietors.map((owner: any) => (
                                        <div key={owner.id} className="relative group bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                                            <div className="flex items-start gap-4">
                                                <div className="shrink-0 w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                                    {owner.photo ? (
                                                        <img src={owner.photo} alt={owner.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold bg-slate-200 dark:bg-slate-600">
                                                            {owner.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-900 dark:text-white truncate">{owner.name}</h4>
                                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1 truncate">{owner.designation || 'Proprietor'}</p>
                                                    <div className="flex gap-2 mt-2">
                                                        {owner.linkedin_url && (
                                                            <a href={owner.linkedin_url} target="_blank" className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-blue-600 transition-colors">
                                                                <Linkedin className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                        {owner.email && (
                                                            <a href={`mailto:${owner.email}`} className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-orange-500 transition-colors">
                                                                <Mail className="w-3.5 h-3.5" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Tooltip Bio */}
                                            {owner.bio && (
                                                <div className="hidden group-hover:block absolute left-4 right-4 bottom-full mb-2 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-20">
                                                    {owner.bio}
                                                    <div className="absolute top-full left-8 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Location, Contact Form & Map */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Contact Details */}
                            {(card.address || card.phone || card.email) && (
                                <div className="bg-white dark:bg-slate-900 md:shadow-lg md:rounded-[2rem] p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex flex-col h-full">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                        <Smartphone className="w-4 h-4 text-blue-500" />
                                        Get In Touch
                                    </h3>

                                    <div className="space-y-6 flex-1">
                                        {card.phone && (
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0"><Phone className="w-4 h-4" /></div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-0.5">Phone</h4>
                                                    <a href={`tel:${card.phone}`} className="text-sm font-semibold text-slate-900 dark:text-white hover:underline">{card.phone}</a>
                                                </div>
                                            </div>
                                        )}
                                        {card.email && (
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0"><Mail className="w-4 h-4" /></div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-0.5">Email</h4>
                                                    <a href={`mailto:${card.email}`} className="text-sm font-semibold text-slate-900 dark:text-white hover:underline break-all">{card.email}</a>
                                                </div>
                                            </div>
                                        )}
                                        {card.address && (
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><MapPin className="w-4 h-4" /></div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-0.5">Address</h4>
                                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                                                        {card.address}, {card.city}, {card.state} - {card.pincode}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        {card.business_hours && (
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0"><Clock className="w-4 h-4" /></div>
                                                <div>
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-0.5">Business Hours</h4>
                                                    <ul className="text-sm font-medium text-slate-700 dark:text-slate-300 space-y-1">
                                                        {/* Just simple rendering of array or obj */}
                                                        {Array.isArray(card.business_hours) ? card.business_hours.map((h: any, i: number) => <li key={i}>{h}</li>) : <span>9:00 AM - 6:00 PM (Mon-Sat)</span>}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Google Map Embed */}
                                    {(card.google_map_embed_url || (card.latitude && card.longitude)) && (
                                        <div className="mt-6 h-40 w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                                            {card.google_map_embed_url ? (
                                                <iframe
                                                    src={card.google_map_embed_url}
                                                    width="100%"
                                                    height="100%"
                                                    style={{ border: 0 }}
                                                    allowFullScreen
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-500 text-xs">
                                                    Map Preview (Lat: {card.latitude}, Long: {card.longitude})
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Payment Section & Contact Form */}
                            <div className="flex flex-col gap-6">
                                <PaymentSection
                                    bankDetails={card.bank_details}
                                    paymentQrCode={card.payment_qr_code}
                                    paymentMethods={card.payment_methods || []}
                                />
                                <ContactForm cardId={card.id} whatsappNumber={card.phone} />
                            </div>

                        </div>

                        <div className="pt-8 pb-4">
                            <p className="text-xs text-slate-400 text-center">
                                © {new Date().getFullYear()} {card.business_name}. All rights reserved.
                            </p>
                        </div>

                    </div>
                </div>

            </main>

            <FloatingActions card={card} />
        </div>
    );
}
