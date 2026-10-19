import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useLocation } from "react-router-dom";
import { normalize } from "./utils/UniformedResourceNameUtils";
import { ResponsiveCalendar } from '@nivo/calendar';
import Content from "./Content";
import { useTheme } from "./context/ThemeContext";

export default function Dashboard() {
    const { pathname } = useLocation();
    const urn = decodeURI(normalize(pathname));
    const { theme } = useTheme();

    const [weekly, setWeekly] = useState(0);
    const [monthly, setMonthly] = useState(0);
    const [total, setTotal] = useState(0);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [activeBar, setActiveBar] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(false);
        axios.get(`${process.env.REACT_APP_URI}/api/urns/${urn}`)
            .then(response => {
                setWeekly(response.data.weekly || 0);
                setMonthly(response.data.monthly || 0);
                setTotal(response.data.total || 0);
                setItems(response.data.items || []);
                setLoading(false);
            }).catch(err => {
                console.error(err);
                setWeekly(0);
                setMonthly(0);
                setTotal(0);
                setItems([]);
                setLoading(false);
                setError(true);
            });
    }, [urn]);

    // Flatten daily data for analysis
    const allDailyData = [];
    if (items && Array.isArray(items)) {
        items.forEach(item => {
            if (item.data && Array.isArray(item.data)) {
                allDailyData.push(...item.data);
            }
        });
    }
    allDailyData.sort((a, b) => a.day.localeCompare(b.day));

    // Calculate Today's hits from real data
    const todayIso = new Date().toISOString().slice(0, 10);
    const todayLocal = new Date().toLocaleDateString('en-CA');
    const todayItem = allDailyData.find(d => d.day === todayIso || d.day === todayLocal);
    const todayHits = todayItem ? todayItem.value : 0;

    // Peak day
    let peakHits = 0;
    let peakDay = null;
    allDailyData.forEach(d => {
        if (d.value > peakHits) {
            peakHits = d.value;
            peakDay = d.day;
        }
    });

    // Recent 14 daily data entries for trend visualization
    const recentDays = allDailyData.slice(-14);
    const maxRecentValue = recentDays.reduce((max, d) => Math.max(max, d.value), 1);

    const isGitHub = urn.startsWith("github.com/") || urn === "github.com";
    const targetUrl = urn.startsWith("http://") || urn.startsWith("https://") ? urn : `https://${urn}`;

    const handleCopy = () => {
        if (typeof window !== "undefined") {
            const pageUrl = window.location.href;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(pageUrl).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                });
            }
        }
    };

    const isDark = theme !== 'light';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-150">
            <Header />

            <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
                {/* Target Hero & Quick Actions */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-3 min-w-0">
                            {/* Breadcrumb / Platform Indicator */}
                            <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                {isGitHub ? (
                                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                        </svg>
                                        <span>GitHub</span>
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        <span>Website</span>
                                    </span>
                                )}
                                <span>&bull;</span>
                                <span>Traffic & Badge Analytics</span>
                            </div>

                            {/* Main Target Heading */}
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono break-words leading-tight">
                                {urn}
                            </h1>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <a
                                href={targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                            >
                                <span>{isGitHub ? "Open on GitHub" : "Visit Target"}</span>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>

                            <button
                                type="button"
                                onClick={handleCopy}
                                aria-label="Copy page URL"
                                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {copied ? (
                                    <>
                                        <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-emerald-600 dark:text-emerald-400">Copied Link!</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                        <span>Share</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-4 text-rose-800 dark:text-rose-200 flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-sm">
                            <svg className="w-5 h-5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Could not connect to the hits API. Showing offline or default statistics.</span>
                        </div>
                    </div>
                )}

                {/* Core Metrics Grid */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
                            <span>Key Metrics Overview</span>
                        </h2>
                        {peakHits > 0 && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                                Peak: {peakHits} views {peakDay ? `(${peakDay})` : ""}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Total Hits */}
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-5 shadow-sm transition-all hover:border-slate-300 dark:hover:border-white/20">
                            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
                                <p className="text-xs font-semibold uppercase tracking-wider">Total Hits</p>
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <h2 data-testid="total" className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                                {total.toLocaleString()}
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">All-time lifetime views</p>
                        </div>

                        {/* Today's Hits */}
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-5 shadow-sm transition-all hover:border-slate-300 dark:hover:border-white/20">
                            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
                                <p className="text-xs font-semibold uppercase tracking-wider">Today's Hits</p>
                                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                                {todayHits.toLocaleString()}
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Recorded today ({todayLocal})</p>
                        </div>

                        {/* Weekly Hits */}
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-5 shadow-sm transition-all hover:border-slate-300 dark:hover:border-white/20">
                            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
                                <p className="text-xs font-semibold uppercase tracking-wider">Weekly Hits</p>
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 data-testid="weekly" className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                                {weekly.toLocaleString()}
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Rolling last 7 days</p>
                        </div>

                        {/* Monthly Hits */}
                        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-5 shadow-sm transition-all hover:border-slate-300 dark:hover:border-white/20">
                            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-3">
                                <p className="text-xs font-semibold uppercase tracking-wider">Monthly Hits</p>
                                <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h2 data-testid="monthly" className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                                {monthly.toLocaleString()}
                            </h2>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Rolling last 30 days</p>
                        </div>
                    </div>
                </div>

                {/* Visit Trends & Daily Analytics */}
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 p-6 sm:p-8 shadow-sm space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                </svg>
                                <span>Visit Trends & Activity</span>
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Historical daily hit distributions from the official hits database
                            </p>
                        </div>

                        {allDailyData.length > 0 && (
                            <div className="inline-flex items-center space-x-2 text-xs font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10">
                                <span>{allDailyData[0].day}</span>
                                <span>&rarr;</span>
                                <span>{allDailyData[allDailyData.length - 1].day}</span>
                            </div>
                        )}
                    </div>

                    {/* Recent 14 Days Interactive Bar Chart */}
                    {recentDays.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Recent Daily Visits (Last {recentDays.length} Active Days)
                                </h4>
                                {activeBar && (
                                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400">
                                        {activeBar.day}: <strong>{activeBar.value}</strong> hits
                                    </span>
                                )}
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl p-4 sm:p-6">
                                <div className="h-36 sm:h-44 flex items-end gap-1.5 sm:gap-3 justify-between pt-6 pb-2">
                                    {recentDays.map((d, idx) => {
                                        const heightPercent = Math.max(8, Math.round((d.value / maxRecentValue) * 100));
                                        const isHovered = activeBar && activeBar.day === d.day;
                                        return (
                                            <div
                                                key={idx}
                                                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                                                onMouseEnter={() => setActiveBar(d)}
                                                onMouseLeave={() => setActiveBar(null)}
                                            >
                                                {/* Tooltip */}
                                                <div className={`absolute -top-10 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-mono rounded shadow-lg pointer-events-none transition-all z-20 whitespace-nowrap ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                                                    {d.day}: {d.value} hits
                                                </div>

                                                {/* Bar */}
                                                <div
                                                    style={{ height: `${heightPercent}%` }}
                                                    className={`w-full max-w-[28px] rounded-t-sm transition-all duration-150 ${isHovered
                                                        ? 'bg-blue-600 dark:bg-blue-400 shadow-md'
                                                        : 'bg-blue-500/80 dark:bg-blue-500/60 hover:bg-blue-600 dark:hover:bg-blue-400'
                                                    }`}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Date labels */}
                                <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2 text-[10px] sm:text-xs font-mono text-slate-400 dark:text-slate-500">
                                    <span>{recentDays[0].day.slice(5)}</span>
                                    {recentDays.length > 6 && (
                                        <span>{recentDays[Math.floor(recentDays.length / 2)].day.slice(5)}</span>
                                    )}
                                    <span>{recentDays[recentDays.length - 1].day.slice(5)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Full Year Contribution Heatmap */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                Annual Contribution Heatmap
                            </h4>
                            <span className="text-xs text-slate-400">Scroll horizontally on mobile</span>
                        </div>

                        <div className="w-full space-y-4">
                            {items.length > 0 ? (
                                items.map((item, index) => (
                                    <div
                                        data-testid="chart"
                                        key={index}
                                        className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl p-4 overflow-x-auto"
                                    >
                                        <div className="min-w-[680px] h-36">
                                            <ResponsiveCalendar
                                                data={item.data}
                                                from={item.from}
                                                to={item.to}
                                                emptyColor={isDark ? "#1e293b" : "#e2e8f0"}
                                                colors={isDark
                                                    ? ['#064e3b', '#065f46', '#047857', '#059669', '#10b981']
                                                    : ['#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a']
                                                }
                                                margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
                                                monthBorderWidth={0}
                                                dayBorderWidth={2}
                                                dayBorderColor={isDark ? "#0B0F19" : "#ffffff"}
                                                theme={{
                                                    textColor: isDark ? '#94a3b8' : '#475569',
                                                    fontSize: 11,
                                                    tooltip: {
                                                        container: {
                                                            background: isDark ? '#1e293b' : '#ffffff',
                                                            color: isDark ? '#f8fafc' : '#0f172a',
                                                            fontSize: '12px',
                                                            borderRadius: '8px',
                                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div
                                    data-testid="chart"
                                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 rounded-xl p-4 overflow-x-auto"
                                >
                                    <div className="min-w-[680px] h-36">
                                        <ResponsiveCalendar
                                            data={[]}
                                            from={new Date().getFullYear() + '-01-01'}
                                            to={new Date().getFullYear() + '-12-31'}
                                            emptyColor={isDark ? "#1e293b" : "#e2e8f0"}
                                            colors={isDark
                                                ? ['#064e3b', '#065f46', '#047857', '#059669', '#10b981']
                                                : ['#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a']
                                            }
                                            margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
                                            monthBorderWidth={0}
                                            dayBorderWidth={2}
                                            dayBorderColor={isDark ? "#0B0F19" : "#ffffff"}
                                            theme={{
                                                textColor: isDark ? '#94a3b8' : '#475569',
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Badge Studio & Embed Section */}
                <div className="space-y-4">
                    <div>
                        <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
                            <span>Badge Studio &amp; Embed</span>
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Customize and embed real-time traffic badges into GitHub READMEs, personal portfolios, or blog sites.
                        </p>
                    </div>

                    <Content url={urn} />
                </div>
            </main>
        </div>
    );
}