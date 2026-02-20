"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toast, ToastType } from "@/components/ui/Toast";
import { ArrowLeft, Box, Check, Cloud, Code, Database, Globe, Layers, Save, Server, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { savePOC as savePOCToFirestore } from "@/lib/pocs";
import { useAuth } from "@/context/AuthContext";

export default function NewPOCPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ show: boolean, message: string, type: ToastType }>({
        show: false,
        message: "",
        type: "success"
    });

    // Helper to show toast
    const showToast = (message: string, type: ToastType = "success") => {
        setToast({ show: true, message, type });
    };

    const [isDragging, setIsDragging] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Uploading...");

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            const messages = [
                "Uploading project archive...",
                "Unpacking Mule project...",
                "Scanning XML configurations...",
                "Running AI Architecture Analysis...",
                "Extracting DataWeave patterns...",
                "Committing to Central Repository...",
                "Finalizing..."
            ];
            let i = 0;
            setLoadingMessage(messages[0]);
            interval = setInterval(() => {
                i = (i + 1) % messages.length;
                setLoadingMessage(messages[i]);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        difficulty: string;
        tags: string;
        sourceSystem: string;
        targetSystem: string;
        zipFile?: File;
        pomFile?: File; // Added optional POM file
    }>({
        title: "",
        description: "",
        difficulty: "Intermediate",
        tags: "",
        sourceSystem: "Salesforce",
        targetSystem: "Database",
    });

    const validateStep = (currentStep: number) => {
        if (currentStep === 1) {
            if (!formData.zipFile) {
                showToast("Please upload a Mule Project (.zip) first.", "warning");
                return false;
            }
        }
        if (currentStep === 2) {
            if (formData.title.trim() === "") {
                showToast("Please provide a project title.", "warning");
                return false;
            }
        }
        return true;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handleBack = () => setStep(step - 1);

    const handleFile = (file: File) => {
        if (!file.name.endsWith('.zip')) {
            showToast("Please upload a .zip file exported from Studio.", "error");
            return;
        }
        showToast(`Project ${file.name} ready to upload`, "success");
        setFormData(prev => ({
            ...prev,
            zipFile: file, // Store the file itself
            title: prev.title || file.name.replace('.zip', '').replace(/[-_]/g, ' '), // Only update title if not already set
            description: prev.description || ""
        }));
    };

    const savePOC = async (status: 'Draft' | 'Live') => {
        if (!formData.zipFile) {
            showToast("Project zip file is missing.", "error");
            return;
        }

        if (!formData.title || !formData.description) {
            showToast("Title and Description are required.", "error");
            return;
        }

        setIsLoading(true);

        try {
            const data = new FormData();
            data.append("file", formData.zipFile);
            data.append("title", formData.title);
            data.append("description", formData.description);
            // Append optional pom file if provided
            if (formData.pomFile) {
                data.append("pomFile", formData.pomFile);
            }
            if (user) {
                data.append("authorId", user.uid);
                data.append("authorName", user.displayName || "Anonymous");
            }

            showToast("Analyzing project and pushing to repository...", "info");

            const response = await fetch("/api/pocs/create", {
                method: "POST",
                body: data,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to create POC");
            }

            const ai = result.aiAnalysis; // Get the AI result
            const shortDesc = ai?.description?.split('.')[0] + '.' || formData.description || "No description provided.";

            // Create a local representation for the dashboard
            const newPOC = {
                id: Date.now(), // Use unique timestamp ID to properly separate POCs in the same monorepo
                title: formData.title,
                description: shortDesc,
                fullDescription: ai?.description || formData.description || `Hosted at ${result.repoUrl}`,
                status: "Active",
                views: 0,
                downloads: 0,
                updated: "Just now",
                health: 100,
                tags: ai?.tags || (formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : ["Repository", "Mule Source"]),
                difficulty: ai?.difficulty || formData.difficulty,
                icon: "Code",
                repoUrl: result.repoUrl,
                stars: 0,
                forks: 0,
                // Use AI Architecture & Logic if available, else fallback to manual
                details: ai ? {
                    architecture: ai.architecture,
                    logicBreakdown: ai.logicBreakdown,
                    dependencies: ai.dependencies,
                    changelog: []
                } : {
                    architecture: {
                        source: { name: formData.sourceSystem, type: "Source", icon: "Cloud", color: "blue" },
                        process: { name: "Mule App", type: "Process", icon: "Box", color: "purple" },
                        target: { name: formData.targetSystem, type: "Target", icon: "Database", color: "green" }
                    },
                    logicBreakdown: { cards: [] },
                    dependencies: []
                }
            };

            // Save metadata to Firestore - REMOVED (Moved to GitHub-only architecture)
            // The metadata is now saved inside 'pocs.json' in the repo via the API.

            showToast("POC Created & Finalized Successfully!", "success");

            // Redirect to the newly created POC Details page after a short delay
            setTimeout(() => {
                router.push(`/poc/${result.id}`);
            }, 1000);

        } catch (error: any) {
            console.error("Upload failed:", error);
            const msg = error.message.includes("other side closed") || error.message.includes("fetch")
                ? "Network upload failed. Please try a smaller file or check your connection."
                : (error.message || "Failed to create POC");
            showToast(msg, "error");
        } finally {
            setIsLoading(false);
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
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= 1 ? 'bg-black border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-black border-zinc-700'}`}>1</div>
                            <span className="text-xs font-medium bg-background px-2">Project Upload</span>
                        </div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 2 ? 'text-blue-400' : 'text-zinc-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= 2 ? 'bg-black border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-black border-zinc-700'}`}>2</div>
                            <span className="text-xs font-medium bg-background px-2">Configuration</span>
                        </div>
                        <div className={`flex flex-col items-center gap-2 ${step >= 3 ? 'text-blue-400' : 'text-zinc-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 ${step >= 3 ? 'bg-black border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-black border-zinc-700'}`}>3</div>
                            <span className="text-xs font-medium bg-background px-2">Documentation</span>
                        </div>
                    </div>

                    <div className="bg-card/50 border border-white/5 rounded-xl p-8 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Step 1: Upload Source Code</h3>
                                    <p className="text-zinc-400 text-sm">Upload your Mule project archive. We'll automatically securely process and extract the structure.</p>
                                </div>
                                {/* DRAG AND DROP UPLOAD SECTION */}
                                <div
                                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group relative overflow-hidden ${isDragging ? 'border-blue-500 bg-blue-500/10' : formData.zipFile ? 'border-green-500/50 bg-green-500/5' : 'border-zinc-700 bg-zinc-900/30 hover:border-blue-500/50 hover:bg-black/40'}`}
                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                    onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setIsDragging(false);
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            handleFile(e.dataTransfer.files[0]);
                                        }
                                    }}
                                    onClick={() => document.getElementById('zip-upload-input')?.click()}
                                >
                                    {isDragging && <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm z-0"></div>}

                                    <div className={`relative z-10 h-16 w-16 rounded-full flex items-center justify-center mb-4 transition-transform ${formData.zipFile ? 'bg-green-500/20 text-green-400 group-hover:scale-110' : 'bg-zinc-800 text-zinc-400 group-hover:scale-110 group-hover:text-blue-400'}`}>
                                        {formData.zipFile ? <Check className="h-8 w-8" /> : <Cloud className="h-8 w-8" />}
                                    </div>
                                    <h3 className="relative z-10 text-lg font-bold text-white mb-2">
                                        {formData.zipFile ? formData.zipFile.name : "Upload Mule Project (Source Zip)"}
                                    </h3>
                                    <p className="relative z-10 text-sm text-zinc-400 max-w-sm mb-6">
                                        {formData.zipFile
                                            ? `${(formData.zipFile.size / 1024 / 1024).toFixed(2)} MB - Ready to process`
                                            : <span>Export your project from Anypoint Studio as a <code className="bg-zinc-800 px-1 py-0.5 rounded text-zinc-300">.zip</code> or drag and drop it here.</span>}
                                    </p>
                                    <button
                                        type="button"
                                        className={`relative z-10 px-6 py-2.5 text-sm font-medium rounded-lg transition-colors ${formData.zipFile ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-zinc-800 hover:bg-zinc-700 text-white'}`}
                                        onClick={(e) => { e.stopPropagation(); document.getElementById('zip-upload-input')?.click(); }}
                                    >
                                        {formData.zipFile ? "Change File" : "Select Project Zip"}
                                    </button>
                                    <input
                                        id="zip-upload-input"
                                        type="file"
                                        accept=".zip"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                handleFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </div>

                                <div className="pt-6 border-t border-white/5 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        disabled={!formData.zipFile}
                                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next: Configuration
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Step 2: Configuration & Details</h3>
                                    <p className="text-zinc-400 text-sm">Review your project's title and dependencies.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Project Title</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g., Salesforce to SAP Customer Sync"
                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>

                                    {/* Optional POM Upload */}
                                    <div className="space-y-2 mt-6">
                                        <label className="text-sm font-medium text-zinc-300">Override POM File (Optional)</label>
                                        <p className="text-xs text-zinc-500">If your project requires a specific <code className="text-zinc-400">pom.xml</code> that wasn't included in the archive, you can upload it here.</p>

                                        <div className="flex items-center gap-4 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('pom-upload-input')?.click()}
                                                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/5 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                            >
                                                <Code className="h-4 w-4 text-zinc-400" />
                                                {formData.pomFile ? "Change POM" : "Upload pom.xml"}
                                            </button>
                                            {formData.pomFile && (
                                                <div className="flex items-center gap-2 text-sm text-green-400 font-medium">
                                                    <Check className="h-4 w-4" />
                                                    {formData.pomFile.name} added
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            id="pom-upload-input"
                                            type="file"
                                            accept=".xml"
                                            className="hidden"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    if (!file.name.endsWith('.xml')) {
                                                        showToast("Please upload an XML file.", "error");
                                                        return;
                                                    }
                                                    setFormData(prev => ({ ...prev, pomFile: file }));
                                                    showToast("POM file attached.", "success");
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-6 py-2.5 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Next: Documentation
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Step 3: Documentation</h3>
                                    <p className="text-zinc-400 text-sm">Tell the community about your integration pattern. Our AI will handle extracting the architectural details.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Project Description</label>
                                        <textarea
                                            required
                                            rows={4}
                                            placeholder="Explain what this POC does, patterns used, and the target use case..."
                                            className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-zinc-600 resize-none"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-300">Difficulty Level</label>
                                            <select
                                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none"
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
                                                placeholder="e.g., Salesforce, SAP, Batch"
                                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                                                value={formData.tags}
                                                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-center">
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        disabled={isLoading}
                                        className="px-6 py-2.5 text-zinc-400 hover:text-white transition-colors text-sm font-medium disabled:opacity-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => savePOC('Live')}
                                        disabled={isLoading}
                                        className={`px-8 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span className="min-w-[180px] text-left">{loadingMessage}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Cloud className="h-4 w-4" />
                                                Finish & Publish Repository
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
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
