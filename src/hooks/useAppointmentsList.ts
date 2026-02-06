import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';
import { useToast } from './useToast';
import type { Appointment } from '../types/entities';
import type { PaginatedResponse } from '../types/common';

interface UseAppointmentsListOptions {
    pageSize?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
}

export function useAppointmentsList(options: UseAppointmentsListOptions = {}) {
    const { pageSize = 10, status, startDate, endDate } = options;
    const { showToast } = useToast();
    const [data, setData] = useState<PaginatedResponse<Appointment> | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await appointmentService.getAppointments({
                page: currentPage,
                size: pageSize,
                status: status || undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
            });
            setData(response);
        } catch (error) {
            console.error('Erro ao carregar consultas', error);
            showToast('Não foi possível carregar a lista de consultas.', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, status, startDate, endDate, showToast]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const deleteAppointment = async (id: string) => {
        try {
            await appointmentService.deleteAppointment(id);
            showToast('Consulta excluída com sucesso.', 'success');
            fetchAppointments();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Não foi possível excluir a consulta.';
            showToast(message, 'error');
        }
    };

    return {
        appointments: data?.content || [],
        totalPages: data?.page?.totalPages || 0,
        totalElements: data?.page?.totalElements || 0,
        currentPage,
        loading,
        setCurrentPage,
        deleteAppointment,
        refetch: fetchAppointments
    };
}
