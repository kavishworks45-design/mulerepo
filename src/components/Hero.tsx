"use client";
import Link from "next/link";
import { ArrowRight, Clock, ShieldCheck, Zap, Database, ArrowUpRight, CheckCircle2, XCircle, Terminal, Layers, Lock, Gauge, Code2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function Hero() {
    const [elapsed, setElapsed] = useState(0);
    const [activeFeature, setActiveFeature] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        // Calculate mouse position relative to card center (-0.5 to 0.5)
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        // Smoothly reset to center
        setMousePosition({ x: 0, y: 0 });
    };

    const features = [
        {
            id: "speed",
            title: "Accelerate Delivery",
            icon: Zap,
            color: "blue",
            desc: "Skip the setup. Start with 80% of the work done.",
            metric: "20x Faster",
            visual: (
                <div className="w-full h-full bg-zinc-900/50 relative overflow-hidden flex flex-col justify-center px-6 group/speed">
                    {/* Parallax Background Grid - Pushes Back */}
                    <div
                        className="absolute inset-[-20px] bg-[linear-gradient(to_right,#3b82f61a_1px,transparent_1px),linear-gradient(to_bottom,#3b82f61a_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] animate-[pan_10s_linear_infinite]"
                        style={{ transform: `translateX(${mousePosition.x * -30}px) translateY(${mousePosition.y * -30}px)` }}
                    ></div>

                    {/* Parallax Particles - Pushes Forward */}
                    <div
                        className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-[ping_2s_infinite]"
                        style={{ transform: `translateX(${mousePosition.x * 40}px) translateY(${mousePosition.y * 40}px)` }}
                    ></div>
                    <div
                        className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-[ping_3s_infinite_delay-1000]"
                        style={{ transform: `translateX(${mousePosition.x * 50}px) translateY(${mousePosition.y * 50}px)` }}
                    ></div>

                    {/* Slow Bar - Middle Depth */}
                    <div
                        className="mb-6 relative z-10"
                        style={{ transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)` }}
                    >
                        <div className="flex justify-between text-xs text-zinc-500 mb-1 font-mono">
                            <span className="flex items-center gap-1"><Terminal className="h-3 w-3" /> Manual Build</span>
                            <span>40h</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div className="h-full bg-zinc-600 w-[15%] relative overflow-hidden">
                                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                            </div>
                        </div>
                    </div>

                    {/* Fast Bar - Close Depth (Pops out) */}
                    <div
                        className="relative z-20"
                        style={{ transform: `translateX(${mousePosition.x * 25}px) translateY(${mousePosition.y * 25}px)` }}
                    >
                        <div className="flex justify-between text-xs text-white mb-1 font-mono">
                            <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-400 fill-yellow-400 animate-pulse" /> MuleRepo POC</span>
                            <span className="text-green-400 font-bold animate-[pulse_1s_infinite]">2h</span>
                        </div>
                        <div className="h-4 w-full bg-zinc-800 rounded-full overflow-hidden border border-blue-500/30 shadow-[0_10px_20px_rgba(59,130,246,0.2)]">
                            <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 w-full animate-[progress_1s_ease-out_forwards] relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
                                <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full animate-[shimmer_1s_infinite]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "reliability",
            title: "Rock-Solid Reliability",
            icon: ShieldCheck,
            color: "green",
            desc: "Proven patterns tested in high-volume production.",
            metric: "99.99% Uptime",
            visual: (
                <div className="w-full h-full bg-zinc-900/50 relative overflow-hidden flex items-center justify-center">
                    {/* Parallax Matrix Rain - Far Depth */}
                    <div
                        className="absolute inset-[-20px] opacity-10 font-mono text-[8px] leading-3 text-green-500 overflow-hidden select-none"
                        style={{ transform: `translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)` }}
                    >
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className="absolute animate-[matrix_5s_linear_infinite]" style={{ left: `${i * 5}%`, animationDelay: `${Math.random() * 5}s` }}>
                                101010101<br />010101010<br />110011001
                            </div>
                        ))}
                    </div>

                    {/* Radar Scan Layer - Mid Depth */}
                    <div className="absolute inset-0 bg-green-500/5 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.8)] animate-[scan_3s_linear_infinite]"></div>

                    {/* Central Badge - Near Depth (Floats) */}
                    <div
                        className="relative z-10 text-center animate-in zoom-in duration-500"
                        style={{ transform: `translateX(${mousePosition.x * 30}px) translateY(${mousePosition.y * 30}px)` }}
                    >
                        <div className="relative">
                            <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-500/30 shadow-[0_0_40px_rgba(34,197,94,0.3)] backdrop-blur-sm">
                                <CheckCircle2 className="h-8 w-8 text-green-400 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                            </div>
                            {/* Rotating Rings with inverse Parallax */}
                            <div
                                className="absolute -inset-4 border border-green-500/20 rounded-full animate-[spin_10s_linear_infinite]"
                                style={{ transform: `translateX(${mousePosition.x * -10}px) translateY(${mousePosition.y * -10}px)` }}
                            ></div>
                            <div
                                className="absolute -inset-6 border border-green-500/10 rounded-full border-dashed animate-[spin_15s_linear_infinite_reverse]"
                                style={{ transform: `translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)` }}
                            ></div>
                        </div>

                        <div className="text-sm font-bold text-white tracking-wide mt-4 drop-shadow-md">SYSTEM SECURE</div>
                        <div className="text-xs text-green-400/80 mt-1 font-mono animate-pulse">0 Vulnerabilities Found</div>
                    </div>
                </div>
            )
        },
        {
            id: "quality",
            title: "Enterprise Architecture",
            icon: Layers,
            color: "purple",
            desc: "Stop researching. Use patterns designed by Architects.",
            metric: "Best Practice",
            visual: (
                <div className="w-full h-full bg-zinc-900/50 relative overflow-hidden flex items-center justify-around px-4">
                    {/* Scrolling Code - Deep Depth */}
                    <div
                        className="absolute inset-[-20px] opacity-10 bg-black p-4 font-mono text-[8px] text-purple-300 overflow-hidden"
                        style={{ transform: `translateX(${mousePosition.x * -40}px) translateY(${mousePosition.y * -40}px)` }}
                    >
                        <div className="animate-[scrollUp_10s_linear_infinite]">
                            import org.mule.runtime.core.api.event.CoreEvent;<br />
                            public class Architecture implements Pattern &#123;<br />
                            &nbsp;&nbsp;@Override<br />
                            &nbsp;&nbsp;public Event process(Event event) &#123;<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;return Flow.builder()<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.source("http-listener")<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.target("salesforce")<br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.build();<br />
                            &nbsp;&nbsp;&#125;<br />
                        </div>
                    </div>

                    {/* Architecture Nodes - Staggered Depth */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div
                            className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10 shadow-lg animate-[float_4s_ease-in-out_infinite]"
                            style={{ transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)` }}
                        >
                            <Database className="h-5 w-5 text-zinc-400" />
                        </div>

                        <div className="h-8 w-[2px] bg-gradient-to-b from-zinc-700 to-purple-500/50"></div>

                        <div
                            className="h-14 w-14 bg-purple-500/20 rounded-xl flex items-center justify-center border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.3)] animate-[float_4s_ease-in-out_infinite_delay-1000] relative backdrop-blur-sm"
                            style={{ transform: `translateX(${mousePosition.x * 30}px) translateY(${mousePosition.y * 30}px) scale(1.1)` }}
                        >
                            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-black animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                            <Layers className="h-7 w-7 text-purple-400" />
                        </div>

                        <div className="h-8 w-[2px] bg-gradient-to-b from-purple-500/50 to-zinc-700"></div>

                        <div
                            className="h-10 w-10 bg-zinc-900 rounded-lg flex items-center justify-center border border-white/10 shadow-lg animate-[float_4s_ease-in-out_infinite_delay-2000]"
                            style={{ transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)` }}
                        >
                            <Code2 className="h-5 w-5 text-zinc-400" />
                        </div>
                    </div>

                    {/* Floating Info Box - Extreme Foregound */}
                    <div
                        className="relative z-20 text-[10px] text-zinc-300 font-mono bg-black/80 backdrop-blur-md p-4 rounded-xl border border-purple-500/30 shadow-[0_20px_40px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-right-4 duration-700"
                        style={{ transform: `translateX(${mousePosition.x * 50}px) translateY(${mousePosition.y * 50}px)` }}
                    >
                        <div className="text-purple-400 font-bold mb-3 flex items-center gap-2 border-b border-purple-500/20 pb-2">
                            <ArrowUpRight className="h-3 w-3" />
                            patterns/sync-v1
                        </div>
                        <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Error Handling</div>
                        <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Reconnection</div>
                        <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500" /> Audit Logging</div>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setElapsed(window.scrollY);
        };

        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 8000); // Slower interval to enjoy the interaction

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearInterval(interval);
        };
    }, []);

    const currentFeature = features[activeFeature];

    return (
        <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center rounded-full border border-border bg-secondary/50 px-3 py-1 text-sm font-medium text-secondary-foreground mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                        Now Available: MuleRepo v1.0
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        MuleSoft POCs, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 animate-gradient-x">
                            Ready to Deploy.
                        </span>
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        Stop building from scratch. Access a curated repository of production-grade templates and integrations designed by Architects.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Link href="/browse" className="relative inline-flex items-center justify-center rounded-md bg-white text-black px-8 py-3 text-sm font-medium shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:bg-gray-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-white dark:text-black overflow-hidden group">
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                            <span className="relative z-10 flex items-center">
                                Browse POCs
                                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <a href="#contribute" className="inline-flex items-center justify-center rounded-md border border-input bg-transparent px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:border-white/20">
                            Contribute
                        </a>
                    </div>

                    {/* Deep Space Parallax Card */}
                    <div
                        className="relative w-full max-w-3xl mx-auto perspective-[1200px] h-[380px] group"
                        style={{ transform: `translateY(${elapsed * 0.05}px)` }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Parallax Background Glow Layer */}
                        <div
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[120%] transition-all duration-1000 rounded-[3rem] blur-[80px] -z-20 opacity-60 ${currentFeature.id === 'speed' ? 'bg-blue-600/30' :
                                    currentFeature.id === 'reliability' ? 'bg-green-600/30' : 'bg-purple-600/30'
                                }`}
                            style={{ transform: `translate(-50%, -50%) translateX(${mousePosition.x * -20}px) translateY(${mousePosition.y * -20}px)` }}
                        ></div>

                        {/* The Active Card container with Advanced 3D Tilt */}
                        <div
                            ref={cardRef}
                            className="absolute inset-0 transition-all duration-100 ease-out preserve-3d"
                            style={{
                                transform: `rotateY(${mousePosition.x * 8}deg) rotateX(${mousePosition.y * -8}deg)`,
                            }}
                        >
                            <div className="h-full bg-[#09090b]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] flex flex-col md:flex-row relative z-10 hover:border-white/20 transition-colors duration-500">

                                {/* Dynamic Spotlight Overlay */}
                                <div
                                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-soft-light z-30"
                                    style={{
                                        background: `radial-gradient(circle at ${mousePosition.x * 100 + 50}% ${mousePosition.y * 100 + 50}%, rgba(255,255,255,0.2), transparent 50%)`
                                    }}
                                ></div>

                                {/* Content Side - Floating Elements */}
                                <div className="p-8 md:w-[45%] flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 relative bg-black/20">
                                    <div className="relative z-10">
                                        <div key={currentFeature.id} className="animate-in fade-in slide-in-from-left-4 duration-500">
                                            {/* Parallax Badge */}
                                            <div
                                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-6 uppercase tracking-wider shadow-lg transform transition-transform duration-200 ${currentFeature.id === 'speed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                        currentFeature.id === 'reliability' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                    }`}
                                                style={{ transform: `translateX(${mousePosition.x * 15}px) translateY(${mousePosition.y * 15}px)` }}
                                            >
                                                <currentFeature.icon className="h-3 w-3" />
                                                {currentFeature.metric}
                                            </div>

                                            {/* Parallax Title */}
                                            <h3
                                                className="text-3xl font-bold text-white mb-4 drop-shadow-xl"
                                                style={{ transform: `translateX(${mousePosition.x * 10}px) translateY(${mousePosition.y * 10}px)` }}
                                            >
                                                {currentFeature.title}
                                            </h3>

                                            {/* Parallax Description */}
                                            <p
                                                className="text-zinc-400 text-sm leading-relaxed font-light"
                                                style={{ transform: `translateX(${mousePosition.x * 5}px) translateY(${mousePosition.y * 5}px)` }}
                                            >
                                                {currentFeature.desc}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Interactive Tabs - Fixed relative to card */}
                                    <div className="flex gap-2 mt-auto relative z-10 pt-8">
                                        {features.map((f, i) => (
                                            <button
                                                key={f.id}
                                                onClick={() => setActiveFeature(i)}
                                                className={`h-1.5 rounded-full transition-all duration-500 ${activeFeature === i
                                                        ? `w-12 ${f.color === 'blue' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : f.color === 'green' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]'}`
                                                        : 'w-2 bg-zinc-800 hover:bg-zinc-600'
                                                    }`}
                                            >
                                                {activeFeature === i && <span className="sr-only">Active</span>}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Visual Side - The Stage with Deep Parallax */}
                                <div className="flex-1 bg-black/40 relative overflow-hidden flex items-center justify-center p-6 md:p-0">
                                    {/* Static Scan lines overlay */}
                                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-20"></div>

                                    <div key={currentFeature.id} className="w-full h-full animate-in fade-in zoom-in-95 duration-700 relative z-10">
                                        {currentFeature.visual}
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Background Grid */}
            <div
                className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
                style={{ transform: `translateY(${elapsed * 0.1}px)` }}
            ></div>

            {/* Background Gradient */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-3xl opacity-50 mix-blend-screen"
                    style={{ transform: `translateY(${elapsed * -0.1}px) translateX(-50%)` }}
                ></div>
            </div>
        </section>
    );
}
