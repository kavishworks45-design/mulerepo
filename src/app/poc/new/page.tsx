"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ArrowLeft, Box, Check, Cloud, Code, Database, Globe, Layers, Save, Server, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPOCPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [toast, setToast] = useState<{ show: boolean, message: string, type: ToastType }>({
        show: false,
        message: "",
        type: "success"
    });

    // Helper to show toast
    const showToast = (message: string, type: ToastType = "success") => {
        setToast({ show: true, message, type });
    };

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        difficulty: "Intermediate",
        tags: "",
        sourceSystem: "Salesforce",
        targetSystem: "Database",
        dwCode: ""
    });

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            return formData.title.trim() !== "" && formData.description.trim() !== "";
        }
        if (currentStep === 2) {
            return formData.sourceSystem.trim() !== "" && formData.targetSystem.trim() !== "";
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        } else {
            showToast("Please fill in all required fields locally.", "warning");
        }
    };

    const handleBack = () => setStep(step - 1);

    const savePOC = async (status: 'Draft' | 'Live') => {
        // Create the new POC object
        const newPOC = {
            id: Date.now(), // Generate unique ID
            title: formData.title,
            description: formData.description,
            // Add a short description based on the full description
            status: status,
            views: 0,
            downloads: 0,
            updated: "Just now",
            health: 100,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            difficulty: formData.difficulty,
            icon: "Box", // Default string identifier for icon, handled in dashboard
            details: {
                architecture: {
                    source: { name: formData.sourceSystem, type: "Source System", color: "blue" },
                    process: { name: "MuleSoft", type: "Process", color: "purple" },
                    target: { name: formData.targetSystem, type: "Target System", color: "green" }
                }
            }
        };

        // Save to localStorage
        try {
            const existingPocs = JSON.parse(localStorage.getItem('user_pocs') || '[]');
            localStorage.setItem('user_pocs', JSON.stringify([newPOC, ...existingPocs]));

            showToast(status === 'Live' ? "POC Published Successfully!" : "POC Saved as Draft", "success");

            // Simulate network delay then redirect
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/dashboard');
        } catch (err) {
            console.error("Failed to save POC:", err);
            showToast("Failed to save POC. Please try again.", "error");
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background">
            <Header />

            <main className="pt-24 pb-16 min-h-screen">
                <div className="container px-4 mx-auto max-w-3xl">

                    <Link href="/dashboard" className="inline-flex items-center text-sm text-zinc-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Create New POC</h1>
                        <p className="text-zinc-400">Share your integration pattern with the community.</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-12 relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-800 -z-10"></div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 1 ? 'text-blue-400' : 'text-zinc-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= 1 ? 'bg-black border-blue-500' : 'bg-black border-zinc-700'}`}>1</div>
                            <span className="text-xs font-medium bg-background px-2">Basics</span>
                        </div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-blue-400' : 'text-zinc-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= 2 ? 'bg-black border-blue-500' : 'bg-black border-zinc-700'}`}>2</div>
                            <span className="text-xs font-medium bg-background px-2">Architecture</span>
                        </div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-blue-400' : 'text-zinc-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= 3 ? 'bg-black border-blue-500' : 'bg-black border-zinc-700'}`}>3</div>
                            <span className="text-xs font-medium bg-background px-2">Code</span>
                        </div>
                    </div>

                    <div className="bg-card/50 border border-white/5 rounded-xl p-8 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">POC Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g., Salesforce to SAP Customer Sync"
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Description</label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Briefly describe what this integration pattern solves..."
                                        className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 resize-none"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Difficulty Level</label>
                                        <select
                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                                            value={formData.difficulty}
                                            onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                        >
                                            <option>Beginner</option>
                                            <option>Intermediate</option>
                                            <option>Advanced</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Tags (comma separated)</label>
                                        <input
                                            type="text"
                                            placeholder="Batch, API, Scatter-Gather"
                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8">
                                <div className="bg-blue-900/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-4">
                                    <Sparkles className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-400 mb-1">Architecture Viz Preview</h4>
                                        <p className="text-xs text-zinc-400">We'll automatically generate an interactive architecture diagram based on these inputs.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                                    {/* Arrow connecting columns */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:block hidden text-zinc-600">
                                        <Layers className="h-6 w-6" />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Globe className="h-4 w-4 text-zinc-400" />
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Source System</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-500">System Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Salesforce"
                                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                value={formData.sourceSystem}
                                                onChange={e => setFormData({ ...formData, sourceSystem: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-500">System Type</label>
                                            <select className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                                                <option>CRM</option>
                                                <option>ERP</option>
                                                <option>Database</option>
                                                <option>API</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Database className="h-4 w-4 text-zinc-400" />
                                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Target System</h3>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-500">System Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Postgres DB"
                                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                                value={formData.targetSystem}
                                                onChange={e => setFormData({ ...formData, targetSystem: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium text-zinc-500">System Type</label>
                                            <select className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                                                <option>Database</option>
                                                <option>StartAPI</option>
                                                <option>Queue</option>
                                                <option>Warehouse</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-zinc-300">DataWeave Payload Transformation</label>
                                        <span className="text-xs text-zinc-500">Optional</span>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute top-3 right-3 text-xs font-mono text-zinc-500">dw 2.0</div>
                                        <textarea
                                            rows={12}
                                            placeholder="%dw 2.0&#10;output application/json&#10;---&#10;payload map (item) -> {&#10;    id: item.Id&#10;}"
                                            className="w-full bg-[#1e1e2e] border border-white/10 rounded-lg p-4 text-blue-100 font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 resize-none leading-relaxed"
                                            value={formData.dwCode}
                                            onChange={e => setFormData({ ...formData, dwCode: e.target.value })}
                                        />
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        Paste your main transformation logic here. This will be beautifully highlighted on the POC page.
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-8 mt-8 border-t border-white/5">
                            {step > 1 ? (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Back
                                </button>
                            ) : (
                                <div></div>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                                >
                                    Next Step
                                </button>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => savePOC('Draft')}
                                        className="px-6 py-2.5 border border-zinc-700 hover:bg-zinc-800 text-zinc-400 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Save as Draft
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => savePOC('Live')}
                                        className="px-8 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-green-500/20 flex items-center gap-2"
                                    >
                                        <Save className="h-4 w-4" />
                                        Publish POC
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast(prev => ({ ...prev, show: false }))}
            />
        </div>
    );
}
