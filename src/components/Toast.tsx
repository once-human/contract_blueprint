import React, { createContext, useContext, useState, useCallback } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    addToast: (message: string, type?: ToastType) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 9999,
                pointerEvents: 'none' // Allow clicks through container
            }}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        style={{
                            pointerEvents: 'auto',
                            minWidth: '300px',
                            padding: '12px 16px',
                            background: 'rgba(28, 28, 30, 0.95)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                            color: 'white',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            animation: 'slideIn 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            borderLeft: toast.type === 'success' ? '4px solid #30d158' :
                                toast.type === 'error' ? '4px solid #ff453a' : '4px solid #0a84ff'
                        }}
                    >
                        <div style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            background: toast.type === 'success' ? 'rgba(48, 209, 88, 0.2)' :
                                toast.type === 'error' ? 'rgba(255, 69, 58, 0.2)' : 'rgba(10, 132, 255, 0.2)',
                            color: toast.type === 'success' ? '#30d158' :
                                toast.type === 'error' ? '#ff453a' : '#0a84ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px'
                        }}>
                            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'i'}
                        </div>
                        <span style={{ fontWeight: 500 }}>{toast.message}</span>
                    </div>
                ))}
            </div>
            <style>
                {`
                @keyframes slideIn {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                `}
            </style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
