import { useContext } from 'react';
import { createContext } from 'react';

interface User {
    token: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
}

interface AuthContextData {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}
