import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    loading?: boolean;
    colorClass: string;
    to?: string;
}

export function StatCard({ title, value, icon, loading, colorClass, to }: StatCardProps) {
    const content = (
        <>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-medical-600">{title}</p>
                    <h3 className="text-3xl font-bold text-medical-900 mt-2">
                        {loading ? '...' : value}
                    </h3>
                </div>
                <div className={`w-14 h-14 ${colorClass} rounded-xl flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
            {to && (
                <div className="mt-4 pt-4 border-t border-medical-100">
                    <span className="text-sm font-medium text-primary-600 flex items-center">
                        Ver todos
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </span>
                </div>
            )}
        </>
    );

    if (to) {
        return (
            <Link
                to={to}
                className="block bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5"
            >
                {content}
            </Link>
        );
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow">
            {content}
        </div>
    );
}
