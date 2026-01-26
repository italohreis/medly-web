import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';
import type { Appointment } from '../types/entities';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

export function usePatientDashboard() {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const patientId = user?.profile?.patientProfile?.patientId;

    const fetchDashboardData = useCallback(async () => {
        if (!patientId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const appointmentsRes = await appointmentService.getAppointments({ patientId });
            setAppointments(appointmentsRes.content);
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
            fetchDashboardData();
        } catch {
            showToast('Não foi possível cancelar a consulta.', 'error');
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const scheduledAppointments = appointments.filter(a => a.status === 'SCHEDULED');
    const completedAppointments = appointments.filter(a => a.status === 'COMPLETED');
    const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED');

    const upcomingAppointments = scheduledAppointments
        .filter(apt => apt.startTime && new Date(apt.startTime) >= new Date())
        .sort((a, b) => new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime());

    const nextAppointment = upcomingAppointments[0] || null;

    return {
        appointments,
        scheduledAppointments,
        completedAppointments,
        cancelledAppointments,
        upcomingAppointments,
        nextAppointment,
        loading,
        handleCancelAppointment,
        refetch: fetchDashboardData
    };
}