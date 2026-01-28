import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { useAppointmentsList } from '../../hooks/useAppointmentsList';
import { formatLocalDate, formatLocalTime } from '../../utils/date';
import { APPOINTMENT_STATUS_CONFIG } from '../../types/common';

export function AppointmentsList() {
    const { appointments, totalPages, totalElements, currentPage, loading, setCurrentPage } = useAppointmentsList(10);

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <Link
                            to="/admin"
                            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium mb-2"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar ao Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-medical-900">Consultas</h1>
                        <p className="text-medical-600 mt-1">
                            {totalElements} consultas registradas
                        </p>
                    </div>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-medical-50 border-y border-medical-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        Paciente
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        Médico
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        Data/Hora
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-medical-200">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-20"></div></td>
                                        </tr>
                                    ))
                                ) : appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-medical-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <p className="text-medical-600 font-medium">Nenhuma consulta encontrada</p>
                                                <p className="text-medical-500 text-sm mt-1">As consultas aparecerão aqui quando forem agendadas</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    appointments.map((appointment) => {
                                        const statusConfig = APPOINTMENT_STATUS_CONFIG[appointment.status];
                                        return (
                                            <tr key={appointment.id} className="hover:bg-medical-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center text-success-700 font-bold text-sm mr-3">
                                                            {appointment.patient.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-medium text-medical-900">
                                                            {appointment.patient.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-medical-900">Dr(a). {appointment.doctor.name}</p>
                                                        <p className="text-xs text-medical-500">{appointment.doctor.crm}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-medical-600">
                                                    <div>
                                                        <p className="font-medium">
                                                            {formatLocalDate(appointment.startTime)}
                                                        </p>
                                                        <p className="text-xs text-medical-500">
                                                            {formatLocalTime(appointment.startTime)} - {formatLocalTime(appointment.endTime)}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgClass} ${statusConfig.textClass}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {!loading && appointments.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            loading={loading}
                        />
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
}
