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
