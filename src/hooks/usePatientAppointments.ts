import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';
import type { Appointment } from '../types/entities';
import type { AppointmentStatus } from '../types/common';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

export type FilterStatus = AppointmentStatus | 'ALL';

interface UsePatientAppointmentsOptions {
    pageSize?: number;
}

export function usePatientAppointments(options: UsePatientAppointmentsOptions = {}) {
    const { pageSize = 10 } = options;
    const { user } = useAuth();
    const { showToast } = useToast();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
    const [currentPage, setCurrentPage] = useState(0);

    const patientId = user?.profile?.patientProfile?.patientId;

    const fetchAppointments = useCallback(async () => {
        if (!patientId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const response = await appointmentService.getAppointments({ 
                patientId,
                size: 100 
            });
            setAppointments(response.content);
        } catch (error) {
            console.error(error);
            showToast('Falha ao carregar suas consultas.', 'error');
        } finally {
            setLoading(false);
        }
    }, [patientId, showToast]);

    const handleCancelAppointment = async (appointmentId: string) => {
        try {
            await appointmentService.cancelAppointment(appointmentId);
            showToast('Consulta cancelada com sucesso.', 'success');
            fetchAppointments();
        } catch {
            showToast('Não foi possível cancelar a consulta.', 'error');
        }
    };

    const handleFilterChange = (status: FilterStatus) => {
        setStatusFilter(status);
        setCurrentPage(0);
    };

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const filteredAppointments = statusFilter === 'ALL'
        ? appointments
        : appointments.filter(apt => apt.status === statusFilter);

    const paginatedAppointments = filteredAppointments.slice(
        currentPage * pageSize,
        (currentPage + 1) * pageSize
    );

    const totalPages = Math.ceil(filteredAppointments.length / pageSize);

    const statusCounts: Record<FilterStatus, number> = {
        ALL: appointments.length,
        SCHEDULED: appointments.filter(a => a.status === 'SCHEDULED').length,
        COMPLETED: appointments.filter(a => a.status === 'COMPLETED').length,
        CANCELLED: appointments.filter(a => a.status === 'CANCELLED').length
    };

    return {
        appointments: paginatedAppointments,
        allAppointments: appointments,
        filteredAppointments,
        statusFilter,
        statusCounts,
        currentPage,
        totalPages,
        loading,
        handleFilterChange,
        handleCancelAppointment,
        setCurrentPage,
        refetch: fetchAppointments
    };
}
