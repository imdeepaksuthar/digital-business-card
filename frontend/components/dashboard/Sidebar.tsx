"use client";
import React from 'react';
import { LayoutDashboard, User, CreditCard, LogOut, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
    user: any;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, user }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'business_details', label: 'Business Details', icon: CreditCard },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 h-screen sticky top-0 flex flex-col hidden lg:flex">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2 text-blue-600">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-lg">D</span>
                    </div>
                    <span className="font-bold text-xl text-slate-900 dark:text-white">DigitalCard</span>
                </div>
            </div>

            <div className="p-4 flex-1">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">User Panel</div>
                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-slate-700 dark:text-white font-medium shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:hover:bg-slate-700/50 dark:hover:text-slate-200'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600 dark:text-white' : 'text-slate-400'}`} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center p-3 mb-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-slate-600 flex items-center justify-center text-blue-600 dark:text-gray-200 font-bold mr-3">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={onLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );
}
