import { Search, Download, Play } from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Search the Repo",
        description: "Filter by use case, connector, or pattern. Find exactly what you need in seconds.",
        icon: Search,
    },
    {
        id: 2,
        title: "Clone or Download",
        description: "Get the Anypoint Studio project files directly via Git or ZIP download.",
        icon: Download,
    },
    {
        id: 3,
        title: "Deploy & Run",
        description: "Import into Anypoint Studio, configure your credentials, and run locally or deploy to CloudHub.",
        icon: Play,
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        From Concept to Code in Minutes
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Streamlined workflow designed for developers who want to get things done.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector Line (Desktop) */}
                    {/* Connector Line (Desktop) with Animation */}
                    <div className="hidden md:block absolute top-[30%] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30 -translate-y-1/2 z-0 animate-pulse"></div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {steps.map((step) => (
                            <div key={step.id} className="flex flex-col items-center text-center bg-background p-6 rounded-xl border border-border shadow-sm">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-secondary text-primary mb-6 ring-8 ring-background">
                                    <step.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
