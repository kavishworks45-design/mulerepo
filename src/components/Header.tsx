"use client";

import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <div className="container flex h-16 items-center justify-between px-4 mx-auto">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                        <span className="font-bold text-white">M</span>
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">MuleRepo</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <Link href="/#features" className="hover:text-white transition-colors">
                        Features
                    </Link>
                    <Link href="/browse" className="hover:text-white transition-colors text-blue-400">
                        Browse POCs
                    </Link>
                    <Link href="/#how-it-works" className="hover:text-white transition-colors">
                        How it Works
                    </Link>
                </nav>

                <div className="flex items-center gap-4">


                    {user ? (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-2 group">
                                <div className="h-8 w-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center overflow-hidden">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="User" className="h-full w-full object-cover" />
                                    ) : (
                                        <span className="text-xs font-bold text-blue-400">
                                            {user.email?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    )}
                                </div>
                                <div className="hidden lg:flex flex-col">
                                    <span className="text-xs font-medium text-white group-hover:text-blue-400 transition-colors">
                                        Welcome, {user.displayName ? user.displayName.split(' ')[0] : "Architect"}
                                    </span>
                                    <span className="text-[10px] text-zinc-500 max-w-[100px] truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </Link>

                            <button
                                onClick={() => logout()}
                                className="h-9 w-9 sm:w-auto sm:px-4 flex items-center justify-center gap-2 rounded-md bg-zinc-800 border border-white/10 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-red-400"
                                title="Sign Out"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        </>

                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
                                Sign in
                            </Link>

                            <Link
                                href="/login"
                                className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
                            >
                                Start Contributing
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
