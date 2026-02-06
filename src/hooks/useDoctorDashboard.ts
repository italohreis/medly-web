import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';
import { scheduleService } from '../services/scheduleService';
import type { Appointment, AvailabilityWindow } from '../types/entities';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

interface UseDoctorDashboardOptions {
  startDate?: string;
  endDate?: string;
}

export function useDoctorDashboard(options: UseDoctorDashboardOptions = {}) {
  const { startDate, endDate } = options;
  const { user } = useAuth();
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [loading, setLoading] = useState(true);

  const doctorId = user?.profile?.doctorProfile?.doctorId;

  const fetchDashboardData = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [appointmentsRes, windowsRes] = await Promise.all([
        appointmentService.getAppointments({
          doctorId,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        }),
        scheduleService.getAvailabilityWindows(doctorId)
      ]);

      setAppointments(appointmentsRes.content);
      setWindows(windowsRes.content);

    } catch (error) {
      console.error(error);
      showToast('Falha ao carregar dados do painel.', 'error');
    } finally {
      setLoading(false);
    }
  }, [doctorId, startDate, endDate, showToast]);

  const handleStatusChange = async (appointmentId: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
    try {
      if (newStatus === 'COMPLETED') {
        await appointmentService.completeAppointment(appointmentId);
      } else {
        await appointmentService.cancelAppointment(appointmentId);
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
      await scheduleService.createAvailabilityWindow(doctorId, data);
      showToast('Nova janela de horário criada.', 'success');
      fetchDashboardData();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Conflito de horários ou dados inválidos.';
      showToast(message, 'error');
    }
  };

  const handleDeleteWindow = async (id: string) => {
    try {
      await scheduleService.deleteAvailabilityWindow(id);
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
    refetch: fetchDashboardData,
    userName: user?.profile?.name
  };
}