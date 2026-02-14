import Link from "next/link";
import { Github } from "lucide-react";

export function Header() {
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
                    <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
                        Sign in
                    </Link>
                    <Link
                        href="https://github.com"
                        target="_blank"
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <Github className="h-5 w-5" />
                    </Link>
                    <Link
                        href="/login"
                        className="hidden sm:inline-flex h-9 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 focus:ring-offset-zinc-900"
                    >
                        Start Contributing
                    </Link>
                </div>
            </div>
        </header>
    );
}
