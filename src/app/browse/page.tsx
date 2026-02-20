"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, GitFork, Star, ArrowRight, ChevronDown, Box, Code, Cloud, Server, Database, Layers, Shield, Activity, Users, Mail, Folder, Smartphone, GitMerge, Lock, Zap, FileCode } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { POCS } from "@/data/pocs";
import { getAllPOCs } from "@/lib/pocs";

const ICON_MAP: Record<string, any> = {
    Box, Code, Cloud, Server, Database, Layers, Shield, Activity, Users, Mail, Folder, Smartphone, GitMerge, Lock, Zap, FileCode
};

export default function BrowsePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [sortBy, setSortBy] = useState("newest");
    const [allPOCs, setAllPOCs] = useState(POCS);

    useEffect(() => {
        const fetchRemote = async () => {
            try {
                const res = await fetch("/api/pocs/list");
                const remote = await res.json();

                // Keep icon mapping
                const mappedRemote = remote.map((p: any) => ({
                    ...p,
                    icon: ICON_MAP[p.icon as string] || Box
                }));

                const combined = [...mappedRemote, ...POCS].filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
                setAllPOCs(combined);
            } catch (e) {
                console.error("Failed to fetch remote POCs", e);
            }
        };
        fetchRemote();
    }, []);

    const filteredPOCs = allPOCs.filter(poc => {
        const matchesSearch = poc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            poc.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTag = selectedTag === "All" || poc.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
    }).sort((a, b) => {
        if (sortBy === "stars") return b.stars - a.stars;
        if (sortBy === "forks") return b.forks - a.forks;
        if (sortBy === "newest") {
            // Primitive sort based on string parsing for now, ideally use timestamps
            const getDays = (str: string | undefined) => {
                if (!str) return 999;
                if (str === "Just now") return 0;
                if (str.includes("day")) return parseInt(str) || 1;
                if (str.includes("week")) return (parseInt(str) || 1) * 7;
                if (str.includes("month")) return (parseInt(str) || 1) * 30;
                return 999;
            };
            return getDays(a.updated) - getDays(b.updated);
        }
        return 0;
    });

    const allTags = ["All", ...Array.from(new Set(allPOCs.flatMap(p => p.tags)))];

    return (
        <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background">
            <Header />

            <main className="pt-24 pb-16 min-h-[calc(100vh-theme(spacing.16))]">
                <div className="container px-4 mx-auto">

                    {/* Page Header */}
                    <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 w-fit">
                            Browse Repository
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl">
                            Explore hundreds of production-ready MuleSoft Proofs of Concept, templates, and integration patterns.
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col gap-6 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">

                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">

                            {/* Search Bar */}
                            <div className="relative w-full sm:max-w-md group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-blue-400 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by connector, pattern, or use case..."
                                    className="w-full h-10 pl-10 pr-12 rounded-md border border-white/10 bg-zinc-900/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-500 text-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-white/5 hover:bg-white/10 rounded items-center justify-center flex transition-colors">
                                    <ArrowRight className="h-4 w-4 text-zinc-400" />
                                </button>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative min-w-[180px] w-full sm:w-auto">
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full h-10 pl-4 pr-10 rounded-md border border-white/10 bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer text-sm font-medium text-white [&>option]:bg-zinc-900 [&>option]:text-white"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="stars">Most Stars</option>
                                    <option value="forks">Most Forks</option>
                                </select>
                            </div>

                        </div>

                        {/* Tags Filter - Full Width Ribbon */}
                        <div className="w-full border-t border-white/5 pt-6">
                            <div className="flex gap-2 overflow-x-auto pb-2 w-full no-scrollbar mask-gradient items-center">
                                <span className="text-sm text-zinc-500 mr-2 flex-shrink-0 font-medium uppercase tracking-wider text-[10px]">Filter by:</span>
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-4 py-2 rounded-full text-xs font-medium border transition-all whitespace-nowrap flex-shrink-0 ${selectedTag === tag
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25"
                                            : "bg-zinc-900 border-white/10 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-white/20"
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {filteredPOCs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPOCs.map((poc, index) => (
                                <div
                                    key={poc.id}
                                    className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                                >

                                    <div className="flex items-start justify-between mb-4">
                                        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-blue-500/10">
                                            <poc.icon className="h-5 w-5" />
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] font-medium border ${poc.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                            poc.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                'bg-green-500/10 text-green-400 border-green-500/20'
                                            }`}>
                                            {poc.difficulty}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                                        <Link href={`/poc/${poc.id}`} className="focus:outline-none">
                                            <span className="absolute inset-0" aria-hidden="true" />
                                            {poc.title}
                                        </Link>
                                    </h3>

                                    <p className="text-muted-foreground text-sm mb-6 flex-1 text-balance">
                                        {poc.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6 pointer-events-none relative z-10">
                                        {poc.tags.slice(0, 3).map(tag => (
                                            <span key={tag} className="px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground border border-white/5">
                                                {tag}
                                            </span>
                                        ))}
                                        {poc.tags.length > 3 && (
                                            <span className="px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground border border-white/5">
                                                +{poc.tags.length - 3}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs text-muted-foreground mt-auto">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                                                <Star className="h-3 w-3" /> {poc.stars}
                                            </span>
                                            <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                                                <GitFork className="h-3 w-3" /> {poc.forks}
                                            </span>
                                        </div>
                                        <span className="flex items-center gap-1 hover:text-foreground transition-colors group-hover:translate-x-1 duration-300">
                                            {poc.updated}
                                            <ArrowRight className="h-3 w-3 ml-1" />
                                        </span>
                                    </div>

                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center animate-in fade-in zoom-in-95 duration-500">
                            <div className="bg-zinc-900 rounded-full p-6 mb-4 border border-zinc-800">
                                <Search className="h-8 w-8 text-zinc-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No results found</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                We couldn't find any POCs matching your search query or selected filters.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(""); setSelectedTag("All"); }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-medium transition-colors"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}
