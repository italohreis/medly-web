import { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import { useToast } from './useToast';
import type { Patient } from '../types/entities';
import type { PaginatedResponse } from '../types/common';

export function usePatientsList(pageSize: number = 10) {
    const { showToast } = useToast();
    const [data, setData] = useState<PaginatedResponse<Patient> | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        async function fetchPatients() {
            setLoading(true);
            try {
                const response = await patientService.getPatients({ page: currentPage, size: pageSize });
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
        totalPages: data?.page?.totalPages || 0,
        totalElements: data?.page?.totalElements || 0,
        currentPage,
        loading,
        setCurrentPage
    };
}
