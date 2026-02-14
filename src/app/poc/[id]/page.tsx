"use client";

import { use } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { POCS } from "@/data/pocs";
import { ArrowLeft, Box, Code, Copy, Check, Download, GitBranch, Globe, Layers, Star, Terminal, Share2, Calendar, User, Shield, Database, Cloud, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function POCDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const poc = POCS.find((p) => p.id === parseInt(id));
    const [activeTab, setActiveTab] = useState("overview");
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!poc) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-zinc-400 mb-6">POC not found</p>
                    <Link href="/browse" className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2">
                        <ArrowLeft className="h-4 w-4" /> Back to Browse
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="pt-24 pb-16">

                {/* Breadcrumbs & Back */}
                <div className="container px-4 mx-auto mb-8">
                    <Link href="/browse" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Repository
                    </Link>

                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:items-start justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`px-2 py-1 rounded text-xs font-medium border ${poc.difficulty === 'Advanced' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                    poc.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                        'bg-green-500/10 text-green-400 border-green-500/20'
                                    }`}>
                                    {poc.difficulty}
                                </div>
                                <span className="text-xs text-muted-foreground">v{poc.version}</span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">Updated {poc.updated}</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
                                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                                    <poc.icon className="h-8 w-8" />
                                </span>
                                {poc.title}
                            </h1>

                            <p className="text-lg text-muted-foreground max-w-3xl mb-6">
                                {poc.fullDescription}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {poc.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span>{poc.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="h-4 w-4 text-yellow-500/50" />
                                    <span>{poc.stars} Stars</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <GitBranch className="h-4 w-4" />
                                    <span>{poc.forks} Forks</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
                            <button className="flex-1 btn btn-primary flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                <Download className="h-4 w-4" />
                                Download JAR
                            </button>
                            <button className="flex-1 btn btn-secondary flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-zinc-700">
                                <GitBranch className="h-4 w-4" />
                                Fork Repo
                            </button>
                            <button className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-4 py-3 rounded-lg border border-zinc-800 transition-colors">
                                <Share2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-border mb-8 sticky top-16 bg-background/80 backdrop-blur-md z-40">
                    <div className="container px-4 mx-auto overflow-x-auto">
                        <div className="flex space-x-8">
                            {['Overview', 'Flow Design', 'DataWeave', 'Dependencies', 'Changelog'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                                    className={`py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.toLowerCase().replace(' ', '-')
                                        ? 'border-blue-500 text-blue-500'
                                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="container px-4 mx-auto min-h-[500px]">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-white">Live Architecture Monitor</h3>
                                        <div className="flex gap-2">
                                            <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-mono uppercase tracking-wider">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                                System Online
                                            </span>
                                        </div>
                                    </div>

                                    {/* LIVE MONITOR VISUALIZATION */}
                                    <div className="bg-[#09090b] rounded-xl border border-white/10 relative overflow-hidden group shadow-2xl">
                                        {/* Background Grid */}
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent"></div>

                                        <div className="p-8 relative z-10">
                                            {/* Flow Diagram */}
                                            <div className="flex items-center justify-between gap-4 mb-8 relative">
                                                {/* Connecting Line - Background */}
                                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10"></div>

                                                {/* Animated Data Packets */}
                                                <div className="absolute top-1/2 left-0 w-full h-0.5 -z-10 overflow-hidden">
                                                    <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-[pipeline-flow_2s_linear_infinite]"></div>
                                                    <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-[pipeline-flow_2s_linear_infinite_1s]"></div>
                                                </div>

                                                {/* Node 1: Source */}
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="relative group/node">
                                                        <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] z-10 relative">
                                                            <Globe className="h-8 w-8 text-blue-400 group-hover/node:scale-110 transition-transform" />
                                                            {/* Pulse Ring */}
                                                            <div className="absolute inset-0 rounded-2xl border border-blue-500/50 animate-ping opacity-20"></div>
                                                        </div>
                                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500/20 blur-xl rounded-full"></div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs font-bold text-white uppercase tracking-wider">Salesforce</div>
                                                        <div className="text-[10px] text-zinc-500">Source System</div>
                                                    </div>
                                                </div>

                                                {/* Node 2: Process (Mule) */}
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="relative group/node">
                                                        <div className="w-20 h-20 rounded-full bg-[#18181b] border border-purple-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.2)] z-10 relative">
                                                            <Box className="h-10 w-10 text-purple-400 animate-[spin_10s_linear_infinite]" />
                                                        </div>
                                                        {/* Orbiting Particles */}
                                                        <div className="absolute inset-[-10px] border border-white/5 rounded-full animate-[spin_4s_linear_infinite]">
                                                            <div className="absolute top-0 left-1/2 h-1.5 w-1.5 bg-purple-500 rounded-full -translate-x-1/2 shadow-[0_0_10px_purple]"></div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs font-bold text-white uppercase tracking-wider">MuleSoft Core</div>
                                                        <div className="text-[10px] text-zinc-500">Transform & Route</div>
                                                    </div>
                                                </div>

                                                {/* Node 3: Target */}
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="relative group/node">
                                                        <div className="w-16 h-16 rounded-2xl bg-[#18181b] border border-green-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.2)] z-10 relative">
                                                            <Database className="h-8 w-8 text-green-400 group-hover/node:scale-110 transition-transform" />
                                                        </div>
                                                        <div className="absolute -right-2 -top-2 bg-green-500 rounded-full p-1 animate-bounce">
                                                            <Check className="h-3 w-3 text-black" />
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-xs font-bold text-white uppercase tracking-wider">SAP HANA</div>
                                                        <div className="text-[10px] text-zinc-500">Target DB</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Simulated Terminal & Metrics */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="col-span-2 bg-black/50 rounded-lg p-3 font-mono text-[10px] leading-relaxed text-zinc-400 border border-white/5 h-24 overflow-hidden relative">
                                                    <div className="absolute top-2 right-2 flex gap-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/20"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/20"></div>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    </div>
                                                    <div className="animate-[scrollUp_5s_linear_infinite]">
                                                        <span className="text-blue-400">[INFO]</span> Polling Salesforce Object 'Account'...<br />
                                                        <span className="text-blue-400">[INFO]</span> Retrieved 10 records. Watermark updated.<br />
                                                        <span className="text-purple-400">[PROCESS]</span> Payload transformation executing...<br />
                                                        <span className="text-green-400">[SUCCESS]</span> Batch step 1 completed (10/10)<br />
                                                        <span className="text-blue-400">[INFO]</span> Upserting to SAP S/4HANA...<br />
                                                        <span className="text-green-400">[SUCCESS]</span> Flow completed in 124ms.
                                                    </div>
                                                    <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-black to-transparent"></div>
                                                </div>
                                                <div className="col-span-1 space-y-2">
                                                    <div className="bg-zinc-900/50 rounded p-2 border border-white/5">
                                                        <div className="text-[10px] text-zinc-500 uppercase">Latency</div>
                                                        <div className="text-lg font-bold text-white font-mono">124<span className="text-xs text-zinc-500 ml-0.5">ms</span></div>
                                                    </div>
                                                    <div className="bg-zinc-900/50 rounded p-2 border border-white/5">
                                                        <div className="text-[10px] text-zinc-500 uppercase">Success Rate</div>
                                                        <div className="text-lg font-bold text-green-400 font-mono">100<span className="text-xs text-zinc-500 ml-0.5">%</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <style jsx>{`
                                        @keyframes pipeline-flow {
                                            0% { left: 0; opacity: 0; }
                                            10% { opacity: 1; }
                                            90% { opacity: 1; }
                                            100% { left: 100%; opacity: 0; }
                                        }
                                        @keyframes scrollUp {
                                            0% { transform: translateY(0); }
                                            100% { transform: translateY(-50%); }
                                        }
                                    `}</style>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold mb-4 text-white">Logic Breakdown</h3>
                                    <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed">
                                        <p>
                                            This template orchestrates a reliable Oneway Sync pattern. It uses an <strong className="text-white">Idempotent Receiver</strong> to ensure no duplicates are processed, even if the source system fires multiple events.
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 not-prose">
                                            <div className="p-4 rounded-lg bg-zinc-900/40 border border-white/5">
                                                <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                                                    <Database className="h-4 w-4 text-blue-400" /> Watermarking
                                                </h4>
                                                <p className="text-xs text-zinc-400">Automatically tracks the `LastModifiedDate` to fetch only new/updated records.</p>
                                            </div>
                                            <div className="p-4 rounded-lg bg-zinc-900/40 border border-white/5">
                                                <h4 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-green-400" /> Error Handling
                                                </h4>
                                                <p className="text-xs text-zinc-400">Failed records are routed to a DLQ (Dead Letter Queue) for manual retry.</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-card/50 border border-border rounded-xl p-6">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Required Connectors</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center justify-between text-sm text-foreground p-2 rounded hover:bg-white/5 transition-colors">
                                            <span className="flex items-center gap-3"><Cloud className="h-4 w-4 text-blue-400" /> Salesforce</span>
                                            <span className="text-xs font-mono text-zinc-500">v10.13</span>
                                        </li>
                                        <li className="flex items-center justify-between text-sm text-foreground p-2 rounded hover:bg-white/5 transition-colors">
                                            <span className="flex items-center gap-3"><Database className="h-4 w-4 text-indigo-400" /> SAP S/4HANA</span>
                                            <span className="text-xs font-mono text-zinc-500">v5.5.0</span>
                                        </li>
                                        <li className="flex items-center justify-between text-sm text-foreground p-2 rounded hover:bg-white/5 transition-colors">
                                            <span className="flex items-center gap-3"><Shield className="h-4 w-4 text-green-400" /> Secure Props</span>
                                            <span className="text-xs font-mono text-zinc-500">v1.2.5</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-xl p-6">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">Ready to Run?</h4>
                                    <div className="flex flex-col gap-3">
                                        <button className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm">
                                            <Cloud className="h-4 w-4" />
                                            Deploy to CloudHub
                                        </button>
                                        <button className="w-full py-3 px-4 rounded-lg bg-[#18181b] border border-white/10 text-zinc-300 font-medium hover:bg-zinc-800 hover:text-white transition-all flex items-center justify-center gap-2 text-sm group">
                                            <Terminal className="h-4 w-4 group-hover:text-green-400 transition-colors" />
                                            Copy CLI Command
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'dataweave' && (
                        <div className="animate-in fade-in duration-300">
                            <div className="bg-[#1e1e2e] rounded-lg border border-white/5 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 bg-[#252535] border-b border-white/5">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm text-zinc-300 font-mono">transform_payload.dwl</span>
                                    </div>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-zinc-700/50 hover:bg-zinc-700 text-xs text-zinc-300 transition-colors font-medium border border-white/5"
                                    >
                                        {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
                                        {copied ? "Copied" : "Copy"}
                                    </button>
                                </div>
                                <div className="p-6 overflow-auto text-sm font-mono text-blue-100 leading-relaxed">
                                    <pre>
                                        {`%dw 2.0
output application/json
---
payload map (item, index) -> {
    id: item.SAP_ID,
    fullName: (item.FirstName ++ " " ++ item.LastName),
    email: item.EmailAddress,
    status: if (item.Active == "X") "Active" else "Inactive",
    address: {
        street: item.Street,
        city: item.City,
        zip: item.PostalCode,
        country: item.CountryCode
    },
    meta: {
        source: "SAP_S4HANA",
        timestamp: now(),
        correlationId: correlationId
    }
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'flow-design' && (
                        <div className="flex flex-col items-center justify-center py-20 bg-card/50 border border-border rounded-xl text-center animate-in fade-in duration-300">
                            <Layers className="h-16 w-16 text-zinc-700 mb-6" />
                            <h3 className="text-xl font-semibold mb-2">Interactive Flow View</h3>
                            <p className="text-muted-foreground max-w-md mb-8">
                                The interactive flow designer is optimized for desktop. Please download the project to view and edit the full flow in Anypoint Studio.
                            </p>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition-colors font-medium">
                                Download Project Files
                            </button>
                        </div>
                    )}

                    {activeTab === 'dependencies' && (
                        <div className="bg-card/50 border border-border rounded-xl overflow-hidden animate-in fade-in duration-300">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-zinc-900/50 text-muted-foreground font-medium border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4">Dependency Name</th>
                                        <th className="px-6 py-4">Group ID</th>
                                        <th className="px-6 py-4">Version</th>
                                        <th className="px-6 py-4">Scope</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {[
                                        { name: "Mule HTTP Connector", group: "org.mule.connectors", version: "1.7.3", scope: "Compile" },
                                        { name: "Mule Sockets Connector", group: "org.mule.connectors", version: "1.2.2", scope: "Compile" },
                                        { name: "Mule Secure Configuration Property", group: "com.mulesoft.modules", version: "1.2.5", scope: "Compile" },
                                        { name: "Mule Validation Module", group: "org.mule.modules", version: "2.0.1", scope: "Test" }
                                    ].map((dep, i) => (
                                        <tr key={i} className="hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">{dep.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{dep.group}</td>
                                            <td className="px-6 py-4 text-blue-400 font-mono">{dep.version}</td>
                                            <td className="px-6 py-4 text-muted-foreground">{dep.scope}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'changelog' && (
                        <div className="space-y-8 max-w-3xl mx-auto animate-in fade-in duration-300 py-8">
                            {[
                                { version: "1.2.0", date: "Oct 24, 2024", changes: ["Added Watermarking logic for incremental sync", "Updated Salesforce Connector to v10.15"] },
                                { version: "1.1.0", date: "Sep 12, 2024", changes: ["Fixed bug in Batch Aggregator size", "Added centralized error logging"] },
                                { version: "1.0.0", date: "Aug 01, 2024", changes: ["Initial Release", "Basic sync functionality"] }
                            ].map((release, i) => (
                                <div key={i} className="relative pl-8 border-l border-zinc-800 pb-8 last:pb-0">
                                    <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-blue-500 ring-4 ring-background"></div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-lg font-semibold text-foreground">v{release.version}</h3>
                                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-white/5">{release.date}</span>
                                    </div>
                                    <ul className="list-disc pl-4 text-muted-foreground space-y-1 text-sm">
                                        {release.changes.map((change, j) => (
                                            <li key={j}>{change}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </main>

            <Footer />
        </div>
    );
}
