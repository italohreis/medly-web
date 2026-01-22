import type { AvailabilityStatus } from '../common';
import type { DoctorSummary } from './doctor';

export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    status: AvailabilityStatus;
    doctor: DoctorSummary;
}
