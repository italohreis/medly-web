import type { Appointment } from '../../types/entities';
import { formatLocalDateTime } from '../../utils/date';
import { APPOINTMENT_STATUS_CONFIG, getSpecialtyLabel } from '../../types/common';

interface PatientAppointmentsTableProps {
    appointments: Appointment[];
    onCancel: (id: string) => void;
}

export function PatientAppointmentsTable({ appointments, onCancel }: PatientAppointmentsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-medical-200">
                <thead className="bg-medical-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-medical-500 uppercase tracking-wider">
                            Médico
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-medical-500 uppercase tracking-wider">
                            Especialidade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-medical-500 uppercase tracking-wider">
                            Data/Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-medical-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-medical-500 uppercase tracking-wider">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-medical-200">
                    {appointments.map((appointment) => {
                        const status = APPOINTMENT_STATUS_CONFIG[appointment.status];
                        const specialtyLabel = getSpecialtyLabel(appointment.doctor.specialty);
                        const canCancel = appointment.status === 'SCHEDULED';

                        return (
                            <tr key={appointment.id} className="hover:bg-medical-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-sm">
                                            {appointment.doctor.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-medical-900">
                                                Dr(a). {appointment.doctor.name}
                                            </p>
                                            {appointment.doctor.crm && (
                                                <p className="text-xs text-medical-500">
                                                    CRM: {appointment.doctor.crm}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-medical-600">{specialtyLabel}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-medical-900">
                                        {formatLocalDateTime(appointment.startTime)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${status.bgClass} ${status.textClass}`}>
                                        {status.label}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    {canCancel && (
                                        <button
                                            onClick={() => onCancel(appointment.id)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancelar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
