import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface MenuItem {
    label: string;
    path: string;
    icon?: string;
    roles: ('ADMIN' | 'DOCTOR' | 'PATIENT')[];
}

const menuItems: MenuItem[] = [
    { label: 'Dashboard Admin', path: '/admin', roles: ['ADMIN'] },
    { label: 'Agenda Médica', path: '/doctor', roles: ['DOCTOR'] },
    { label: 'Minhas Consultas', path: '/patient', roles: ['PATIENT'] },
];

interface SidebarLayoutProps {
    children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useLocation();

    const filteredMenuItems = menuItems.filter(item =>
        user?.role && item.roles.includes(user.role)
    );

    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    return (
        <div className="flex min-h-screen bg-medical-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-lg fixed h-full">
                <div className="p-6 border-b border-medical-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">M</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-medical-900">Medly</h1>
                            <p className="text-xs text-medical-500">Gestão Médica</p>
                        </div>
                    </div>
                </div>

                <nav className="p-4">
                    <ul className="space-y-2">
                        {filteredMenuItems.map((item) => {
                            const isActive = navigate.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`
                      block px-4 py-3 rounded-lg transition-all
                      ${isActive
                                                ? 'bg-primary-600 text-white font-medium'
                                                : 'text-medical-700 hover:bg-medical-100'
                                            }
                    `}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-medical-200">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors text-left"
                    >
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="ml-64 flex-1">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
