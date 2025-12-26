export interface DashboardStats {
    doctors: number;
    patients: number;
    appointments: number;
}

export interface Doctor {
    id: number;
    name: string;
    specialty: string;
    crm: string;
    email?: string;
}

export interface Patient {
    id: number;
    name: string;
    email: string;
    phone?: string;
}

export interface Appointment {
    id: string;
    status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
    startTime: string;
    endTime: string;
    doctor: {
        id: string;
        name: string;
        crm: string;
    };
    patient: {
        id: string;
        name: string;
    };
}

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}
