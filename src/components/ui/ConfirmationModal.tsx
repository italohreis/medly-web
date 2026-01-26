import { useEffect, type ReactNode } from 'react';

export type ConfirmationVariant = 'danger' | 'success' | 'warning';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmationVariant;
    isLoading?: boolean;
}

const variantConfig: Record<ConfirmationVariant, {
    iconBg: string;
    iconColor: string;
    buttonBg: string;
    buttonHover: string;
    icon: ReactNode;
}> = {
    danger: {
        iconBg: 'bg-danger-100',
        iconColor: 'text-danger-600',
        buttonBg: 'bg-danger-600',
        buttonHover: 'hover:bg-danger-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        )
    },
    success: {
        iconBg: 'bg-success-100',
        iconColor: 'text-success-600',
        buttonBg: 'bg-success-600',
        buttonHover: 'hover:bg-success-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    warning: {
        iconBg: 'bg-warning-100',
        iconColor: 'text-warning-600',
        buttonBg: 'bg-warning-600',
        buttonHover: 'hover:bg-warning-700',
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }
};

export function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger',
    isLoading = false
}: ConfirmationModalProps) {
    const config = variantConfig[variant];

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose, isLoading]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 transition-opacity -z-10"
                    onClick={isLoading ? undefined : onClose}
                />

                {/* Modal */}
                <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full z-10 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-6">
                        {/* Icon */}
                        <div className={`mx-auto w-12 h-12 rounded-full ${config.iconBg} flex items-center justify-center mb-4`}>
                            <span className={config.iconColor}>
                                {config.icon}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-medical-900 mb-2">
                                {title}
                            </h3>
                            <p className="text-medical-600 text-sm">
                                {message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 border border-medical-300 text-medical-700 rounded-lg font-medium hover:bg-medical-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`flex-1 px-4 py-2.5 ${config.buttonBg} ${config.buttonHover} text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                            >
                                {isLoading && (
                                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                )}
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
