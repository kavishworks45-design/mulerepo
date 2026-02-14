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
                        className="relative w-full max-w-5xl h-[400px] perspective-[1000px]"
                        style={{ transform: `translateY(${elapsed * 0.2}px)` }}
                    >
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/20 rounded-full blur-[100px] -z-10"></div>

                        {/* Card 1: Left - SAP to Salesforce */}
                        <div className="absolute top-10 left-4 md:left-20 w-64 md:w-72 bg-card/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl animate-float-medium z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                                <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                                    <Cloud className="h-5 w-5" />
                                </div>
                                <div className="h-4 w-4 text-muted-foreground">↔</div>
                                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-500">
                                    <Database className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-foreground">SAP ↔ Salesforce</div>
                                    <div className="text-xs text-muted-foreground">Sync Pattern</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-3/4 bg-border/50 rounded"></div>
                                <div className="h-2 w-1/2 bg-border/50 rounded"></div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full">Batch</span>
                                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-full">Reliable</span>
                            </div>
                        </div>

                        {/* Card 2: Center - API Led */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 md:w-80 bg-card border border-white/10 rounded-xl p-5 shadow-2xl animate-float-slow z-20">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    {/* Mulesoft Flow visual dots */}
                                    <div className="h-2 w-2 rounded-full bg-red-500"></div>
                                    <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                </div>
                                <span className="text-xs font-mono text-muted-foreground">api-led-v1.xml</span>
                            </div>
                            <div className="space-y-3 font-mono text-xs">
                                <div className="flex gap-2">
                                    <span className="text-purple-400">flow</span>
                                    <span className="text-yellow-400">"process-order"</span>
                                </div>
                                <div className="pl-4 border-l border-white/10">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Globe className="h-3 w-3 text-green-400" />
                                        <span>HTTP Listener</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground mt-2">
                                        <Lock className="h-3 w-3 text-orange-400" />
                                        <span>Validate Headers</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-blue-400 mt-2">
                                        <Zap className="h-3 w-3" />
                                        <span>Transform Message</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-xs text-muted-foreground">Status</span>
                                    <span className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                        Deployed
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Right - Database & Security */}
                        <div className="absolute top-16 right-4 md:right-20 w-64 md:w-72 bg-card/80 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-2xl animate-float-fast z-10 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                    <Database className="h-4 w-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-foreground">Secure DB</div>
                                    <div className="text-xs text-muted-foreground">Postgres Connector</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Encryption</span>
                                    <span className="text-green-400">Enabled</span>
                                </div>
                                <div className="h-1.5 w-full bg-border/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[95%]"></div>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded-full">High Availability</span>
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
