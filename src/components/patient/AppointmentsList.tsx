import { useState } from 'react';
import type { Appointment } from '../../types/entities';
import { formatLocalDate, formatLocalTime } from '../../utils/date';
import { getSpecialtyLabel, APPOINTMENT_STATUS_CONFIG } from '../../types/common';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface AppointmentsListProps {
    appointments: Appointment[];
    onCancel: (id: string) => void;
}

interface ConfirmationState {
    isOpen: boolean;
    appointmentId: string | null;
    doctorName: string;
}

function groupByDate(appointments: Appointment[]): Map<string, Appointment[]> {
    const groups = new Map<string, Appointment[]>();
    
    appointments.forEach(apt => {
        const dateKey = apt.startTime ? formatLocalDate(apt.startTime) : 'Sem data';
        const existing = groups.get(dateKey) || [];
        groups.set(dateKey, [...existing, apt]);
    });

    return groups;
}

function getRelativeDateLabel(dateStr: string): string | null {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayStr = formatLocalDate(today.toISOString());
    const tomorrowStr = formatLocalDate(tomorrow.toISOString());

    if (dateStr === todayStr) return 'Hoje';
    if (dateStr === tomorrowStr) return 'Amanhã';
    return null;
}

export function AppointmentsList({ appointments, onCancel }: AppointmentsListProps) {
    const groupedAppointments = groupByDate(appointments);
    const [confirmation, setConfirmation] = useState<ConfirmationState>({
        isOpen: false,
        appointmentId: null,
        doctorName: ''
    });

    const handleCancelClick = (appointmentId: string, doctorName: string) => {
        setConfirmation({
            isOpen: true,
            appointmentId,
            doctorName
        });
    };

    const handleConfirm = () => {
        if (confirmation.appointmentId) {
            onCancel(confirmation.appointmentId);
        }
        setConfirmation({ isOpen: false, appointmentId: null, doctorName: '' });
    };

    const handleClose = () => {
        setConfirmation({ isOpen: false, appointmentId: null, doctorName: '' });
    };

    return (
        <>
            <div className="space-y-6">
                {Array.from(groupedAppointments.entries()).map(([date, dayAppointments]) => {
                    const relativeLabel = getRelativeDateLabel(date);
                    
                    return (
                        <div key={date}>
                            {/* Header do grupo por data */}
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold text-medical-900">{date}</span>
                                    {relativeLabel && (
                                        <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                                            {relativeLabel}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 h-px bg-medical-200"></div>
                            </div>

                            {/* Cards de consulta */}
                            <div className="space-y-3">
                                {dayAppointments.map(appointment => (
                                    <AppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                        onCancelClick={handleCancelClick}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title="Cancelar Consulta"
                message={`Tem certeza que deseja cancelar a consulta com Dr(a). ${confirmation.doctorName}? Esta ação não pode ser desfeita.`}
                confirmText="Cancelar Consulta"
                variant="danger"
            />
        </>
    );
}

interface AppointmentCardProps {
    appointment: Appointment;
    onCancelClick: (id: string, doctorName: string) => void;
}

function AppointmentCard({ appointment, onCancelClick }: AppointmentCardProps) {
    const status = APPOINTMENT_STATUS_CONFIG[appointment.status];
    const canCancel = appointment.status === 'SCHEDULED';

    return (
        <div className="bg-white rounded-xl border border-medical-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                {/* Avatar do Médico */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {appointment.doctor.name.charAt(0).toUpperCase()}
                </div>

                {/* Informações principais */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-semibold text-medical-900">
                                Dr(a). {appointment.doctor.name}
                            </h3>
                            <p className="text-sm text-medical-500">
                                {getSpecialtyLabel(appointment.doctor.specialty)}
                            </p>
                        </div>

                        {/* Status Badge */}
                        <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${status.bgClass} ${status.textClass}`}>
                            {status.label}
                        </span>
                    </div>

                    {/* Horário e ações */}
                    <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-medical-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">
                                {formatLocalTime(appointment.startTime)}
                                {appointment.endTime && ` - ${formatLocalTime(appointment.endTime)}`}
                            </span>
                        </div>

                        {/* Ação de cancelar */}
                        {canCancel && (
                            <button
                                onClick={() => onCancelClick(appointment.id, appointment.doctor.name)}
                                className="text-sm text-danger-600 hover:text-danger-700 font-medium flex items-center gap-1 hover:bg-danger-50 px-2 py-1 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
