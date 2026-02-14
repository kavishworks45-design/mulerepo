"use client";

import Link from "next/link";
import { ArrowLeft, Github, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login delay
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-background to-background -z-10"></div>
            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
                    <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="font-bold text-white text-xl">M</span>
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">MuleRepo</span>
                </Link>

                <div className="bg-card/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-muted-foreground text-sm">Sign in to access your contributor dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <input
                                    type="email"
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="architect@mulesoft.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider pl-1">Password</label>
                                <Link href="#" className="text-xs text-blue-400 hover:text-blue-300">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                                <input
                                    type="password"
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-white/5"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#0F1115] px-2 text-zinc-500">Or continue with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white py-2.5 rounded-lg transition-colors font-medium text-sm">
                            <Github className="h-4 w-4" />
                            GitHub
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white py-2.5 rounded-lg transition-colors font-medium text-sm">
                            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="h-4 w-4 grayscale opacity-80" />
                            Google
                        </button>
                    </div>
                </div>

                <p className="text-center mt-8 text-sm text-zinc-500">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
                        Apply for access
                    </Link>
                </p>

                <div className="mt-8 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft className="h-3 w-3" />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
