import { useContext } from 'react';
import { createContext } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextData {
    showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast deve ser usado dentro de um ToastProvider');
    }
    return context;
}
