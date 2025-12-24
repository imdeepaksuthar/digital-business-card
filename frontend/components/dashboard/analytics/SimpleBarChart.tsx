'use client';

interface ChartData {
    date: string;
    views: number;
    clicks: number;
}

export default function SimpleBarChart({ data }: { data: ChartData[] }) {
    if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center text-slate-400 text-sm">No data available</div>;

    const maxVal = Math.max(...data.map(d => Math.max(d.views, d.clicks, 1)));

    return (
        <div className="h-64 flex items-end gap-2 sm:gap-4 overflow-x-auto pb-6 pt-10 px-2 group">
            {data.map((item) => {
                const viewsHeight = (item.views / maxVal) * 100;
                const clicksHeight = (item.clicks / maxVal) * 100;

                return (
                    <div key={item.date} className="flex flex-col justify-end h-full gap-1 min-w-[20px] flex-1 relative group/bar text-center">
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/bar:block z-10 w-max">
                            <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl">
                                <p className="font-bold border-b border-white/20 pb-1 mb-1">{item.date}</p>
                                <div className="flex gap-3">
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span>{item.views} Views</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        <span>{item.clicks} Clicks</span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-2 h-2 bg-slate-900 rotate-45 absolute left-1/2 -ml-1 -bottom-1"></div>
                        </div>

                        {/* Bars */}
                        <div className="w-full flex gap-0.5 sm:gap-1 px-0.5 items-end flex-1">
                            <div
                                style={{ height: `${viewsHeight}%` }}
                                className="w-1/2 bg-blue-500/80 hover:bg-blue-500 rounded-t-sm transition-all duration-300 min-h-[4px]"
                            />
                            <div
                                style={{ height: `${clicksHeight}%` }}
                                className="w-1/2 bg-purple-500/80 hover:bg-purple-500 rounded-t-sm transition-all duration-300 min-h-[4px]"
                            />
                        </div>

                        {/* X-Axis Label */}
                        <div className="text-[10px] text-slate-400 truncate w-full pt-2 border-t border-slate-100 dark:border-slate-700">
                            {item.date.substring(5)} {/* Show MM-DD */}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
