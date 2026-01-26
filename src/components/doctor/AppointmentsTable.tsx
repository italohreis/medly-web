import type { Appointment } from '../../types/entities';
import { APPOINTMENT_STATUS_CONFIG } from '../../types/common';
import { formatDateTime, formatTime, calculateDurationInMinutes } from '../../utils';

interface AppointmentsTableProps {
    appointments: Appointment[];
    onStatusChange: (id: string, status: 'COMPLETED' | 'CANCELLED') => void;
}

export function AppointmentsTable({ appointments, onStatusChange }: AppointmentsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-medical-50 border-y border-medical-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-medical-700 uppercase tracking-wide">
                            Paciente
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-medical-700 uppercase tracking-wide">
                            Data / Hora
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-medical-700 uppercase tracking-wide">
                            Duração
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-medical-700 uppercase tracking-wide">
                            Status
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-medical-700 uppercase tracking-wide">
                            Ações
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-medical-100">
                    {appointments.map((apt) => {
                        const duration = calculateDurationInMinutes(apt.startTime, apt.endTime);
                        const status = APPOINTMENT_STATUS_CONFIG[apt.status];

                        return (
                            <tr key={apt.id} className="hover:bg-medical-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-success-400 to-success-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                            {apt.patient.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-medical-900">{apt.patient.name}</p>
                                            <p className="text-xs text-medical-500">Paciente</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-medical-900">
                                            {formatDateTime(apt.startTime)}
                                        </p>
                                        <p className="text-xs text-medical-500">
                                            até {formatTime(apt.endTime)}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-medical-600">{duration} min</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.bgClass} ${status.textClass}`}>
                                        {status.label}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {apt.status === 'SCHEDULED' && (
                                            <>
                                                <button
                                                    onClick={() => onStatusChange(apt.id, 'COMPLETED')}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-success-50 text-success-700 hover:bg-success-100 rounded-lg text-sm font-medium transition-colors"
                                                    title="Finalizar consulta"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Finalizar
                                                </button>
                                                <button
                                                    onClick={() => onStatusChange(apt.id, 'CANCELLED')}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-danger-50 text-danger-700 hover:bg-danger-100 rounded-lg text-sm font-medium transition-colors"
                                                    title="Cancelar consulta"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Cancelar
                                                </button>
                                            </>
                                        )}
                                        {(apt.status === 'COMPLETED' || apt.status === 'CANCELLED') && (
                                            <span className="text-sm text-medical-400">—</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
