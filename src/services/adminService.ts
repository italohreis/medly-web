import { api } from './api';
import type { DashboardStats, Doctor, Patient, Appointment, PaginatedResponse } from '../types/admin';

const getDashboardStats = async (): Promise<DashboardStats> => {
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
};

const getRecentDoctors = async (limit: number = 5): Promise<Doctor[]> => {
    const response = await api.get<PaginatedResponse<Doctor>>(
        `/doctors?size=${limit}&sort=id,desc`
    );
    return response.data.content;
};

const getRecentPatients = async (limit: number = 5): Promise<Patient[]> => {
    const response = await api.get<PaginatedResponse<Patient>>(
        `/patients?size=${limit}&sort=id,desc`
    );
    return response.data.content;
};

const getDoctors = async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Doctor>> => {
    const response = await api.get<PaginatedResponse<Doctor>>(
        `/doctors?page=${page}&size=${size}&sort=id,desc`
    );
    return response.data;
};

const getPatients = async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Patient>> => {
    const response = await api.get<PaginatedResponse<Patient>>(
        `/patients?page=${page}&size=${size}&sort=id,desc`
    );
    return response.data;
};

const getAppointments = async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Appointment>> => {
    const response = await api.get<PaginatedResponse<Appointment>>(
        `/appointments?page=${page}&size=${size}&sort=id,desc`
    );
    return response.data;
};

const createDoctor = async (data: Omit<Doctor, 'id'>): Promise<Doctor> => {
    const response = await api.post<Doctor>('/doctors', data);
    return response.data;
};

const updateDoctor = async (id: string, data: Partial<Pick<Doctor, 'name' | 'email' | 'specialty'>>): Promise<Doctor> => {
    const response = await api.put<Doctor>(`/doctors/${id}`, data);
    return response.data;
};

const deleteDoctor = async (id: string): Promise<void> => {
    await api.delete(`/doctors/${id}`);
};

export const adminService = {
    getDashboardStats,
    getRecentDoctors,
    getRecentPatients,
    getDoctors,
    getPatients,
    getAppointments,
    createDoctor,
    updateDoctor,
    deleteDoctor
};
