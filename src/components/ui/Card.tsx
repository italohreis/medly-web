import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    hoverable?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    className = '',
    hoverable = false,
    padding = 'md'
}: CardProps) {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        bg-white rounded-card shadow-card
        ${hoverable ? 'hover:shadow-card-hover transition-shadow duration-200 cursor-pointer' : ''}
        ${paddings[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: ReactNode;
    className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`border-b border-medical-200 pb-4 mb-4 ${className}`}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: ReactNode;
    className?: string;
}

export function CardTitle({ children, className = '' }: CardTitleProps) {
    return (
        <h3 className={`text-xl font-semibold text-medical-900 ${className}`}>
            {children}
        </h3>
    );
}
