'use client';

import { Eye, MousePointer2, ScanLine } from 'lucide-react';

interface Activity {
    id: number;
    type: string;
    metadata: any;
    date: string;
    ip?: string;
}

export default function ActivityTable({ activities }: { activities: Activity[] }) {
    if (!activities || activities.length === 0) return <div className="p-8 text-center text-slate-400 text-sm">No recent activity</div>;

    const getIcon = (type: string) => {
        switch (type) {
            case 'view': return <Eye className="w-4 h-4 text-blue-500" />;
            case 'click': return <MousePointer2 className="w-4 h-4 text-purple-500" />;
            case 'scan': return <ScanLine className="w-4 h-4 text-orange-500" />;
            default: return <Eye className="w-4 h-4 text-slate-500" />;
        }
    };

    const formatMetadata = (activity: Activity) => {
        if (activity.type === 'click') {
            const btn = activity.metadata?.button || activity.metadata?.platform;
            return btn ? `Clicked ${btn}` : 'Button click';
        }
        if (activity.type === 'scan') return 'QR Code Scan';
        if (activity.type === 'view') return 'Page View';
        return activity.type;
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 text-xs uppercase tracking-wider bg-slate-50 dark:bg-slate-900/50">
                        <th className="px-6 py-4 font-semibold">Action</th>
                        <th className="px-6 py-4 font-semibold">Details</th>
                        <th className="px-6 py-4 font-semibold">Date & Time</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {activities.map((activity) => (
                        <tr key={activity.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                                    ${activity.type === 'view' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
                                        activity.type === 'click' ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20' :
                                            'bg-orange-50 text-orange-600 dark:bg-orange-900/20'}
                                `}>
                                    {getIcon(activity.type)}
                                    {activity.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-700 dark:text-slate-300 font-medium">
                                {formatMetadata(activity)}
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400 tabular-nums">
                                {new Date(activity.date).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
