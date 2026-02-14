import { Building2, Globe2, ShieldCheck, Zap } from "lucide-react";

const companies = [
    { name: "GlobalTech", icon: Globe2 },
    { name: "FinSecure", icon: ShieldCheck },
    { name: "FastStream", icon: Zap },
    { name: "EnterpriseCo", icon: Building2 },
];

export function TrustedBy() {
    return (
        <section className="py-12 border-y border-white/5 bg-white/5 backdrop-blur-sm">
            <div className="container px-4 mx-auto">
                <p className="text-center text-sm font-medium text-muted-foreground mb-8">
                    TRUSTED BY INTEGRATION TEAMS AT
                </p>
                <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {companies.map((company) => (
                        <div key={company.name} className="flex items-center gap-2 group cursor-default">
                            <company.icon className="h-6 w-6 text-foreground group-hover:text-blue-500 transition-colors" />
                            <span className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors">
                                {company.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
