import { api } from './api';
import type { AvailabilityWindow, Appointment } from '../types/doctor';
import type { PaginatedResponse } from '../types/admin';

export const doctorService = {
    getMyAppointments: async (doctorId: string): Promise<PaginatedResponse<Appointment>> => {
        const { data } = await api.get<PaginatedResponse<Appointment>>('/appointments', {
            params: { doctorId }
        });
        return data;
    },

    completeAppointment: async (id: string): Promise<Appointment> => {
        const { data } = await api.patch<Appointment>(`/appointments/${id}/complete`);
        return data;
    },

    cancelAppointment: async (id: string): Promise<Appointment> => {
        const { data } = await api.patch<Appointment>(`/appointments/${id}/cancel`);
        return data;
    },

    getAvailabilityWindows: async (doctorId: string): Promise<PaginatedResponse<AvailabilityWindow>> => {
        const { data } = await api.get<PaginatedResponse<AvailabilityWindow>>('/schedule/windows', {
            params: { doctorId }
        });
        return data;
    },

    createAvailabilityWindow: async (doctorId: string, window: Omit<AvailabilityWindow, 'id'>): Promise<AvailabilityWindow> => {
        const { data } = await api.post<AvailabilityWindow>('/schedule/windows', {
            ...window,
            doctorId
        });
        return data;
    },

    deleteAvailabilityWindow: async (id: string): Promise<void> => {
        await api.delete(`/schedule/windows/${id}`);
    }
};