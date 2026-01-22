import { doctorService } from './doctorService';
import { patientService } from './patientService';
import { appointmentService } from './appointmentService';
import type { DashboardStats } from '../types/admin';

const getDashboardStats = async (): Promise<DashboardStats> => {
    const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        doctorService.getDoctors({ size: 1 }),
        patientService.getPatients({ size: 1 }),
        appointmentService.getAppointments({ size: 1 })
    ]);

    return {
        doctors: doctorsRes.page.totalElements,
        patients: patientsRes.page.totalElements,
        appointments: appointmentsRes.page.totalElements
    };
};

export const adminService = {
    getDashboardStats
};
