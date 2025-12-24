"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import Sidebar from '@/components/dashboard/Sidebar';
import CardEditor from '@/components/editor/CardEditor';
import { ExternalLink, Eye, Share2, User } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [card, setCard] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('business_details'); // Default to Business Details as per request for "Editor" Dashboard

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cardsRes, userRes] = await Promise.all([
                    api.get('/cards'),
                    api.get('/user')
                ]);
                // Assuming single card policy, we take the first one if it exists
                if (cardsRes.data.length > 0) {
                    // Fetch full details for the first card (slug might be needed if /cards response is compact)
                    // The list endpoint might not return products/proprietors, so let's fetch individual
                    const slug = cardsRes.data[0].slug;
                    const fullCardRes = await api.get(`/cards/${slug}`);
                    setCard(fullCardRes.data);
                }
                setUser(userRes.data);
            } catch (error) {
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [router]);

    const handleLogout = async () => {
        try {
            await api.post('/logout');
            localStorage.removeItem('token');
            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 bg-slate-50 dark:bg-slate-900">Loading...</div>;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user} />

            <main className="flex-1 min-h-screen overflow-y-auto">
                <div className="max-w-5xl mx-auto p-4 lg:p-8">
                    {/* Mobile Header (Hidden on LG) */}
                    <div className="lg:hidden mb-6 flex justify-between items-center">
                        <div className="font-bold text-xl text-slate-900 dark:text-white">DigitalCard</div>
                        <button onClick={handleLogout} className="text-sm text-red-500">Logout</button>
                    </div>

                    {activeTab === 'dashboard' && (
                        <div className="space-y-8">
                            {/* Welcome Section */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                                    <p className="text-slate-500">Welcome back, {user?.name || 'User'}!</p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Profile Stats */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Profile</p>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {card ? 'Complete' : 'Incomplete'}
                                        </h3>
                                    </div>
                                </div>

                                {/* Products Stats */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-xl flex items-center justify-center text-green-600">
                                        <div className="w-6 h-6 border-2 border-current rounded-md flex items-center justify-center text-xs font-bold">P</div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Products</p>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {card?.products?.length || 0}
                                        </h3>
                                    </div>
                                </div>

                                {/* Social Links Stats */}
                                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-600">
                                        <Share2 className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Social Links</p>
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                                            {card?.social_links?.length || 0}
                                        </h3>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center hover:shadow-md transition-shadow group text-left"
                                    >
                                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 mr-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600">Edit Profile</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('business_details')}
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center hover:shadow-md transition-shadow group text-left"
                                    >
                                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 mr-4 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600">Business Details</span>
                                    </button>

                                    <button
                                        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center hover:shadow-md transition-shadow group text-left opacity-60 cursor-not-allowed"
                                    >
                                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 mr-4">
                                            <div className="w-5 h-5 border-2 border-current rounded-full" />
                                        </div>
                                        <span className="font-medium text-slate-700 dark:text-slate-200">Change Password</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'business_details' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Business Details</h1>
                                    <p className="text-slate-500 text-sm mt-1">Manage your digital business card information.</p>
                                </div>
                                {card && (
                                    <Link href={`/cards/${card.slug}`} target="_blank" className="hidden sm:inline-flex">
                                        <button className="flex items-center text-sm font-medium text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-colors">
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Preview Card
                                        </button>
                                    </Link>
                                )}
                            </div>

                            {/* Reuse CardEditor for both Create and Edit modes */}
                            {/* If card exists, isEditing=true. If not, isEditing=false (Create mode) */}
                            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 overflow-hidden">
                                <CardEditor
                                    initialData={card}
                                    isEditing={!!card}
                                    userData={user}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                                <div className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                        <input type="text" value={user?.name || ''} disabled className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                        <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
