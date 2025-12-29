import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { authService } from '../services/authService';
import { AxiosError } from 'axios';

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    cpf: string;
    birthDate: string;
}

export function useRegister() {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues
    } = useForm<RegisterFormData>();

    const handleRegister = async (data: RegisterFormData) => {
        setApiError('');

        try {
            await authService.register({
                name: data.name,
                email: data.email,
                password: data.password,
                cpf: data.cpf,
                birthDate: data.birthDate
            });

            navigate('/', { state: { message: 'Cadastro realizado com sucesso! Faça login para continuar.' } });
        } catch (err) {
            if (err instanceof AxiosError && err.response) {
                setApiError(err.response.data.message || 'Erro ao realizar cadastro.');
            } else {
                setApiError('Erro inesperado ao tentar realizar cadastro.');
            }
        }
    };

    return {
        register,
        handleSubmit: handleSubmit(handleRegister),
        errors,
        isSubmitting,
        apiError,
        getValues
    };
}
