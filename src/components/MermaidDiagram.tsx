"use client";

import React, { useEffect, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'loose',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    flowchart: {
        htmlLabels: true,
        curve: 'basis',
    }
});

export const MermaidDiagram = ({ chart }: { chart: string }) => {
    const [svg, setSvg] = useState('');

    useEffect(() => {
        const renderChart = async () => {
            if (chart) {
                try {
                    // unique id to prevent DOM conflict
                    const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg: renderedSvg } = await mermaid.render(id, chart);
                    setSvg(renderedSvg);
                } catch (error) {
                    console.error("Mermaid parsing error:", error);
                    setSvg('<div class="text-red-500 text-sm p-4 w-full text-center bg-red-500/10 border border-red-500/20 rounded-lg">Failed to render architecture diagram. Invalid chart syntax.</div>');
                }
            }
        };
        renderChart();
    }, [chart]);

    if (!chart) return null;

    return (
        <div className="w-full flex items-center justify-center p-6 bg-[#09090b] rounded-xl border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div
                className="mermaid relative z-10 w-full flex justify-center [&_svg]:max-w-full [&_svg]:h-auto diagram-container"
                dangerouslySetInnerHTML={{ __html: svg }}
            />
        </div>
    );
};
