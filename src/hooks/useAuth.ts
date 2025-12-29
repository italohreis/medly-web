import { useContext } from 'react';
import { createContext } from 'react';
import type { UserProfile } from '../types/user';

interface User {
    token: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    profile?: UserProfile;
}

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
    loadProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
