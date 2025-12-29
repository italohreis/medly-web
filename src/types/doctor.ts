
export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface Appointment {
    id: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    doctor: {
        id: string;
        name: string;
        specialty: string;
    };
    patient: {
        id: string;
        name: string;
        email: string;
    };
}

export interface AvailabilityWindow {
    id?: string;
    startTime: string;
    endTime: string;
    slotDurationInMinutes: number;
    status?: 'ACTIVE' | 'INACTIVE';
}