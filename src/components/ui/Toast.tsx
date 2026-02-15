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

    useEffect(() => {
        setShow(isVisible);
        if (isVisible) {
            const timer = setTimeout(() => {
                setShow(false);
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    if (!show) return null;

    const bgColors = {
        success: "bg-green-500/10 border-green-500/20 text-green-400",
        error: "bg-red-500/10 border-red-500/20 text-red-400",
        warning: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
        info: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    };

    const icons = {
        success: CheckCircle2,
        error: X,
        warning: AlertCircle,
        info: Info,
    };

    const Icon = icons[type];

    return (
        <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300 ${bgColors[type]}`}>
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{message}</span>
            <button
                onClick={() => { setShow(false); onClose(); }}
                className="ml-4 hover:opacity-70 transition-opacity"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
