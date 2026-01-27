import { useState, useCallback } from 'react';
import { patientService } from '../services/patientService';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import type { Patient } from '../types/entities';
import type { UpdatePatientData } from '../types/entities';

interface UsePatientProfileReturn {
    patient: Patient | null;
    loading: boolean;
    updating: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: UpdatePatientData) => Promise<boolean>;
}

export function usePatientProfile(): UsePatientProfileReturn {
    const { user, loadProfile } = useAuth();
    const { showToast } = useToast();
    
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const patientId = user?.profile?.patientProfile?.patientId;

    const fetchProfile = useCallback(async () => {
        if (!patientId) {
            setLoading(false);
            setError('ID do paciente não encontrado.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await patientService.getPatientById(patientId);
            setPatient(data);
        } catch (err) {
            const message = err instanceof Error 
                ? err.message 
                : 'Erro ao carregar perfil.';
            setError(message);
            showToast('Não foi possível carregar seu perfil.', 'error');
        } finally {
            setLoading(false);
        }
    }, [patientId, showToast]);

    const updateProfile = async (data: UpdatePatientData): Promise<boolean> => {
        if (!patientId) {
            showToast('ID do paciente não encontrado.', 'error');
            return false;
        }

        setUpdating(true);

        try {
            const updatedPatient = await patientService.updatePatient(patientId, data);
            setPatient(updatedPatient);
            showToast('Perfil atualizado com sucesso!', 'success');
            
            await loadProfile();
            
            return true;
        } catch (err) {
            const message = err instanceof Error 
                ? err.message 
                : 'Erro ao atualizar perfil.';
            showToast(message, 'error');
            return false;
        } finally {
            setUpdating(false);
        }
    };

    return {
        patient,
        loading,
        updating,
        error,
        fetchProfile,
        updateProfile
    };
}
