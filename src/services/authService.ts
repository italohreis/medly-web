import { api } from './api';
import type { AuthRequest, AuthResponse, RegisterRequest } from '../types/auth';
import type { UserProfile } from '../types/user';

const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    localStorage.setItem('medly_token', response.data.token);
    localStorage.setItem('medly_role', response.data.role);

    return response.data;
};

const register = async (data: RegisterRequest): Promise<void> => {
    await api.post('/patients', data);
};

const setSession = (token: string, role: string) => {
    localStorage.setItem('medly_token', token);
    localStorage.setItem('medly_role', role);
};

const getToken = () => localStorage.getItem('medly_token');

const getRole = () => localStorage.getItem('medly_role');

const getMyProfile = async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/users/me');
    return response.data;
};

const logout = () => {
    localStorage.removeItem('medly_token');
    localStorage.removeItem('medly_role');
};

export const authService = {
    login,
    register,
    setSession,
    getToken,
    getRole,
    getMyProfile,
    logout
};