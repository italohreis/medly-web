import { useState } from 'react';
import { doctorService } from '../services/doctorService';
import type { CreateAppointmentRequest } from '../types/timeslot';
import { useToast } from './useToast';

interface UseCreateAppointmentReturn {
    isCreating: boolean;
    error: string | null;
    createAppointment: (data: CreateAppointmentRequest) => Promise<boolean>;
    clearError: () => void;
}

export function useCreateAppointment(onSuccess?: () => void): UseCreateAppointmentReturn {
    const { showToast } = useToast();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createAppointment = async (data: CreateAppointmentRequest): Promise<boolean> => {
        setIsCreating(true);
        setError(null);

        try {
            await doctorService.createAppointment(data);
            showToast('Consulta criada com sucesso!', 'success');
            onSuccess?.();
            return true;
        } catch (err) {
            const message = err instanceof Error 
                ? err.message 
                : 'Erro ao criar consulta. Tente novamente.';
            setError(message);
            showToast(message, 'error');
            return false;
        } finally {
            setIsCreating(false);
        }
    };

    const clearError = () => setError(null);

    return {
        isCreating,
        error,
        createAppointment,
        clearError
    };
}
