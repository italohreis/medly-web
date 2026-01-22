import type { AppointmentStatus } from '../common';
import type { DoctorSummary } from './doctor';
import type { PatientSummary } from './patient';

export interface Appointment {
    id: string;
    startTime: string | null;
    endTime: string | null;
    status: AppointmentStatus;
    doctor: DoctorSummary;
    patient: PatientSummary & { email?: string };
}

export interface CreateAppointmentRequest {
    timeSlotId: string;
    patientId: string;
}
