import { api } from './api';
import type { AuthRequest, AuthResponse } from '../types/auth.ts';

const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    localStorage.setItem('medly_token', response.data.token);
    localStorage.setItem('medly_role', response.data.role);

    return response.data;
};

const setSession = (token: string, role: string) => {
    localStorage.setItem('medly_token', token);
    localStorage.setItem('medly_role', role);
};

const getToken = () => localStorage.getItem('medly_token');

const getRole = () => localStorage.getItem('medly_role');

const logout = () => {
    localStorage.removeItem('medly_token');
    localStorage.removeItem('medly_role');
};

export const authService = {
    login,
    setSession,
    getToken,
    getRole,
    logout
};