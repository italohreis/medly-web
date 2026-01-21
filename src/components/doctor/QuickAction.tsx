import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface QuickActionProps {
    to: string;
    icon: ReactNode;
    title: string;
    description: string;
    variant?: 'primary' | 'success' | 'info';
}

export function QuickAction({ to, icon, title, description, variant = 'primary' }: QuickActionProps) {
    const bgVariants = {
        primary: 'bg-primary-50 hover:bg-primary-100',
        success: 'bg-success-50 hover:bg-success-100',
        info: 'bg-info-50 hover:bg-info-100'
    };

    const iconBgVariants = {
        primary: 'bg-primary-600',
        success: 'bg-success-600',
        info: 'bg-info-600'
    };

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${bgVariants[variant]}`}
        >
            <div className={`p-2 rounded-lg ${iconBgVariants[variant]}`}>
                <span className="text-white">{icon}</span>
            </div>
            <div>
                <p className="font-medium text-medical-900">{title}</p>
                <p className="text-xs text-medical-500">{description}</p>
            </div>
        </Link>
    );
}
