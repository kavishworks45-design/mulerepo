import { Layers, Rocket, Code, ShieldCheck, Zap, Database } from "lucide-react";

const features = [
    {
        name: "Ready-to-Deploy Templates",
        description: "Skip the boilerplate. Access pre-configured MuleSoft templates for common integration patterns, including API-led connectivity and batch processing.",
        icon: Rocket,
    },
    {
        name: "DataWeave Snippet Library",
        description: "A curated collection of complex DataWeave transformations. From JSON to XML to CSV—handle any data format with ease.",
        icon: Code,
    },
    {
        name: "Security Best Practices",
        description: "Every POC is built with security in mind. OAuth, TLS, and policies are baked in, not bolted on effectively securing your APIs.",
        icon: ShieldCheck,
    },
    {
        name: "High Performance",
        description: "Optimized for valid throughput and low latency. Learn how to tune your flows for maximum efficiency.",
        icon: Zap,
    },
    {
        name: "Connector Examples",
        description: "Real-world examples for Salesforce, SAP, Database, and HTTP connectors. See how to configure them correctly.",
        icon: Database,
    },
    {
        name: "Architectural Patterns",
        description: "Understand the 'why' behind the code. Each POC includes architectural diagrams and decision logs.",
        icon: Layers,
    },
];

export function Features() {
    return (
        <section id="features" className="py-24">
            <div className="container px-4 mx-auto">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Everything You Need to Build Faster
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Repo accelerates your development lifecycle by providing tested, production-grade building blocks.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <div key={feature.name} className="relative group p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-blue-500/50 transition-all duration-300">
                            <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            <div className="relative">
                                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-500/10 text-blue-500 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-blue-400 transition-colors">
                                    {feature.name}
                                </h3>
                                <p className="text-muted-foreground group-hover:text-zinc-300 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
