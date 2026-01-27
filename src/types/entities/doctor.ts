import type { AvailabilityStatus } from '../common';

export interface DoctorSummary {
    id: string;
    name: string;
    specialty?: string;
    crm?: string;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    crm: string;
    email?: string;
}

export interface DoctorUpdateData {
    name?: string;
    specialty?: string;
    email?: string;
}

export interface WindowTimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    status: AvailabilityStatus;
}

export interface AvailabilityWindow {
    id?: string;
    startTime: string;
    endTime: string;
    slotDurationInMinutes: number;
    status?: 'ACTIVE' | 'INACTIVE';
    doctor?: DoctorSummary;
    timeSlots?: WindowTimeSlot[];
}
