import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
    return (
        <section id="contribute" className="py-24 relative overflow-hidden">
            <div className="container px-4 mx-auto relative z-10">
                <div className="mx-auto max-w-4xl text-center bg-zinc-900 border border-white/10 rounded-3xl p-12 md:p-20 relative overflow-hidden">

                    {/* Background Effects inside box */}
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20"></div>
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6 relative z-10">
                        Ready to ship your next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            MuleSoft integration?
                        </span>
                    </h2>

                    <p className="text-lg text-zinc-400 mb-10 max-w-2xl mx-auto relative z-10">
                        Join thousands of developers who are building faster, cleaner, and more secure integrations with MuleRepo.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link href="/browse" className="inline-flex items-center justify-center h-12 rounded-md bg-white text-black px-8 text-sm font-medium shadow hover:bg-zinc-200 transition-colors">
                            Get Instant Access
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                        <Link href="#" className="inline-flex items-center justify-center h-12 rounded-md border border-white/20 bg-transparent text-white px-8 text-sm font-medium hover:bg-white/10 transition-colors">
                            View Documentation
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
}
