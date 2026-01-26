import type { Appointment } from '../../types/entities';
import { APPOINTMENT_STATUS_CONFIG } from '../../types/common';
import { formatLocalDateTime } from '../../utils';

interface AppointmentCardProps {
    appointment: Appointment;
    onStatusChange?: (id: string, status: 'COMPLETED' | 'CANCELLED') => void;
    showActions?: boolean;
}

export function AppointmentCard({ appointment, onStatusChange, showActions = true }: AppointmentCardProps) {
    const status = APPOINTMENT_STATUS_CONFIG[appointment.status];

    return (
        <div className="p-4 hover:bg-medical-50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-success-100 flex items-center justify-center text-success-700 font-bold">
                        {appointment.patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-medical-900">{appointment.patient.name}</h3>
                        <p className="text-sm text-medical-500 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatLocalDateTime(appointment.startTime)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgClass} ${status.textClass}`}>
                        {status.label}
                    </span>
                    {showActions && appointment.status === 'SCHEDULED' && onStatusChange && (
                        <div className="flex gap-1">
                            <button
                                onClick={() => onStatusChange(appointment.id, 'COMPLETED')}
                                className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                                title="Finalizar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onStatusChange(appointment.id, 'CANCELLED')}
                                className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                title="Cancelar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
