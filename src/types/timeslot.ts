export type AvailabilityStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED';

export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    status: AvailabilityStatus;
    doctor: {
        id: string;
        name: string;
        specialty: string;
    };
}

export interface CreateAppointmentRequest {
    timeSlotId: string;
    patientId: string;
}
