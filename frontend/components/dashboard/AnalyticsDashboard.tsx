'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Eye, MousePointer2, ScanLine, QrCode, Calendar, Download, ChevronDown, BarChart3, PieChart } from 'lucide-react';
import StatCard from './analytics/StatCard';
import SimpleBarChart from './analytics/SimpleBarChart';
import ActivityTable from './analytics/ActivityTable';

interface AnalyticsDashboardProps {
    cards: any[];
}

export default function AnalyticsDashboard({ cards }: AnalyticsDashboardProps) {
    const [selectedCardId, setSelectedCardId] = useState<number | null>(cards.length > 0 ? cards[0].id : null);
    const [dateRange, setDateRange] = useState('30d'); // 7d, 30d, all
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const selectedCard = cards.find(c => c.id === selectedCardId);

    useEffect(() => {
        if (!selectedCardId) return;
        fetchAnalytics();
    }, [selectedCardId, dateRange]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            // Calculate timestamps based on range
            const end = new Date();
            const start = new Date();
            if (dateRange === '7d') start.setDate(end.getDate() - 7);
            if (dateRange === '30d') start.setDate(end.getDate() - 30);

            // Format YYYY-MM-DD
            const s = start.toISOString().split('T')[0];
            const e = end.toISOString().split('T')[0];

            const res = await api.get(`/cards/${selectedCardId}/analytics?start_date=${s}&end_date=${e}`);
            setData(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!selectedCard) return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full mb-4">
                <BarChart3 className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No Business Cards Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">Create a digital business card first to track analytics and performance.</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Analytics Overview
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track how people interact with your digital business card</p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm w-fit">
                    {/* Card Selector Loop if multiple */}
                    {cards.length > 1 && (
                        <div className="relative border-r border-slate-200 dark:border-slate-700 pr-3 mr-1">
                            <select
                                value={selectedCardId || ''}
                                onChange={(e) => setSelectedCardId(Number(e.target.value))}
                                className="appearance-none bg-transparent pl-3 pr-8 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                            >
                                {cards.map(c => (
                                    <option key={c.id} value={c.id}>{c.business_name || 'Untitled Card'}</option>
                                ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    )}

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setDateRange('7d')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${dateRange === '7d' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            7 Days
                        </button>
                        <button
                            onClick={() => setDateRange('30d')}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${dateRange === '30d' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            30 Days
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>)}
                </div>
            ) : (
                <>
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Views"
                            value={data?.summary?.views || 0}
                            icon={Eye}
                            color="blue"
                            description="Unique page visits"
                        />
                        <StatCard
                            title="Button Clicks"
                            value={data?.summary?.clicks || 0}
                            icon={MousePointer2}
                            color="purple"
                            description="Interactions with links"
                        />
                        <StatCard
                            title="QR Scans"
                            value={data?.summary?.scans || 0}
                            icon={QrCode}
                            color="orange"
                            description="Direct QR code scans"
                        />
                        <StatCard
                            title="Payment Scans"
                            value={0} // Placeholder, not yet tracked separately in controller
                            icon={ScanLine}
                            color="green"
                            description="Payment QR views"
                        />
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-slate-400" />
                                    Performance Trends
                                </h3>
                                <div className="flex gap-4 text-xs font-medium">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Views
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div> Clicks
                                    </div>
                                </div>
                            </div>
                            <SimpleBarChart data={data?.chart_data || []} />
                        </div>

                        {/* Traffic Sources / Breakdown */}
                        <div className="space-y-6">
                            {/* Device/Source */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                    <PieChart className="w-5 h-5 text-slate-400" />
                                    Traffic Sources
                                </h3>
                                <div className="space-y-3">
                                    {data?.sources?.length > 0 ? data.sources.map((source: any) => (
                                        <div key={source.name}>
                                            <div className="flex justify-between text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                                                <span>{source.name}</span>
                                                <span>{source.count}</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <div style={{ width: `${(source.count / (data.summary.views || 1)) * 100}%` }} className="h-full bg-blue-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    )) : <p className="text-sm text-slate-400 text-center py-4">No source data yet</p>}
                                </div>
                            </div>

                            {/* Button Clicks */}
                            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Top Button Clicks</h3>
                                <div className="space-y-3">
                                    {data?.button_breakdown?.length > 0 ? data.button_breakdown.map((btn: any) => (
                                        <div key={btn.name} className="flex items-center justify-between text-sm p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                            <span className="font-medium text-slate-700 dark:text-slate-300">{btn.name}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-purple-600 dark:text-purple-400">{btn.count}</span>
                                                <span className="text-xs text-slate-400 w-8 text-right">{btn.percentage}%</span>
                                            </div>
                                        </div>
                                    )) : <p className="text-sm text-slate-400 text-center py-4">No clicks yet</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white">Recent Activity</h3>
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                <Download className="w-3 h-3" /> Export
                            </button>
                        </div>
                        <ActivityTable activities={data?.recent_activity || []} />
                    </div>
                </>
            )}
        </div>
    );
}
