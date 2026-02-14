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
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <section>
                                    <h3 className="text-xl font-semibold mb-4 text-white">Architecture Overview</h3>
                                    <div className="bg-[#18181b] rounded-xl border border-white/5 p-1 h-[300px] relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            {/* Simplified Flow Visualization */}
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 rounded-lg bg-zinc-800 border-zinc-700 border flex items-center justify-center">
                                                        <Globe className="h-6 w-6 text-blue-400" />
                                                    </div>
                                                    <span className="text-xs text-zinc-500">Source</span>
                                                </div>
                                                <div className="w-12 h-0.5 bg-zinc-700"></div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 rounded-lg bg-zinc-800 border-zinc-700 border flex items-center justify-center">
                                                        <Box className="h-6 w-6 text-yellow-400" />
                                                    </div>
                                                    <span className="text-xs text-zinc-500">Process</span>
                                                </div>
                                                <div className="w-12 h-0.5 bg-zinc-700"></div>
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 rounded-lg bg-zinc-800 border-zinc-700 border flex items-center justify-center">
                                                        <Database className="h-6 w-6 text-green-400" />
                                                    </div>
                                                    <span className="text-xs text-zinc-500">Target</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold mb-4 text-white">How it works</h3>
                                    <div className="prose prose-invert max-w-none text-zinc-400">
                                        <p>
                                            This template provides a standard implementation for synchronizing data between two systems.
                                            It is designed to be highly reliable and scalable.
                                        </p>
                                        <ul className="list-disc pl-5 space-y-2 mt-4">
                                            <li><strong>Watermarking:</strong> Automatically tracks the last processed record timestamp to ensure incremental updates.</li>
                                            <li><strong>Batch Processing:</strong> Uses MuleSoft Batch Scope to process records in blocks of 100, optimizing API limits.</li>
                                            <li><strong>Error Handling:</strong> Records that fail to sync are logged to a separate error queue for manual intervention.</li>
                                        </ul>
                                    </div>
                                </section>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-card/50 border border-border rounded-xl p-6">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Prerequisites</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-sm text-foreground">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                            <span>Mule Runtime 4.4.0+</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-foreground">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                            <span>Salesforce Connector 10.13.0</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-sm text-foreground">
                                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                                            <span>SAP Connector 5.5.0</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-card/50 border border-border rounded-xl p-6">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Deployment</h4>
                                    <div className="flex flex-col gap-3">
                                        <button className="w-full py-2 px-4 rounded bg-white text-black font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 text-sm">
                                            <Cloud className="h-4 w-4" />
                                            Deploy to CloudHub
                                        </button>
                                        <button className="w-full py-2 px-4 rounded border border-zinc-700 text-white font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 text-sm">
                                            <Terminal className="h-4 w-4" />
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
