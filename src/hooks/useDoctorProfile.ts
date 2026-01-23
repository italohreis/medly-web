import { useState, useCallback } from 'react';
import { doctorService } from '../services/doctorService';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import type { Doctor } from '../types/entities';

interface DoctorProfileUpdateData {
    name?: string;
    email?: string;
    specialty?: string;
}

interface UseDoctorProfileReturn {
    doctor: Doctor | null;
    loading: boolean;
    updating: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: DoctorProfileUpdateData) => Promise<boolean>;
}

export function useDoctorProfile(): UseDoctorProfileReturn {
    const { user, loadProfile } = useAuth();
    const { showToast } = useToast();
    
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const doctorId = user?.profile?.doctorProfile?.doctorId;

    const fetchProfile = useCallback(async () => {
        if (!doctorId) {
            setLoading(false);
            setError('ID do médico não encontrado.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await doctorService.getDoctorById(doctorId);
            setDoctor(data);
        } catch (err) {
            const message = err instanceof Error 
                ? err.message 
                : 'Erro ao carregar perfil.';
            setError(message);
            showToast('Não foi possível carregar seu perfil.', 'error');
        } finally {
            setLoading(false);
        }
    }, [doctorId, showToast]);

    const updateProfile = async (data: DoctorProfileUpdateData): Promise<boolean> => {
        if (!doctorId) {
            showToast('ID do médico não encontrado.', 'error');
            return false;
        }

        setUpdating(true);

        try {
            const updatedDoctor = await doctorService.updateDoctor(doctorId, data);
            setDoctor(updatedDoctor);
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
        doctor,
        loading,
        updating,
        error,
        fetchProfile,
        updateProfile
    };
}
