import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from './useToast';
import type { Doctor, PaginatedResponse } from '../types/admin';

export function useDoctorsList(pageSize: number = 10) {
    const { showToast } = useToast();
    const [data, setData] = useState<PaginatedResponse<Doctor> | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getDoctors(currentPage, pageSize);
            setData(response);
        } catch (error) {
            console.error('Erro ao carregar médicos', error);
            showToast('Não foi possível carregar a lista de médicos.', 'error');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, showToast]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    return {
        doctors: data?.content || [],
        totalPages: data?.page?.totalPages || 0,
        totalElements: data?.page?.totalElements || 0,
        currentPage,
        loading,
        setCurrentPage,
        refetch: fetchDoctors
    };
}
