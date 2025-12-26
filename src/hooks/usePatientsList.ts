import { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from './useToast';
import type { Patient, PaginatedResponse } from '../types/admin';

export function usePatientsList(pageSize: number = 10) {
    const { showToast } = useToast();
    const [data, setData] = useState<PaginatedResponse<Patient> | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        async function fetchPatients() {
            setLoading(true);
            try {
                const response = await adminService.getPatients(currentPage, pageSize);
                setData(response);
            } catch (error) {
                console.error('Erro ao carregar pacientes', error);
                showToast('Não foi possível carregar a lista de pacientes.', 'error');
            } finally {
                setLoading(false);
            }
        }

        fetchPatients();
    }, [currentPage, pageSize, showToast]);

    return {
        patients: data?.content || [],
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
        currentPage,
        loading,
        setCurrentPage
    };
}
