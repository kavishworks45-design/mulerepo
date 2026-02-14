"use client";
import React, { useEffect, useState } from "react";
import { Search, Download, Play, GitBranch, Cloud, CheckCircle2, ArrowRight } from "lucide-react";

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden bg-black/40">
            {/* Background Gradients */}
            <div className="absolute inset-0 bg-blue-500/5 blur-[100px] -z-10"></div>

            <div className="container px-4 mx-auto relative z-10">
                <div className="mx-auto max-w-2xl text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl mb-6">
                        From Concept to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Production</span>
                    </h2>
                    <p className="mt-4 text-lg text-zinc-400">
                        A seamless workflow designed for modern integration teams.
                    </p>
                </div>

                <div className="relative max-w-6xl mx-auto">
                    {/* Animated Connection Pipeline (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-zinc-800 -z-10">
                        {/* Flowing Data Packet */}
                        <div className="absolute top-1/2 left-0 h-1 w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent -translate-y-1/2 animate-[pipeline-flow_3s_linear_infinite] shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                        <div className="absolute top-1/2 left-0 h-1 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent -translate-y-1/2 animate-[pipeline-flow_3s_linear_infinite_1.5s] shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10">

                        {/* Step 1: Discover */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="flex flex-col items-center text-center">
                                {/* Icon Bubble */}
                                <div className="relative h-24 w-24 rounded-2xl bg-[#09090b] border border-white/10 flex items-center justify-center mb-8 shadow-xl group-hover:border-blue-500/50 group-hover:-translate-y-2 transition-all duration-300">
                                    <div className="absolute inset-0 bg-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <Search className="h-10 w-10 text-zinc-400 group-hover:text-blue-400 transition-colors" />

                                    {/* Step Number Badge */}
                                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-500 group-hover:text-white group-hover:border-blue-500/50 transition-colors">
                                        01
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">Find Your Pattern</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    Search by connector (Salesforce, SAP) or use case. Our smart filters find the exact architectural pattern you need.
                                </p>
                            </div>
                        </div>

                        {/* Step 2: Implement */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-blue-500/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="flex flex-col items-center text-center">
                                {/* Icon Bubble */}
                                <div className="relative h-24 w-24 rounded-2xl bg-[#09090b] border border-white/10 flex items-center justify-center mb-8 shadow-xl group-hover:border-cyan-500/50 group-hover:-translate-y-2 transition-all duration-300">
                                    <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <GitBranch className="h-10 w-10 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 pointer-events-none">
                                        <div className="absolute w-full h-full border border-cyan-500/30 rounded-2xl animate-ping"></div>
                                    </div>

                                    {/* Step Number Badge */}
                                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-500 group-hover:text-white group-hover:border-cyan-500/50 transition-colors">
                                        02
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">Clone & Configure</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    Download the Anypoint Studio project. All global configs and error handling strategies are pre-wired.
                                </p>
                            </div>
                        </div>

                        {/* Step 3: Deploy */}
                        <div className="group relative">
                            <div className="absolute inset-0 bg-green-500/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="flex flex-col items-center text-center">
                                {/* Icon Bubble */}
                                <div className="relative h-24 w-24 rounded-2xl bg-[#09090b] border border-white/10 flex items-center justify-center mb-8 shadow-xl group-hover:border-green-500/50 group-hover:-translate-y-2 transition-all duration-300">
                                    <div className="absolute inset-0 bg-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <Cloud className="h-10 w-10 text-zinc-400 group-hover:text-green-400 transition-colors" />

                                    {/* Success Indicator on Hover */}
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                                        <CheckCircle2 className="h-4 w-4 text-black" />
                                    </div>

                                    {/* Step Number Badge */}
                                    <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-bold text-zinc-500 group-hover:text-white group-hover:border-green-500/50 transition-colors">
                                        03
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">Deploy to CloudHub</h3>
                                <p className="text-zinc-400 leading-relaxed text-sm">
                                    Push directly to your environment. Our templates are production-ready with standard logging included.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Add Pipeline Animation Style */}
                    <style jsx>{`
                        @keyframes pipeline-flow {
                            0% { left: 0; opacity: 0; }
                            10% { opacity: 1; }
                            90% { opacity: 1; }
                            100% { left: 100%; opacity: 0; }
                        }
                    `}</style>
                </div>
            </div>
        </section>
    );
}
