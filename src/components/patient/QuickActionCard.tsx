import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface QuickActionCardProps {
    to: string;
    icon: ReactNode;
    title: string;
    description: string;
    variant?: 'primary' | 'success' | 'info';
}

const variantStyles = {
    primary: 'border-primary-200 hover:border-primary-400 hover:bg-primary-50',
    success: 'border-success-200 hover:border-success-400 hover:bg-success-50',
    info: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
};

const iconStyles = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    info: 'bg-blue-100 text-blue-600'
};

export function QuickActionCard({ to, icon, title, description, variant = 'primary' }: QuickActionCardProps) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 ${variantStyles[variant]}`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconStyles[variant]}`}>
                {icon}
            </div>
            <div>
                <p className="font-semibold text-medical-900">{title}</p>
                <p className="text-sm text-medical-500">{description}</p>
            </div>
        </Link>
    );
}