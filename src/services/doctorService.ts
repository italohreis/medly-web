import { api } from './api';
import type { AvailabilityWindow, Appointment, TimeSlot, CreateAppointmentRequest } from '../types/entities';
import type { PaginatedResponse } from '../types/common';

const getMyAppointments = async (doctorId: string): Promise<PaginatedResponse<Appointment>> => {
    const { data } = await api.get<PaginatedResponse<Appointment>>('/appointments', {
        params: { doctorId }
    });
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

const getAvailabilityWindows = async (doctorId: string): Promise<PaginatedResponse<AvailabilityWindow>> => {
    const { data } = await api.get<PaginatedResponse<AvailabilityWindow>>('/schedule/windows', {
        params: { 
            doctorId, 
            sort: 'startTime,asc' 
        }
    });
    return data;
};

const createAvailabilityWindow = async (doctorId: string, window: Omit<AvailabilityWindow, 'id'>): Promise<AvailabilityWindow> => {
    const { data } = await api.post<AvailabilityWindow>('/schedule/windows', {
        ...window,
        doctorId
    });
    return data;
};

const deleteAvailabilityWindow = async (id: string): Promise<void> => {
    await api.delete(`/schedule/windows/${id}`);
};

const getAvailableTimeSlots = async (
    doctorId: string, 
    startDate: string, 
    endDate: string
): Promise<PaginatedResponse<TimeSlot>> => {
    const { data } = await api.get<PaginatedResponse<TimeSlot>>('/schedule/timeslots/search', {
        params: { 
            doctorId, 
            startDate, 
            endDate,
            size: 50 
        }
    });
    return data;
};

const createAppointment = async (request: CreateAppointmentRequest): Promise<Appointment> => {
    const { data } = await api.post<Appointment>('/appointments', request);
    return data;
};

export const doctorService = {
    getMyAppointments,
    completeAppointment,
    cancelAppointment,
    getAvailabilityWindows,
    createAvailabilityWindow,
    deleteAvailabilityWindow,
    getAvailableTimeSlots,
    createAppointment
};