import { useState, useEffect, useCallback } from 'react';
import { patientService } from '../services/patientService';
import type { Patient } from '../types/entities';

interface UsePatientsReturn {
    patients: Patient[];
    loading: boolean;
    error: string | null;
    searchPatients: (query: string) => void;
}

export function usePatients(): UsePatientsReturn {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = useCallback(async (name?: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await patientService.getPatients({ size: 100, name });
            setPatients(data.content);
        } catch (err) {
            const message = err instanceof Error 
                ? err.message 
                : 'Erro ao carregar pacientes.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const searchPatients = useCallback((query: string) => {
        fetchPatients(query || undefined);
    }, [fetchPatients]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    return {
        patients,
        loading,
        error,
        searchPatients
    };
}
