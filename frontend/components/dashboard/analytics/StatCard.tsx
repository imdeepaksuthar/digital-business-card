'use client';

import { ArrowUpRight, ArrowDownRight, type LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    description?: string;
    color?: string; // e.g. "blue", "green"
}

export default function StatCard({ title, value, icon: Icon, trend, trendValue, description, color = "blue" }: StatCardProps) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
        green: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
        purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
        orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
        slate: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    }[color] || "bg-slate-50 text-slate-600";

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${colorClasses}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {trendValue}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {title}
                </h3>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                    {value}
                </div>
                {description && (
                    <p className="text-xs text-slate-400 mt-1">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}
