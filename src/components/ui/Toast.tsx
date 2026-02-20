"use client";

import { CheckCircle2, X, AlertCircle, Info } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
    message: string;
    type?: ToastType;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type = "success", isVisible, onClose, duration = 3000 }: ToastProps) {
    const [show, setShow] = useState(isVisible);
    const [progress, setProgress] = useState(100);

    useEffect(() => {
        setShow(isVisible);
        if (isVisible) {
            setProgress(100);
            const startTime = Date.now();

            const progressInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
                setProgress(remaining);
            }, 10);

            const timer = setTimeout(() => {
                setShow(false);
                onClose();
            }, duration);

            return () => {
                clearTimeout(timer);
                clearInterval(progressInterval);
            };
        }
    }, [isVisible, duration, onClose]);

    if (!show) return null;

    const styles = {
        success: {
            bg: "bg-zinc-950/90",
            border: "border-green-500/30",
            icon: CheckCircle2,
            iconColor: "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]",
            progressBg: "bg-green-500",
            shadow: "shadow-[0_4px_40px_rgba(74,222,128,0.15)]"
        },
        error: {
            bg: "bg-zinc-950/90",
            border: "border-red-500/30",
            icon: X,
            iconColor: "text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]",
            progressBg: "bg-red-500",
            shadow: "shadow-[0_4px_40px_rgba(239,68,68,0.15)]"
        },
        warning: {
            bg: "bg-zinc-950/90",
            border: "border-yellow-500/30",
            icon: AlertCircle,
            iconColor: "text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]",
            progressBg: "bg-yellow-500",
            shadow: "shadow-[0_4px_40px_rgba(250,204,21,0.15)]"
        },
        info: {
            bg: "bg-zinc-950/90",
            border: "border-blue-500/30",
            icon: Info,
            iconColor: "text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]",
            progressBg: "bg-blue-500",
            shadow: "shadow-[0_4px_40px_rgba(96,165,250,0.15)]"
        },
    };

    const currentStyle = styles[type];
    const Icon = currentStyle.icon;

    return (
        <div className={`fixed bottom-8 right-8 z-[100] flex flex-col overflow-hidden rounded-xl border ${currentStyle.border} ${currentStyle.bg} ${currentStyle.shadow} backdrop-blur-xl transform transition-all animate-in fade-in slide-in-from-bottom-8 duration-500 min-w-[320px]`}>
            <div className="flex items-center gap-3 px-4 py-4 relative">
                {/* Subtle radial glow behind the icon */}
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full blur-xl opacity-50 ${currentStyle.progressBg}`}></div>

                <Icon className={`h-5 w-5 ${currentStyle.iconColor} relative z-10`} />

                <div className="flex-1 mr-2 relative z-10">
                    <span className="text-sm font-medium text-white tracking-wide">{message}</span>
                </div>

                <button
                    onClick={() => { setShow(false); onClose(); }}
                    className="p-1.5 rounded-md hover:bg-white/10 text-zinc-400 hover:text-white transition-colors relative z-10"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-zinc-800/50">
                <div
                    className={`h-full ${currentStyle.progressBg} transition-all duration-75 ease-linear shadow-[0_0_10px_currentColor]`}
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
