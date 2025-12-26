import { useState, } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService.ts';
import { AuthContext } from '../hooks/useAuth';

interface User {
    token: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        const token = authService.getToken();
        const role = authService.getRole();
        if (token && role) {
            return {
                token,
                role: role as 'ADMIN' | 'DOCTOR' | 'PATIENT'
            };
        }
        return null;
    });
    const login = (token: string, role: string) => {
        const userData = {
            token,
            role: role as 'ADMIN' | 'DOCTOR' | 'PATIENT'
        };
        setUser(userData);
        authService.setSession(token, role);
    };

    const logout = () => {
        setUser(null);
        authService.logout();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading: false,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
