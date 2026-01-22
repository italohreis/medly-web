import { useState, useCallback } from 'react';
import { doctorService } from '../services/doctorService';
import type { TimeSlot } from '../types/entities';
import { useAuth } from './useAuth';

interface UseAvailableTimeSlotsReturn {
    timeSlots: TimeSlot[];
    loading: boolean;
    error: string | null;
    fetchTimeSlots: (startDate: string, endDate: string) => Promise<void>;
}

export function useAvailableTimeSlots(): UseAvailableTimeSlotsReturn {
    const { user } = useAuth();
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const doctorId = user?.profile?.doctorProfile?.doctorId;

    const fetchTimeSlots = useCallback(async (startDate: string, endDate: string) => {
        if (!doctorId) {
            setError('ID do médico não encontrado.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await doctorService.getAvailableTimeSlots(doctorId, startDate, endDate);
            setTimeSlots(data.content);
        } catch (err) {
            const message = err instanceof Error 
                ? err.message 
                : 'Erro ao carregar horários disponíveis.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [doctorId]);

    return {
        timeSlots,
        loading,
        error,
        fetchTimeSlots
    };
}
