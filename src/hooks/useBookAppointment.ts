import { useState, useCallback } from 'react';
import { scheduleService } from '../services/scheduleService';
import { appointmentService } from '../services/appointmentService';
import type { TimeSlot } from '../types/entities';
import type { Specialty } from '../types/common';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

interface SearchFilters {
    specialty?: Specialty;
    doctorId?: string;
    startDate: string;
    endDate: string;
}

export function useBookAppointment() {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [loading, setLoading] = useState(false);
    const [booking, setBooking] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const patientId = user?.profile?.patientProfile?.patientId;

    const searchTimeSlots = useCallback(async (filters: SearchFilters) => {
        try {
            setLoading(true);
            setHasSearched(true);

            const response = await scheduleService.searchAvailableTimeSlots({
                specialty: filters.specialty,
                doctorId: filters.doctorId,
                startDate: filters.startDate,
                endDate: filters.endDate
            });

            const availableSlots = response.content.filter(slot => slot.status === 'AVAILABLE');
            setTimeSlots(availableSlots);

            if (availableSlots.length === 0) {
                showToast('Nenhum horário disponível encontrado.', 'info');
            }
        } catch (error) {
            console.error(error);
            showToast('Erro ao buscar horários disponíveis.', 'error');
            setTimeSlots([]);
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const bookAppointment = async (timeSlotId: string): Promise<boolean> => {
        if (!patientId) {
            showToast('Erro ao identificar paciente.', 'error');
            return false;
        }

        try {
            setBooking(true);
            await appointmentService.createAppointment({
                timeSlotId,
                patientId
            });
            showToast('Consulta agendada com sucesso!', 'success');
            return true;
        } catch (error) {
            console.error(error);
            showToast('Não foi possível agendar a consulta.', 'error');
            return false;
        } finally {
            setBooking(false);
        }
    };

    const clearResults = () => {
        setTimeSlots([]);
        setHasSearched(false);
    };

    return {
        timeSlots,
        loading,
        booking,
        hasSearched,
        searchTimeSlots,
        bookAppointment,
        clearResults
    };
}
