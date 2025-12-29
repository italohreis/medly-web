import { useState, useEffect, useCallback } from 'react';
import { doctorService } from '../services/doctorService';
import type { Appointment, AvailabilityWindow } from '../types/doctor';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

export function useDoctorDashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    const doctorId = user?.profile?.doctorProfile?.doctorId;
    if (!doctorId) return;

    try {
      setLoading(true);
      const [appointmentsRes, windowsRes] = await Promise.all([
        doctorService.getMyAppointments(doctorId),
        doctorService.getAvailabilityWindows(doctorId)
      ]);

      setAppointments(appointmentsRes.content);
      setWindows(windowsRes.content);

    } catch (error) {
      console.error(error);
      showToast('Falha ao carregar dados do painel.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user?.profile?.doctorProfile?.doctorId, showToast]);

  const handleStatusChange = async (appointmentId: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
    try {
      if (newStatus === 'COMPLETED') {
        await doctorService.completeAppointment(appointmentId);
      } else {
        await doctorService.cancelAppointment(appointmentId);
      }
      showToast('Status atualizado.', 'success');
      fetchDashboardData();
    } catch {
      showToast('Não foi possível atualizar o status.', 'error');
    }
  };

  const handleAddWindow = async (data: Omit<AvailabilityWindow, 'id'>) => {
    const doctorId = user?.profile?.doctorProfile?.doctorId;
    if (!doctorId) return;
    
    try {
      await doctorService.createAvailabilityWindow(doctorId, data);
      showToast('Nova janela de horário criada.', 'success');
      fetchDashboardData();
    } catch {
      showToast('Conflito de horários ou dados inválidos.', 'error');
    }
  };

  const handleDeleteWindow = async (id: string) => {
    try {
      await doctorService.deleteAvailabilityWindow(id);
      showToast('Janela de horário removida.', 'success');
      fetchDashboardData();
    } catch {
      showToast('Não foi possível remover a janela.', 'error');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    appointments,
    windows,
    loading,
    handleStatusChange,
    handleAddWindow,
    handleDeleteWindow,
    userName: user?.profile?.name
  };
}