export interface PaginatedResponse<T> {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}

export type AppointmentStatus = 'SCHEDULED' | 'CANCELLED' | 'COMPLETED';

export type AvailabilityStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';

export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export type Specialty = 
    | 'CARDIOLOGY' 
    | 'DERMATOLOGY' 
    | 'NEUROLOGY' 
    | 'PEDIATRICS' 
    | 'PSYCHIATRY' 
    | 'RADIOLOGY' 
    | 'SURGERY';

export const SPECIALTIES: { value: Specialty; label: string }[] = [
    { value: 'CARDIOLOGY', label: 'Cardiologia' },
    { value: 'DERMATOLOGY', label: 'Dermatologia' },
    { value: 'NEUROLOGY', label: 'Neurologia' },
    { value: 'PEDIATRICS', label: 'Pediatria' },
    { value: 'PSYCHIATRY', label: 'Psiquiatria' },
    { value: 'RADIOLOGY', label: 'Radiologia' },
    { value: 'SURGERY', label: 'Cirurgia' }
];

export function getSpecialtyLabel(specialty: string | undefined | null): string {
    if (!specialty) return '-';
    return SPECIALTIES.find(s => s.value === specialty)?.label || specialty;
}

export interface AppointmentStatusStyle {
    label: string;
    bgClass: string;
    textClass: string;
}

export const APPOINTMENT_STATUS_CONFIG: Record<AppointmentStatus, AppointmentStatusStyle> = {
    SCHEDULED: { label: 'Agendada', bgClass: 'bg-primary-100', textClass: 'text-primary-700' },
    COMPLETED: { label: 'Realizada', bgClass: 'bg-success-100', textClass: 'text-success-700' },
    CANCELLED: { label: 'Cancelada', bgClass: 'bg-danger-100', textClass: 'text-danger-700' }
};
