import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService.ts';
import { AuthContext } from '../hooks/useAuth';
import type { UserProfile } from '../types/user';

interface User {
    token: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    profile?: UserProfile;
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

    useEffect(() => {
        if (user?.token && !user?.profile) {
            authService.getMyProfile().then(profile => {
                setUser(prev => prev ? { ...prev, profile } : null);
            }).catch(() => {
            });
        }
    }, [user?.token, user?.profile]);

    const loadProfile = async () => {
        if (!user?.token) return;
        try {
            const profile = await authService.getMyProfile();
            setUser(prev => prev ? { ...prev, profile } : null);
        } catch (error) {
            console.error('Erro ao carregar perfil:', error);
        }
    };

    const login = (token: string, role: string) => {
        const userData = {
            token,
            role: role as 'ADMIN' | 'DOCTOR' | 'PATIENT'
        };
        setUser(userData);
        authService.setSession(token, role);

        authService.getMyProfile().then(profile => {
            setUser(prev => prev ? { ...prev, profile } : null);
        }).catch(error => {
            console.error('Erro ao carregar perfil:', error);
        });
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
                logout,
                loadProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
