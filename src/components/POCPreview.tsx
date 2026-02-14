"use client";
import Link from "next/link";

import { ArrowRight, Box, Code, FileText, GitBranch, Globe, Layers, Star, Terminal, X, Maximize2, Copy, Check } from "lucide-react";
import { useState } from "react";

export function POCPreview() {
    const [activeTab, setActiveTab] = useState("overview");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="py-24 overflow-hidden relative">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Text Content */}
                    <div className="lg:w-1/2 z-10">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                            A Detail-Obsessed <br />
                            <span className="text-blue-500">Repository Interface</span>
                        </h2>
                        <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                            Every POC page is designed for clarity. Get instant access to architectural diagrams,
                            DataWeave scripts, and deployment guides without cloning a single repo.
                        </p>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Interactive Architectural Diagrams",
                                "Copy-Paste DataWeave Snippets",
                                "One-Click CloudHub Deployment",
                                "Versioning & Changelogs"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center text-zinc-300">
                                    <div className="h-6 w-6 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Link href="/browse" className="group inline-flex items-center text-blue-500 font-semibold hover:text-blue-400 transition-colors">
                            Explore a sample POC page
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {/* Interactive Preview Element */}
                    <div className="lg:w-1/2 relative perspective-[2000px]">
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] -z-10"></div>

                        {/* Main Interface Window */}
                        <div className="relative bg-[#0F1115] border border-white/10 rounded-xl shadow-2xl overflow-hidden transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out h-[600px] flex flex-col">

                            {/* Window Header */}
                            <div className="flex items-center px-4 py-3 border-b border-white/5 bg-[#18181b] flex-shrink-0">
                                <div className="flex gap-2 mr-4">
                                    <div className="h-3 w-3 rounded-full bg-red-500/50"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500/50"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-500/50"></div>
                                </div>
                                <div className="flex-1 text-center text-xs font-mono text-zinc-500">
                                    mule-repo.com/poc/sap-salesforce-sync
                                </div>
                            </div>

                            {/* POC Content Preview */}
                            <div className="p-6 flex-1 overflow-auto flex flex-col">

                                {/* POC Header */}
                                <div className="flex justify-between items-start mb-6 flex-shrink-0">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">Integration Pattern</span>
                                            <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 text-xs font-medium">v1.2.0</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-2">SAP Customer Sync</h3>
                                        <p className="text-sm text-zinc-400">Bi-directional synchronization of Customer objects between SAP S/4HANA and Salesforce.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors">
                                            <Star className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors">
                                            <GitBranch className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b border-white/10 mb-6 flex-shrink-0">
                                    <button
                                        onClick={() => setActiveTab("overview")}
                                        className={`px-4 py-2 text-sm border-b-2 transition-colors ${activeTab === 'overview' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("flow")}
                                        className={`px-4 py-2 text-sm border-b-2 transition-colors ${activeTab === 'flow' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        Flow Design
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("dw")}
                                        className={`px-4 py-2 text-sm border-b-2 transition-colors ${activeTab === 'dw' ? 'border-blue-500 text-blue-400 bg-blue-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                                    >
                                        DataWeave
                                    </button>
                                </div>

                                {/* Tab Content */}
                                <div className="flex-1 relative">

                                    {/* OVERVIEW TAB */}
                                    {activeTab === "overview" && (
                                        <div className="grid grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-200">
                                            {/* Left Column - Flow Viz */}
                                            <div className="col-span-2 space-y-4">
                                                <div
                                                    onClick={() => setActiveTab("flow")}
                                                    className="bg-[#18181b] rounded-lg p-4 border border-white/5 cursor-pointer hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 group relative"
                                                >
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Maximize2 className="h-4 w-4 text-zinc-400" />
                                                    </div>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider group-hover:text-blue-400 transition-colors">Flow Architecture</span>
                                                        <Layers className="h-4 w-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    {/* Fake Flow Diagram */}
                                                    <div className="flex items-center justify-between px-2 py-4 relative">
                                                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10 group-hover:bg-blue-900/30 transition-colors"></div>

                                                        <div className="flex flex-col items-center gap-2 bg-[#18181b] z-10 transition-transform group-hover:scale-110 duration-300">
                                                            <div className="h-8 w-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-blue-900/10 transition-colors">
                                                                <Globe className="h-4 w-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                                                            </div>
                                                            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Listener</span>
                                                        </div>

                                                        <div className="flex flex-col items-center gap-2 bg-[#18181b] z-10 transition-transform group-hover:scale-110 duration-300 delay-75">
                                                            <div className="h-8 w-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-blue-900/10 transition-colors">
                                                                <Code className="h-4 w-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                                                            </div>
                                                            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Transform</span>
                                                        </div>

                                                        <div className="flex flex-col items-center gap-2 bg-[#18181b] z-10 transition-transform group-hover:scale-110 duration-300 delay-150">
                                                            <div className="h-8 w-8 rounded bg-blue-900/30 border border-blue-500/30 flex items-center justify-center ring-2 ring-blue-500/20 group-hover:bg-blue-500/20 group-hover:ring-blue-400/30 transition-all">
                                                                <Box className="h-4 w-4 text-blue-400 group-hover:text-blue-300" />
                                                            </div>
                                                            <span className="text-[10px] text-blue-400 font-medium group-hover:text-blue-300">SAP</span>
                                                        </div>

                                                        <div className="flex flex-col items-center gap-2 bg-[#18181b] z-10 transition-transform group-hover:scale-110 duration-300 delay-200">
                                                            <div className="h-8 w-8 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center group-hover:border-blue-500/30 group-hover:bg-blue-900/10 transition-colors">
                                                                <Terminal className="h-4 w-4 text-zinc-400 group-hover:text-blue-400 transition-colors" />
                                                            </div>
                                                            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-400">Log</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Code Snippet */}
                                                <div
                                                    onClick={() => setActiveTab("dw")}
                                                    className="bg-[#18181b] rounded-lg p-4 border border-white/5 font-mono text-xs cursor-pointer hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 group relative"
                                                >
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Maximize2 className="h-4 w-4 text-zinc-400" />
                                                    </div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-zinc-500 group-hover:text-emerald-400 transition-colors">transform.dwl</span>
                                                        <span className="text-emerald-500 group-hover:text-emerald-300">json</span>
                                                    </div>
                                                    <div className="space-y-1 text-zinc-300 group-hover:text-zinc-100 transition-colors">
                                                        <div>%dw 2.0</div>
                                                        <div>output application/json</div>
                                                        <div>---</div>
                                                        <div className="group-hover:translate-x-1 transition-transform">payload map (item) -{">"} &#123;</div>
                                                        <div className="pl-4 text-blue-300 group-hover:text-blue-200 group-hover:translate-x-1 transition-transform delay-75">id: item.SAP_ID,</div>
                                                        <div className="pl-4 text-blue-300 group-hover:text-blue-200 group-hover:translate-x-1 transition-transform delay-100">name: item.CustomerName,</div>
                                                        <div className="pl-4 text-blue-300 group-hover:text-blue-200 group-hover:translate-x-1 transition-transform delay-150">...</div>
                                                        <div className="group-hover:translate-x-1 transition-transform">&#125;</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column - Meta */}
                                            <div className="col-span-1 space-y-4">
                                                <div className="bg-[#18181b] rounded-lg p-4 border border-white/5 space-y-3">
                                                    <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Connectors</div>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                                                        <div className="h-2 w-2 bg-green-500 rounded-full"></div> Salesforce
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                                                        <div className="h-2 w-2 bg-blue-500 rounded-full"></div> SAP S/4
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-300">
                                                        <div className="h-2 w-2 bg-orange-500 rounded-full"></div> Database
                                                    </div>
                                                </div>

                                                <button className="w-full py-2 rounded-lg bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors">
                                                    Download Project
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* FLOW DESIGN TAB */}
                                    {activeTab === "flow" && (
                                        <div className="h-full bg-[#18181b] rounded-lg border border-white/5 p-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center relative overflow-hidden">
                                            {/* Grid background for flow canvas */}
                                            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                                            <div className="relative z-10 flex flex-col gap-8 w-full max-w-lg">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-24 h-24 rounded-xl bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center gap-2 shadow-xl">
                                                        <Globe className="h-8 w-8 text-blue-400" />
                                                        <span className="text-xs text-zinc-400">HTTP</span>
                                                    </div>
                                                    <div className="h-0.5 flex-1 bg-zinc-700 relative">
                                                        <div className="absolute -top-1.5 -right-1 w-3 h-3 border-t-2 border-r-2 border-zinc-700 rotate-45"></div>
                                                    </div>
                                                    <div className="w-24 h-24 rounded-xl bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center gap-2 shadow-xl">
                                                        <Code className="h-8 w-8 text-yellow-400" />
                                                        <span className="text-xs text-zinc-400">Transform</span>
                                                    </div>
                                                    <div className="h-0.5 flex-1 bg-zinc-700 relative">
                                                        <div className="absolute -top-1.5 -right-1 w-3 h-3 border-t-2 border-r-2 border-zinc-700 rotate-45"></div>
                                                    </div>
                                                    <div className="w-24 h-24 rounded-xl bg-blue-900/30 border border-blue-500/50 flex flex-col items-center justify-center gap-2 shadow-xl shadow-blue-500/10">
                                                        <Box className="h-8 w-8 text-blue-400" />
                                                        <span className="text-xs text-blue-200">SAP S/4</span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center">
                                                    <div className="h-8 w-0.5 bg-zinc-700"></div>
                                                </div>

                                                <div className="flex justify-center">
                                                    <div className="w-24 h-24 rounded-xl bg-zinc-800 border border-zinc-700 flex flex-col items-center justify-center gap-2 shadow-xl">
                                                        <Terminal className="h-8 w-8 text-zinc-400" />
                                                        <span className="text-xs text-zinc-400">Logger</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setActiveTab("overview")}
                                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-zinc-400 hover:text-white transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}

                                    {/* DATAWEAVE TAB */}
                                    {activeTab === "dw" && (
                                        <div className="h-full bg-[#1e1e2e] rounded-lg border border-white/5 p-0 animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden text-sm font-mono relative">
                                            <div className="flex items-center justify-between px-4 py-2 bg-[#252535] border-b border-white/5">
                                                <span className="text-zinc-400 text-xs">transform.dwl</span>
                                                <button
                                                    onClick={handleCopy}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-700/50 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors"
                                                >
                                                    {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                                                    {copied ? "Copied" : "Copy"}
                                                </button>
                                            </div>
                                            <div className="p-4 overflow-auto text-blue-100 leading-relaxed">
                                                <div className="text-purple-400">%dw 2.0</div>
                                                <div className="text-purple-400 mb-4">output application/json</div>
                                                <div className="text-zinc-500 mb-4">---</div>
                                                <div><span className="text-blue-400">payload</span> <span className="text-purple-300">map</span> (item, index) <span className="text-zinc-400">-&gt;</span> &#123;</div>
                                                <div className="pl-4"><span className="text-red-300">id</span>: item.SAP_ID,</div>
                                                <div className="pl-4"><span className="text-red-300">fullName</span>: (item.FirstName <span className="text-purple-300">++</span> <span className="text-green-300">" "</span> <span className="text-purple-300">++</span> item.LastName),</div>
                                                <div className="pl-4"><span className="text-red-300">email</span>: item.EmailAddress,</div>
                                                <div className="pl-4"><span className="text-red-300">status</span>: <span className="text-purple-300">if</span> (item.Active == <span className="text-green-300">"X"</span>) <span className="text-green-300">"Active"</span> <span className="text-purple-300">else</span> <span className="text-green-300">"Inactive"</span>,</div>
                                                <div className="pl-4"><span className="text-red-300">address</span>: &#123;</div>
                                                <div className="pl-8"><span className="text-red-300">street</span>: item.Street,</div>
                                                <div className="pl-8"><span className="text-red-300">city</span>: item.City,</div>
                                                <div className="pl-8"><span className="text-red-300">zip</span>: item.PostalCode</div>
                                                <div className="pl-4">&#125;,</div>
                                                <div className="pl-4"><span className="text-red-300">meta</span>: &#123;</div>
                                                <div className="pl-8"><span className="text-red-300">source</span>: <span className="text-green-300">"SAP_S4HANA"</span>,</div>
                                                <div className="pl-8"><span className="text-red-300">timestamp</span>: <span className="text-blue-400">now</span>()</div>
                                                <div className="pl-4">&#125;</div>
                                                <div>&#125;</div>
                                            </div>

                                            <button
                                                onClick={() => setActiveTab("overview")}
                                                className="absolute top-14 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-zinc-400 hover:text-white transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements for depth */}
                        <div className="absolute top-20 -right-10 bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl animate-float-slow hidden lg:block">
                            <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                                <Terminal className="h-3 w-3" />
                                <span>Build Success</span>
                            </div>
                        </div>

                        <div className="absolute bottom-20 -left-10 bg-zinc-900 border border-white/10 p-3 rounded-lg shadow-xl animate-float-medium hidden lg:block">
                            <div className="flex items-center gap-2 text-xs font-medium text-white">
                                <FileText className="h-3 w-3 text-blue-400" />
                                <span>ReadMe.md</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
