import Link from "next/link";
import { Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-card border-t border-border py-12">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-xl font-bold text-foreground tracking-tight">MuleRepo</span>
                        <p className="text-sm text-muted-foreground mt-2">
                            © {new Date().getFullYear()} MuleSaver Inc. All rights reserved.
                        </p>
                        <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
                            Built with <span className="text-red-500 animate-pulse">❤️</span> by <span className="text-white font-serif italic text-sm tracking-wide hover:tracking-widest transition-all duration-300 cursor-default">Kavish</span>
                        </p>
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <span className="sr-only">Twitter</span>
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <span className="sr-only">LinkedIn</span>
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </div>

                    <div className="flex gap-8 text-sm text-muted-foreground">
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="#" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
