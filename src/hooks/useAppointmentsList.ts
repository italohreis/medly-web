import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from './useToast';
import type { Appointment, PaginatedResponse } from '../types/admin';

export function useAppointmentsList(pageSize: number = 10) {
    const { showToast } = useToast();
    const [data, setData] = useState<PaginatedResponse<Appointment> | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        async function fetchAppointments() {
            setLoading(true);
            try {
                const response = await adminService.getAppointments(currentPage, pageSize);
                setData(response);
            } catch (error) {
                console.error('Erro ao carregar consultas', error);
                showToast('Não foi possível carregar a lista de consultas.', 'error');
            } finally {
                setLoading(false);
            }
        }

        fetchAppointments();
    }, [currentPage, pageSize, showToast]);

    return {
        appointments: data?.content || [],
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
        currentPage,
        loading,
        setCurrentPage
    };
}
