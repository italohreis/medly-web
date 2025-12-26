import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';


interface DashboardLayoutProps {
    children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getRoleName = () => {
        switch (user?.role) {
            case 'ADMIN': return 'Administrador';
            case 'DOCTOR': return 'Médico';
            case 'PATIENT': return 'Paciente';
            default: return '';
        }
    };

    const getRoleColor = () => {
        switch (user?.role) {
            case 'ADMIN': return 'bg-danger-500';
            case 'DOCTOR': return 'bg-primary-600';
            case 'PATIENT': return 'bg-success-500';
            default: return 'bg-medical-500';
        }
    };

    return (
        <div className="min-h-screen bg-medical-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-medical-900">Medly</h1>
                            <p className="text-xs text-medical-500">Sistema de Gestão Médica</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-medical-900">
                                    {getRoleName()}
                                </span>
                                <span className={`${getRoleColor()} text-white text-xs px-2 py-0.5 rounded-full`}>
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                        >
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    );
}
