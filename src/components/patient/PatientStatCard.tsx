import type { ReactNode } from 'react';

interface PatientStatCardProps {
    title: string;
    value: number | string;
    icon: ReactNode;
    variant?: 'primary' | 'success' | 'warning' | 'info' | 'danger';
}

const variantStyles = {
    primary: 'from-primary-500 to-primary-600 text-white',
    success: 'from-success-500 to-success-600 text-white',
    warning: 'from-warning-500 to-warning-600 text-white',
    info: 'from-blue-500 to-blue-600 text-white',
    danger: 'from-danger-500 to-danger-600 text-white'
};

const iconBgStyles = {
    primary: 'bg-white/20',
    success: 'bg-white/20',
    warning: 'bg-white/20',
    info: 'bg-white/20',
    danger: 'bg-white/20'
};

export function PatientStatCard({ title, value, icon, variant = 'primary' }: PatientStatCardProps) {
    return (
        <div className={`rounded-xl p-6 bg-gradient-to-br ${variantStyles[variant]} shadow-lg`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-90">{title}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${iconBgStyles[variant]} flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}