import { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { useToast } from './useToast';
import type { Doctor, Patient } from '../types/entities';
import type { DashboardStats } from '../types/admin';

export function useAdminDashboard() {
    const { showToast } = useToast();
    const [stats, setStats] = useState<DashboardStats>({
        doctors: 0,
        patients: 0,
        appointments: 0
    });
    const [recentDoctors, setRecentDoctors] = useState<Doctor[]>([]);
    const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            try {
                const [statsData, doctorsData, patientsData] = await Promise.all([
                    adminService.getDashboardStats(),
                    adminService.getRecentDoctors(5),
                    adminService.getRecentPatients(5)
                ]);

                setStats(statsData);
                setRecentDoctors(doctorsData);
                setRecentPatients(patientsData);
            } catch (error) {
                console.error('Erro ao carregar dashboard', error);
                showToast('Não foi possível carregar os dados do painel.', 'error');
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [showToast]);

    return {
        stats,
        recentDoctors,
        recentPatients,
        loading
    };
}
