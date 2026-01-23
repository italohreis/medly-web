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
