import type { ReactNode } from 'react';

interface DoctorStatCardProps {
    title: string;
    value: number | string;
    icon: ReactNode;
    variant?: 'primary' | 'success' | 'info' | 'warning' | 'gradient';
}

export function DoctorStatCard({ title, value, icon, variant = 'primary' }: DoctorStatCardProps) {
    const variants = {
        primary: 'bg-white border border-medical-100',
        success: 'bg-white border border-medical-100',
        info: 'bg-white border border-medical-100',
        warning: 'bg-white border border-medical-100',
        gradient: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white'
    };

    const iconBgVariants = {
        primary: 'bg-primary-100',
        success: 'bg-success-100',
        info: 'bg-info-100',
        warning: 'bg-warning-100',
        gradient: 'bg-white/20'
    };

    const iconColorVariants = {
        primary: 'text-primary-600',
        success: 'text-success-600',
        info: 'text-info-600',
        warning: 'text-warning-600',
        gradient: 'text-white'
    };

    const isGradient = variant === 'gradient';

    return (
        <div className={`rounded-xl shadow-sm p-6 ${variants[variant]}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${iconBgVariants[variant]}`}>
                    <span className={iconColorVariants[variant]}>{icon}</span>
                </div>
                <div>
                    <p className={`text-2xl font-bold ${isGradient ? 'text-white' : 'text-medical-900'}`}>
                        {value}
                    </p>
                    <p className={`text-sm ${isGradient ? 'text-primary-100' : 'text-medical-500'}`}>
                        {title}
                    </p>
                </div>
            </div>
        </div>
    );
}
