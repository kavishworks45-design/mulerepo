import Link from "next/link";
import { Github, Twitter, Linkedin } from "lucide-react";

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
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                            <span className="sr-only">GitHub</span>
                            <Github className="h-5 w-5" />
                        </a>
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
