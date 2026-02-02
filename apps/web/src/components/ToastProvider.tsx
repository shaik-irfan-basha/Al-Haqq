'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    showToast: (message: string, type?: Toast['type'], duration?: number) => void;
    dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

const ICONS = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
};

const COLORS = {
    success: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        icon: 'text-green-500',
        text: 'text-green-700 dark:text-green-300',
    },
    error: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        icon: 'text-red-500',
        text: 'text-red-700 dark:text-red-300',
    },
    warning: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        icon: 'text-amber-500',
        text: 'text-amber-700 dark:text-amber-300',
    },
    info: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        icon: 'text-blue-500',
        text: 'text-blue-700 dark:text-blue-300',
    },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const toast: Toast = { id, message, type, duration };

        setToasts((prev) => [...prev, toast]);

        if (duration > 0) {
            setTimeout(() => {
                dismissToast(id);
            }, duration);
        }
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, showToast, dismissToast }}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => {
                    const Icon = ICONS[toast.type];
                    const colors = COLORS[toast.type];

                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            className={`
                                pointer-events-auto flex items-center gap-3 p-4 rounded-xl
                                ${colors.bg} ${colors.border} border
                                backdrop-blur-xl shadow-lg
                            `}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${colors.icon}`} />
                            <p className={`flex-1 text-sm font-medium ${colors.text}`}>
                                {toast.message}
                            </p>
                            <button
                                onClick={() => onDismiss(toast.id)}
                                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4 text-[var(--color-text-muted)]" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}

export default ToastProvider;
