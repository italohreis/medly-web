import { api } from './api';
import type { AvailabilityWindow, TimeSlot } from '../types/entities';
import type { AvailabilityStatus, PaginatedResponse } from '../types/common';

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

const updateTimeSlotStatus = async (id: string, status: AvailabilityStatus): Promise<TimeSlot> => {
    const { data } = await api.patch<TimeSlot>(`/schedule/timeslots/${id}`, { status });
    return data;
};


interface SearchTimeSlotsParams {
    doctorId?: string;
    specialty?: string;
    startDate: string;
    endDate: string;
}

const searchAvailableTimeSlots = async (params: SearchTimeSlotsParams): Promise<PaginatedResponse<TimeSlot>> => {
    const { data } = await api.get<PaginatedResponse<TimeSlot>>('/schedule/timeslots/search', {
        params: { 
            ...params,
            size: 50 
        }
    });
    return data;
};

export const scheduleService = {
    getAvailabilityWindows,
    createAvailabilityWindow,
    deleteAvailabilityWindow,
    updateTimeSlotStatus,
    searchAvailableTimeSlots
};
