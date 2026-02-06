import { api } from './api';
import type { Appointment, CreateAppointmentRequest } from '../types/entities';
import type { PaginatedResponse } from '../types/common';

interface GetAppointmentsParams {
    page?: number;
    size?: number;
    doctorId?: string;
    patientId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}

const getAppointments = async (params: GetAppointmentsParams = {}): Promise<PaginatedResponse<Appointment>> => {
    const { page = 0, size = 10, ...filters } = params;
    const { data } = await api.get<PaginatedResponse<Appointment>>('/appointments', { 
        params: { page, size, sort: 'id,desc', ...filters } 
    });
    return data;
};

const getAppointmentById = async (id: string): Promise<Appointment> => {
    const { data } = await api.get<Appointment>(`/appointments/${id}`);
    return data;
};

const createAppointment = async (request: CreateAppointmentRequest): Promise<Appointment> => {
    const { data } = await api.post<Appointment>('/appointments', request);
    return data;
};

const completeAppointment = async (id: string): Promise<Appointment> => {
    const { data } = await api.patch<Appointment>(`/appointments/${id}/complete`);
    return data;
};

const cancelAppointment = async (id: string): Promise<Appointment> => {
    const { data } = await api.patch<Appointment>(`/appointments/${id}/cancel`);
    return data;
};

const deleteAppointment = async (id: string): Promise<void> => {
    await api.delete(`/appointments/${id}`);
};

export const appointmentService = {
    getAppointments,
    getAppointmentById,
    createAppointment,
    completeAppointment,
    cancelAppointment,
    deleteAppointment
};
