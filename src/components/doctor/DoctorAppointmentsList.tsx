import { useState } from 'react';
import type { Appointment } from '../../types/entities';
import { formatLocalDate, formatLocalTime } from '../../utils/date';
import { APPOINTMENT_STATUS_CONFIG } from '../../types/common';
import { calculateDurationInMinutes } from '../../utils';
import { ConfirmationModal, type ConfirmationVariant } from '../ui/ConfirmationModal';

interface DoctorAppointmentsListProps {
    appointments: Appointment[];
    onStatusChange: (id: string, status: 'COMPLETED' | 'CANCELLED') => void;
}

interface ConfirmationState {
    isOpen: boolean;
    appointmentId: string | null;
    action: 'COMPLETED' | 'CANCELLED' | null;
    patientName: string;
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

export function DoctorAppointmentsList({ appointments, onStatusChange }: DoctorAppointmentsListProps) {
    const groupedAppointments = groupByDate(appointments);
    const [confirmation, setConfirmation] = useState<ConfirmationState>({
        isOpen: false,
        appointmentId: null,
        action: null,
        patientName: ''
    });

    const handleActionClick = (appointmentId: string, action: 'COMPLETED' | 'CANCELLED', patientName: string) => {
        setConfirmation({
            isOpen: true,
            appointmentId,
            action,
            patientName
        });
    };

    const handleConfirm = () => {
        if (confirmation.appointmentId && confirmation.action) {
            onStatusChange(confirmation.appointmentId, confirmation.action);
        }
        setConfirmation({ isOpen: false, appointmentId: null, action: null, patientName: '' });
    };

    const handleClose = () => {
        setConfirmation({ isOpen: false, appointmentId: null, action: null, patientName: '' });
    };

    const getConfirmationConfig = (): { title: string; message: string; confirmText: string; variant: ConfirmationVariant } => {
        if (confirmation.action === 'COMPLETED') {
            return {
                title: 'Finalizar Consulta',
                message: `Tem certeza que deseja marcar a consulta com ${confirmation.patientName} como finalizada?`,
                confirmText: 'Finalizar',
                variant: 'success'
            };
        }
        return {
            title: 'Cancelar Consulta',
            message: `Tem certeza que deseja cancelar a consulta com ${confirmation.patientName}? Esta ação não pode ser desfeita.`,
            confirmText: 'Cancelar Consulta',
            variant: 'danger'
        };
    };

    const confirmConfig = getConfirmationConfig();

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
                                <span className="text-sm text-medical-500">
                                    {dayAppointments.length} consulta{dayAppointments.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            {/* Cards de consulta */}
                            <div className="space-y-3">
                                {dayAppointments.map(appointment => (
                                    <DoctorAppointmentCard
                                        key={appointment.id}
                                        appointment={appointment}
                                        onActionClick={handleActionClick}
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
                title={confirmConfig.title}
                message={confirmConfig.message}
                confirmText={confirmConfig.confirmText}
                variant={confirmConfig.variant}
            />
        </>
    );
}

interface DoctorAppointmentCardProps {
    appointment: Appointment;
    onActionClick: (id: string, action: 'COMPLETED' | 'CANCELLED', patientName: string) => void;
}

function DoctorAppointmentCard({ appointment, onActionClick }: DoctorAppointmentCardProps) {
    const status = APPOINTMENT_STATUS_CONFIG[appointment.status];
    const duration = calculateDurationInMinutes(appointment.startTime, appointment.endTime);
    const isScheduled = appointment.status === 'SCHEDULED';

    return (
        <div className="bg-white rounded-xl border border-medical-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
                {/* Avatar do Paciente */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-success-500 to-success-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {appointment.patient.name.charAt(0).toUpperCase()}
                </div>

                {/* Informações principais */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="font-semibold text-medical-900">
                                {appointment.patient.name}
                            </h3>
                            {appointment.patient.email && (
                                <p className="text-sm text-medical-500">
                                    {appointment.patient.email}
                                </p>
                            )}
                        </div>

                        {/* Status Badge e Ações */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {isScheduled && (
                                <>
                                    <button
                                        onClick={() => onActionClick(appointment.id, 'COMPLETED', appointment.patient.name)}
                                        className="p-1.5 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                                        title="Finalizar consulta"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => onActionClick(appointment.id, 'CANCELLED', appointment.patient.name)}
                                        className="p-1.5 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                                        title="Cancelar consulta"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bgClass} ${status.textClass}`}>
                                {status.label}
                            </span>
                        </div>
                    </div>

                    {/* Horário e duração */}
                    <div className="mt-3 flex items-center gap-4 text-medical-600">
                        <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-medium">
                                {formatLocalTime(appointment.startTime)}
                                {appointment.endTime && ` - ${formatLocalTime(appointment.endTime)}`}
                            </span>
                        </div>
                        {duration && (
                            <span className="text-sm text-medical-400">
                                ({duration} min)
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
