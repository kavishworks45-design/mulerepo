"use client";
import Link from "next/link";
import { ArrowRight, Lock, Database, Globe, Server, Cloud, Zap, Layers } from "lucide-react";
import { useEffect, useState } from "react";

export function Hero() {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setElapsed(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-sm font-medium text-secondary-foreground mb-8 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                        Now Available: MuleSoft POC Repository v1.0
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl max-w-4xl mb-6">
                        MuleSoft POCs, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
                            Ready to Deploy.
                        </span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
                        Stop building from scratch. Access a curated repository of production-grade templates and integrations.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20">
                        <Link href="/browse" className="relative inline-flex items-center justify-center rounded-md bg-white text-black px-8 py-3 text-sm font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-white dark:text-black overflow-hidden group">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                            <span className="relative z-10 flex items-center">
                                Browse POCs
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                        </Link>
                        <a href="#contribute" className="inline-flex items-center justify-center rounded-md border border-input bg-transparent px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                            Contribute
                        </a>
                    </div>

                    {/* New Interactive Visual Representation */}
                    <div
                        className="relative w-full max-w-5xl h-[450px] perspective-[1000px] mt-12"
                        style={{ transform: `translateY(${elapsed * 0.1}px)` }}
                    >
                        {/* Connecting Lines (Behind) */}
                        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-12 z-0 hidden md:block"></div>

                        {/* Card 1: Left - Salesforce Trigger */}
                        <div className="absolute top-20 left-4 md:left-10 w-64 bg-[#0F1115]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-float-medium z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500 hover:border-blue-500/30 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-xl bg-[#00A1E0]/20 flex items-center justify-center text-[#00A1E0] shadow-lg shadow-[#00A1E0]/10 border border-[#00A1E0]/20">
                                    <Cloud className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-1 rounded">
                                    sf-org-main
                                </span>
                            </div>
                            <h3 className="text-zinc-100 font-semibold mb-1">Salesforce Cloud</h3>
                            <p className="text-xs text-zinc-500 mb-4">New Opportunity Trigger</p>

                            <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5 space-y-2">
                                <div className="flex justify-between text-[10px] text-zinc-400">
                                    <span>Type</span>
                                    <span className="text-white">Closed Won</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-zinc-400">
                                    <span>Amount</span>
                                    <span className="text-green-400">$250,000</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Center - Mule Flow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 md:w-96 bg-[#18181b] border border-white/10 rounded-2xl p-0 shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)] animate-float-slow z-20 overflow-hidden hover:border-blue-500/50 transition-colors duration-500">
                            {/* Mac-style Header */}
                            <div className="bg-[#27272a] px-4 py-3 flex items-center border-b border-white/5">
                                <div className="flex gap-2 mr-4">
                                    <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                                </div>
                                <div className="text-xs font-mono text-zinc-400">sync-process.xml</div>
                            </div>

                            {/* Flow Visualization */}
                            <div className="p-6 relative">
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:16px_16px] opacity-50"></div>

                                <div className="relative z-10 flex flex-col gap-4">
                                    {/* Component 1 */}
                                    <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-3 rounded-lg hover:border-blue-500/30 transition-colors">
                                        <div className="h-8 w-8 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20">
                                            <Globe className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-white">HTTP Listener</div>
                                            <div className="text-[10px] text-zinc-500">/api/v1/sync</div>
                                        </div>
                                    </div>

                                    <div className="h-4 border-l-2 border-dashed border-zinc-700 ml-7"></div>

                                    {/* Component 2 */}
                                    <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-3 rounded-lg hover:border-purple-500/30 transition-colors">
                                        <div className="h-8 w-8 rounded bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/20">
                                            <Zap className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-white">DataWeave</div>
                                            <div className="text-[10px] text-zinc-500">Map Objects</div>
                                        </div>
                                    </div>

                                    <div className="h-4 border-l-2 border-dashed border-zinc-700 ml-7"></div>

                                    {/* Component 3 */}
                                    <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 p-3 rounded-lg hover:border-green-500/30 transition-colors">
                                        <div className="h-8 w-8 rounded bg-green-600/20 text-green-400 flex items-center justify-center border border-green-500/20">
                                            <ArrowRight className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-medium text-white">Async Request</div>
                                            <div className="text-[10px] text-zinc-500">To SAP</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Right - SAP Success */}
                        <div className="absolute top-24 right-4 md:right-10 w-64 bg-[#0F1115]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl animate-float-fast z-10 transform rotate-6 hover:rotate-0 transition-transform duration-500 hover:border-green-500/30 group">
                            <div className="flex items-center justify-between mb-4">
                                <div className="h-10 w-10 rounded-xl bg-blue-900/40 flex items-center justify-center text-white border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                    <Database className="h-5 w-5" />
                                </div>
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                            </div>
                            <h3 className="text-zinc-100 font-semibold mb-1">SAP S/4HANA</h3>
                            <p className="text-xs text-zinc-500 mb-4">Order Processor</p>

                            <div className="bg-zinc-900/50 rounded-lg p-3 border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-[10px] text-green-400">
                                    <div className="h-3 w-3 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50">✓</div>
                                    Record Sync Success
                                </div>
                                <div className="bg-black/50 rounded px-2 py-1 font-mono text-[10px] text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                    ID: SAP-882910
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Background Grid */}
            <div
                className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                style={{ transform: `translateY(${elapsed * 0.1}px)` }}
            ></div>

            {/* Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-50 mix-blend-screen"
                    style={{ transform: `translateY(${elapsed * -0.1}px) translateX(-50%)` }}
                ></div>
            </div>
        </section>
    );
}
