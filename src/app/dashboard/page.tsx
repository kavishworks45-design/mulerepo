"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
    LayoutDashboard,
    Plus,
    Settings,
    Rocket,
    GitBranch,
    Star,
    Activity,
    LogOut,
    Search,
    Filter,
    MoreVertical,
    Clock,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState("overview");

    const recentActivity = [
        { type: "pushed", project: "SAP-Salesforce-Sync", time: "2 hours ago", status: "success" },
        { type: "deployed", project: "Generic-Error-Handler", time: "5 hours ago", status: "success" },
        { type: "forked", project: "Netsuite-Order-Cash", time: "1 day ago", status: "neutral" },
    ];

    const mypocs = [
        {
            id: 1,
            title: "SAP to Salesforce Sync",
            status: "Live",
            views: 1240,
            downloads: 45,
            updated: "2 days ago",
            health: 98
        },
        {
            id: 4,
            title: "Generic Error Handler",
            status: "Live",
            views: 3102,
            downloads: 890,
            updated: "1 month ago",
            health: 100
        },
        {
            id: 101, // Mock draft
            title: "Workday Integration V2",
            status: "Draft",
            views: 0,
            downloads: 0,
            updated: "Just now",
            health: 0
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background">
            <Header />

            <div className="pt-24 pb-16 min-h-screen flex">

                {/* Sidebar Navigation (Desktop) */}
                <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-16 bottom-0 border-r border-white/5 bg-black/20 p-6 z-20">
                    <div className="mb-8 px-2">
                        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-3 text-white mb-1">
                                <div className="h-8 w-8 rounded bg-white/20 flex items-center justify-center font-bold">M</div>
                                <div>
                                    <div className="font-bold text-sm">MuleSoft Architect</div>
                                    <div className="text-[10px] opacity-80">Pro Plan</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav className="space-y-1 flex-1">
                        <button
                            onClick={() => setActiveTab("overview")}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-600/10 text-blue-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab("pocs")}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pocs' ? 'bg-blue-600/10 text-blue-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Rocket className="h-4 w-4" />
                            My POCs
                        </button>
                        <button
                            onClick={() => setActiveTab("analytics")}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-blue-600/10 text-blue-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Activity className="h-4 w-4" />
                            Analytics
                        </button>
                        <button
                            onClick={() => setActiveTab("settings")}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-blue-600/10 text-blue-400' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <Settings className="h-4 w-4" />
                            Settings
                        </button>
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <Link href="/" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-64 px-4 lg:px-8">
                    <div className="max-w-6xl mx-auto">

                        {/* Dashboard Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
                                <p className="text-zinc-400">Welcome back, Architect. Here's what's happening with your contributions.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="btn bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
                                    <Plus className="h-4 w-4" />
                                    New POC
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: "Total Contributions", value: "12", icon: Rocket, color: "text-blue-400", bg: "bg-blue-500/10" },
                                { label: "Total Views", value: "4.2k", icon: Activity, color: "text-green-400", bg: "bg-green-500/10" },
                                { label: "Forks", value: "145", icon: GitBranch, color: "text-purple-400", bg: "bg-purple-500/10" },
                                { label: "Stars Earned", value: "389", icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
                            ].map((stat, i) => (
                                <div key={i} className="bg-card/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm hover:border-white/10 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                            <stat.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-semibold text-green-400 flex items-center gap-1">
                                            +12% <span className="text-zinc-500 font-normal">vs last week</span>
                                        </span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-zinc-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Content Split */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* Main List - My POCs */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-card/50 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm">
                                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                        <h2 className="text-lg font-bold text-white">Your Contributions</h2>
                                        <div className="flex items-center gap-2">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
                                                <input type="text" placeholder="Search..." className="bg-zinc-900 border border-white/10 rounded-md py-1.5 pl-8 pr-3 text-xs text-white focus:outline-none focus:border-blue-500/50 w-32 md:w-48" />
                                            </div>
                                            <button className="p-1.5 rounded-md hover:bg-zinc-800 text-zinc-400">
                                                <Filter className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-white/5">
                                        {mypocs.map((poc) => (
                                            <div key={poc.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4 group">
                                                <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-white/5">
                                                    {poc.title.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-white truncate group-hover:text-blue-400 transition-colors">{poc.title}</h3>
                                                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${poc.status === 'Live' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                                                            {poc.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                                                        <span>Updated {poc.updated}</span>
                                                        <span>•</span>
                                                        <span>{poc.views} views</span>
                                                        <span>•</span>
                                                        <span>{poc.downloads} downloads</span>
                                                    </div>
                                                </div>
                                                <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-zinc-800 rounded-md text-zinc-400 transition-all">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 border-t border-white/5 text-center">
                                        <button className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors">View All Contributions</button>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Recent Activity */}
                            <div className="space-y-6">
                                <div className="bg-card/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                                    <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                                    <div className="space-y-6">
                                        {recentActivity.map((activity, i) => (
                                            <div key={i} className="flex gap-4 relative">
                                                {i !== recentActivity.length - 1 && <div className="absolute left-2.5 top-8 bottom-[-24px] w-px bg-zinc-800"></div>}
                                                <div className={`relative z-10 h-5 w-5 rounded-full border-2 ${activity.status === 'success' ? 'border-green-500 bg-green-500/20' : 'border-zinc-500 bg-zinc-500/20'} flex-shrink-0 mt-0.5`}></div>
                                                <div>
                                                    <p className="text-sm text-zinc-300">
                                                        You <span className="text-white font-medium">{activity.type}</span> to <span className="text-blue-400">{activity.project}</span>
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <Clock className="h-3 w-3 text-zinc-500" />
                                                        <span className="text-xs text-zinc-500">{activity.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* System Status */}
                                <div className="bg-card/50 border border-white/5 rounded-xl p-6 backdrop-blur-sm">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 mb-4">System Status</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-zinc-300">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span>API Gateway</span>
                                            </div>
                                            <span className="text-green-500 text-xs">Operational</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-zinc-300">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span>Database</span>
                                            </div>
                                            <span className="text-green-500 text-xs">Operational</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-zinc-300">
                                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                                <span>Build Server</span>
                                            </div>
                                            <span className="text-yellow-500 text-xs">High Load</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
