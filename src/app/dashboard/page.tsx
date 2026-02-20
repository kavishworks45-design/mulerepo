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
    AlertCircle,
    Lock,
    Trash2,
    Eye
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { POCS } from "@/data/pocs";
import { Toast, ToastType } from "@/components/ui/Toast";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("overview");
    const [localPocs, setLocalPocs] = useState<any[]>([]);

    // Toast State
    const [toast, setToast] = useState<{ isVisible: boolean; message: string; type: ToastType }>({
        isVisible: false,
        message: "",
        type: "info"
    });

    const showToast = (message: string, type: ToastType) => {
        setToast({ isVisible: true, message, type });
    };

    // Modal State
    const [deleteModal, setDeleteModal] = useState<{ isVisible: boolean; pocId: number | null; pocTitle: string; isDeleting: boolean }>({
        isVisible: false,
        pocId: null,
        pocTitle: "",
        isDeleting: false
    });

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    // Load any user-created POCs from localStorage
    // Load user POCs from GitHub Catalog (via API)
    useEffect(() => {
        const fetchPocs = async () => {
            if (user) {
                try {
                    const res = await fetch("/api/pocs/list");
                    const allPocs = await res.json();

                    // Filter for my POCs
                    const myPocs = allPocs.filter((p: any) => p.authorId === user.uid);
                    setLocalPocs(myPocs);
                } catch (e) {
                    console.error("Failed to fetch user POCs", e);
                }
            }
        };
        fetchPocs();
    }, [user]);

    const handleDeleteClick = (id: number) => {
        const pocToDelete = localPocs.find(p => p.id === id);
        if (!pocToDelete || !pocToDelete.folderName) {
            showToast("Could not find folder info for this POC.", "error");
            return;
        }

        setDeleteModal({
            isVisible: true,
            pocId: id,
            pocTitle: pocToDelete.title,
            isDeleting: false
        });
    };

    const confirmDelete = async () => {
        if (!deleteModal.pocId) return;

        const pocToDelete = localPocs.find(p => p.id === deleteModal.pocId);
        if (!pocToDelete || !pocToDelete.folderName) return;

        setDeleteModal(prev => ({ ...prev, isDeleting: true }));

        try {
            const res = await fetch(`/api/pocs/delete?folderName=${encodeURIComponent(pocToDelete.folderName)}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setLocalPocs(prev => prev.filter(p => p.id !== deleteModal.pocId));
                showToast(`Successfully deleted '${pocToDelete.title}'`, "success");
            } else {
                const data = await res.json();
                showToast(`Error deleting POC: ${data.error}`, "error");
            }
        } catch (err) {
            console.error("Failed to delete POC", err);
            showToast("An error occurred while deleting the POC.", "error");
        } finally {
            setDeleteModal({ isVisible: false, pocId: null, pocTitle: "", isDeleting: false });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) return null;

    const recentActivity = [
        { type: "pushed", project: "SAP-Salesforce-Sync", time: "2 hours ago", status: "success" },
        { type: "deployed", project: "Generic-Error-Handler", time: "5 hours ago", status: "success" },
        { type: "forked", project: "Netsuite-Order-Cash", time: "1 day ago", status: "neutral" },
    ];

    // Combine Static + Local POCs
    // Simulate "My POCs" by taking a subset of the global POCS
    const staticPocs = POCS.slice(0, 3).map((poc, index) => ({
        id: poc.id,
        title: poc.title,
        status: index === 2 ? "Draft" : "Live",
        views: poc.stars * 35 + 120,
        downloads: poc.forks * 8 + 45,
        updated: poc.updated,
        health: index === 2 ? 0 : 95 + index,
        icon: null, // Use default logic
        isLocal: false
    }));

    const timeAgo = (dateStr: string) => {
        if (!dateStr || dateStr === "Unknown") return "Unknown";
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "Just now";
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " seconds ago";
    };

    const combined = [
        ...localPocs.map(p => ({
            ...p,
            isLocal: true,
            status: "Published", // GitHub POCs are considered Live/Published
            authorName: p.authorName || user.displayName || "Me" // Show author
        })),
        ...staticPocs
    ];
    // Deduplicate by ID
    const mypocs = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

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

                        {/* Dynamic Dashboard Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-2">
                                    {activeTab === 'overview' && 'My Dashboard'}
                                    {activeTab === 'pocs' && 'My Contributions'}
                                    {activeTab === 'analytics' && 'Performance Analytics'}
                                    {activeTab === 'settings' && 'Account Settings'}
                                </h1>
                                <p className="text-zinc-400">
                                    {activeTab === 'overview' && (
                                        <>Welcome back, <span className="text-white font-medium">{user?.displayName ? user.displayName.split(' ')[0] : 'Architect'}</span>. Here's what's happening.</>
                                    )}
                                    {activeTab === 'pocs' && 'Manage your patterns, templates, and integration assets.'}
                                    {activeTab === 'analytics' && 'Track views, downloads, and usage metrics for your POCs.'}
                                    {activeTab === 'settings' && 'Manage your profile details and preferences.'}
                                </p>
                            </div>
                            {activeTab !== 'settings' && (
                                <div className="flex items-center gap-3">
                                    <Link href="/poc/new" className="btn bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all">
                                        <Plus className="h-4 w-4" />
                                        New POC
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* TAB CONTENT: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <>
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

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Main List - My POCs Preview */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-card/50 border border-white/5 rounded-xl overflow-hidden backdrop-blur-sm">
                                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                                <h2 className="text-lg font-bold text-white">Your Contributions</h2>
                                                <button
                                                    onClick={() => setActiveTab('pocs')}
                                                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                                >
                                                    View All
                                                </button>
                                            </div>

                                            <div className="divide-y divide-white/5">
                                                {mypocs.map((poc) => (
                                                    <div key={poc.id} className="p-4 hover:bg-white/5 transition-colors flex items-center gap-4 group">
                                                        <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-white/5">
                                                            {poc.title.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Link href={`/poc/${poc.id}`} className="block flex-1 min-w-0">
                                                                    <h3 className="font-semibold text-white truncate hover:text-blue-400 transition-colors">{poc.title}</h3>
                                                                </Link>
                                                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${poc.status === 'Live' || poc.status === 'Published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                                                                    {poc.status}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-xs text-zinc-500">
                                                                <span>Updated {timeAgo(poc.updated)}</span>
                                                                <span>•</span>
                                                                <span className="text-zinc-400">by {poc.authorName || "MuleSoft"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Link href={`/poc/${poc.id}`} className="p-2 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-blue-400 transition-all">
                                                                <Eye className="h-4 w-4" />
                                                            </Link>
                                                            {poc.isLocal && (
                                                                <button
                                                                    onClick={() => handleDeleteClick(poc.id)}
                                                                    className="p-2 hover:bg-red-500/10 rounded-md text-zinc-400 hover:text-red-400 transition-all"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* TAB CONTENT: MY POCS */}
                        {activeTab === 'pocs' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <Search className="h-5 w-5 text-zinc-500" />
                                    <input
                                        type="text"
                                        placeholder="Search your contributions..."
                                        className="bg-transparent border-none focus:ring-0 text-white flex-1 placeholder:text-zinc-600 focus:outline-none"
                                    />
                                    <div className="h-6 w-px bg-white/10 mx-2"></div>
                                    <button className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                                        <Filter className="h-4 w-4" />
                                        <span>Filters</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {mypocs.map((poc) => (
                                        <div key={poc.id} className="bg-card/50 border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all group relative overflow-hidden flex flex-col">

                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="h-12 w-12 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 font-bold border border-blue-500/20">
                                                        {poc.title.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    {poc.isLocal && (
                                                        <button
                                                            onClick={() => handleDeleteClick(poc.id)}
                                                            className="text-zinc-500 hover:text-red-400 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                                            title="Delete POC"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>

                                                <Link href={`/poc/${poc.id}`} className="block mb-2">
                                                    <h3 className="font-bold text-white truncate pr-2 hover:text-blue-400 transition-colors" title={poc.title}>{poc.title}</h3>
                                                </Link>

                                                <div className="flex items-center gap-2 mb-6 flex-wrap">
                                                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${poc.status === 'Live' || poc.status === 'Published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
                                                        {poc.status}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 flex items-center gap-1" title={poc.updated}>
                                                        <span>• {timeAgo(poc.updated)}</span>
                                                        <span>• by {poc.authorName}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-zinc-400 font-mono mt-auto">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        <Activity className="h-3 w-3" /> {poc.views}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <LogOut className="h-3 w-3" /> {poc.downloads}
                                                    </div>
                                                </div>

                                                <Link
                                                    href={`/poc/${poc.id}`}
                                                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-sans font-medium transition-colors"
                                                >
                                                    <Eye className="h-3 w-3" />
                                                    View
                                                </Link>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add New Placeholder Card */}
                                    <Link href="/poc/new" className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-500 hover:text-blue-400 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all gap-4 group h-full min-h-[200px]">
                                        <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Plus className="h-6 w-6" />
                                        </div>
                                        <span className="font-medium">Create New POC</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* TAB CONTENT: ANALYTICS */}
                        {activeTab === 'analytics' && (
                            <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-12 text-center animate-in fade-in zoom-in duration-500">
                                <div className="mx-auto h-16 w-16 mb-4 rounded-full bg-zinc-900 flex items-center justify-center">
                                    <Activity className="h-8 w-8 text-zinc-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Analytics Engine</h3>
                                <p className="text-zinc-400 max-w-md mx-auto mb-6">
                                    Detailed insights about your POC performance, code quality metrics, and usage trends will appear here.
                                </p>
                                <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-700">
                                    View Sample Report
                                </button>
                            </div>
                        )}

                        {/* TAB CONTENT: SETTINGS */}
                        {activeTab === 'settings' && (
                            <div className="max-w-2xl animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="bg-card/50 border border-white/5 rounded-xl p-8 backdrop-blur-sm space-y-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-1">Profile Information</h3>
                                        <p className="text-sm text-zinc-400">Update your account details and public profile.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Display Name</label>
                                                <input
                                                    type="text"
                                                    defaultValue={user?.displayName || ''}
                                                    placeholder="Enter your name"
                                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Role / Title</label>
                                                <input
                                                    type="text"
                                                    defaultValue="MuleSoft Architect"
                                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Email Address</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    defaultValue={user?.email || ''}
                                                    disabled
                                                    className="w-full bg-zinc-900/30 border border-white/5 rounded-lg px-4 py-2.5 text-zinc-500 cursor-not-allowed"
                                                />
                                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                                            </div>
                                            <p className="text-[10px] text-zinc-600">Email address is managed via your login provider.</p>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 flex items-center justify-end gap-3">
                                        <button className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">Cancel</button>
                                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 transition-all">Save Changes</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.isVisible && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-[0_0_80px_rgba(220,38,38,0.15)] relative overflow-hidden">
                        {/* Subtle top red glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-red-500/20 blur-[60px] pointer-events-none"></div>

                        <div className="flex items-center gap-4 mb-6 relative z-10">
                            <div className="h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                                <AlertCircle className="h-6 w-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Delete Contribution</h3>
                                <p className="text-sm text-zinc-400 mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>

                        <div className="bg-black/40 border border-white/5 rounded-lg p-5 mb-8 relative z-10">
                            <p className="text-zinc-300 text-sm leading-relaxed">
                                Are you sure you want to permanently delete <strong className="text-white font-semibold block mt-1.5 text-base border-l-2 border-red-500 pl-2">{deleteModal.pocTitle}</strong>
                            </p>
                            <p className="text-xs text-zinc-500 mt-3 flex items-center gap-2">
                                <AlertCircle className="h-3 w-3 text-yellow-500" />
                                All files will be removed from the centralized repository.
                            </p>
                        </div>

                        <div className="flex gap-4 justify-end items-center relative z-10">
                            <button
                                onClick={() => setDeleteModal({ isVisible: false, pocId: null, pocTitle: "", isDeleting: false })}
                                disabled={deleteModal.isDeleting}
                                className="px-5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleteModal.isDeleting}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium shadow-lg shadow-red-900/50 hover:shadow-red-900/80 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                            >
                                {deleteModal.isDeleting ? (
                                    <>
                                        <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4 drop-shadow-md" />
                                        Confirm Deletion
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
        </div>
    );
}
