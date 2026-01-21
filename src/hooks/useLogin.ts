import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/authService.ts';
import { useAuth } from './useAuth';
import type { AuthRequest } from '../types/auth';
import { AxiosError } from 'axios';

export function useLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<AuthRequest>();

    const handleLogin = async (data: AuthRequest) => {
        setApiError('');

        try {
            const response = await authService.login(data);
            
            login(response.token, response.role);

            switch (response.role) {
                case 'ADMIN':
                    navigate('/admin'); 
                    break;
                case 'DOCTOR':
                    navigate('/doctor'); 
                    break;
                case 'PATIENT':
                    navigate('/patient'); 
                    break;
                default:
                    navigate('/');
            }

        } catch (err) {
            if (err instanceof AxiosError && err.response) {
                setApiError(err.response.data.message);
            } else {
                setApiError('Erro inesperado ao tentar fazer login.');
            }
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(handleLogin),
        errors,
        isSubmitting,
        apiError
    };
}