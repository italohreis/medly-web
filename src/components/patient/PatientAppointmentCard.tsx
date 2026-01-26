import type { Appointment } from '../../types/entities';
import { formatLocalDateTime } from '../../utils/date';
import { APPOINTMENT_STATUS_CONFIG, getSpecialtyLabel } from '../../types/common';

interface PatientAppointmentCardProps {
    appointment: Appointment;
    onCancel?: (id: string) => void;
    showActions?: boolean;
}

export function PatientAppointmentCard({ appointment, onCancel, showActions = true }: PatientAppointmentCardProps) {
    const status = APPOINTMENT_STATUS_CONFIG[appointment.status];
    const specialtyLabel = getSpecialtyLabel(appointment.doctor.specialty);

    const canCancel = appointment.status === 'SCHEDULED' && showActions;

    return (
        <div className="p-4 hover:bg-medical-50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Avatar do Médico */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold">
                        {appointment.doctor.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Informações */}
                    <div>
                        <p className="font-semibold text-medical-900">
                            Dr(a). {appointment.doctor.name}
                        </p>
                        <p className="text-sm text-medical-500">
                            {specialtyLabel}
                        </p>
                        <p className="text-sm text-medical-600 mt-1">
                            {formatLocalDateTime(appointment.startTime)}
                        </p>
                    </div>
                </div>

                {/* Status e Ações */}
                <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgClass} ${status.textClass}`}>
                        {status.label}
                    </span>

                    {canCancel && onCancel && (
                        <button
                            onClick={() => onCancel(appointment.id)}
                            className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                            title="Cancelar consulta"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}