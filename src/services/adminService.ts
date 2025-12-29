import { api } from './api';
import type { DashboardStats, Doctor, Patient, Appointment, PaginatedResponse } from '../types/admin';

export const adminService = {
    async getDashboardStats(): Promise<DashboardStats> {
        const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
            api.get<PaginatedResponse<Doctor>>('/doctors?size=1'),
            api.get<PaginatedResponse<Patient>>('/patients?size=1'),
            api.get<PaginatedResponse<Appointment>>('/appointments?size=1')
        ]);

        return {
            doctors: doctorsRes.data.page.totalElements,
            patients: patientsRes.data.page.totalElements,
            appointments: appointmentsRes.data.page.totalElements
        };
    },

    async getRecentDoctors(limit: number = 5): Promise<Doctor[]> {
        const response = await api.get<PaginatedResponse<Doctor>>(
            `/doctors?size=${limit}&sort=id,desc`
        );
        return response.data.content;
    },

    async getRecentPatients(limit: number = 5): Promise<Patient[]> {
        const response = await api.get<PaginatedResponse<Patient>>(
            `/patients?size=${limit}&sort=id,desc`
        );
        return response.data.content;
    },

    async getDoctors(page: number = 0, size: number = 10): Promise<PaginatedResponse<Doctor>> {
        const response = await api.get<PaginatedResponse<Doctor>>(
            `/doctors?page=${page}&size=${size}&sort=id,desc`
        );
        return response.data;
    },

    async getPatients(page: number = 0, size: number = 10): Promise<PaginatedResponse<Patient>> {
        const response = await api.get<PaginatedResponse<Patient>>(
            `/patients?page=${page}&size=${size}&sort=id,desc`
        );
        return response.data;
    },

    async getAppointments(page: number = 0, size: number = 10): Promise<PaginatedResponse<Appointment>> {
        const response = await api.get<PaginatedResponse<Appointment>>(
            `/appointments?page=${page}&size=${size}&sort=id,desc`
        );
        return response.data;
    },

    async createDoctor(data: Omit<Doctor, 'id'>): Promise<Doctor> {
        const response = await api.post<Doctor>('/doctors', data);
        return response.data;
    },

    async updateDoctor(id: string, data: Partial<Pick<Doctor, 'name' | 'email' | 'specialty'>>): Promise<Doctor> {
        const response = await api.put<Doctor>(`/doctors/${id}`, data);
        return response.data;
    },

    async deleteDoctor(id: string): Promise<void> {
        await api.delete(`/doctors/${id}`);
    }
};
