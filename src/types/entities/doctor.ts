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

export interface AvailabilityWindow {
    id?: string;
    startTime: string;
    endTime: string;
    slotDurationInMinutes: number;
    status?: 'ACTIVE' | 'INACTIVE';
}
