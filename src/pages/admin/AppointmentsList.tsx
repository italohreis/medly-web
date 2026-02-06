import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { StatusFilter, type FilterStatus } from '../../components/ui/StatusFilter';
import { useAppointmentsList } from '../../hooks/useAppointmentsList';
import { formatLocalDate, formatLocalTime } from '../../utils/date';
import { APPOINTMENT_STATUS_CONFIG } from '../../types/common';
import type { Appointment } from '../../types/entities';

export function AppointmentsList() {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        appointments,
        totalPages,
        totalElements,
        currentPage,
        loading,
        setCurrentPage,
        deleteAppointment,
    } = useAppointmentsList({
        pageSize: 10,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
    });

    const statusCounts: Record<FilterStatus, number> = {
        ALL: totalElements,
        SCHEDULED: appointments.filter(a => a.status === 'SCHEDULED').length,
        COMPLETED: appointments.filter(a => a.status === 'COMPLETED').length,
        CANCELLED: appointments.filter(a => a.status === 'CANCELLED').length,
    };

    const handleFilterChange = (status: FilterStatus) => {
        setStatusFilter(status);
        setCurrentPage(0);
    };

    const handleConfirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        await deleteAppointment(deleteTarget.id);
        setIsDeleting(false);
        setDeleteTarget(null);
    };

    const clearDateFilters = () => {
        setStartDate('');
        setEndDate('');
        setCurrentPage(0);
    };

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

                {/* Filtros */}
                <Card>
                    <div className="space-y-4">
                        <StatusFilter
                            currentFilter={statusFilter}
                            onFilterChange={handleFilterChange}
                            counts={statusCounts}
                        />
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="w-48">
                                <Input
                                    type="date"
                                    label="Data início"
                                    value={startDate}
                                    onChange={(e) => { setStartDate(e.target.value); setCurrentPage(0); }}
                                />
                            </div>
                            <div className="w-48">
                                <Input
                                    type="date"
                                    label="Data fim"
                                    value={endDate}
                                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(0); }}
                                />
                            </div>
                            {(startDate || endDate) && (
                                <Button variant="ghost" size="sm" onClick={clearDateFilters}>
                                    Limpar datas
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

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
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        Ações
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
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-16"></div></td>
                                        </tr>
                                    ))
                                ) : appointments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
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
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => setDeleteTarget(appointment)}
                                                        className="text-danger-600 hover:text-danger-800 transition-colors p-1.5 rounded-lg hover:bg-danger-50"
                                                        title="Excluir consulta"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
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

            {/* Modal de confirmação de exclusão */}
            <ConfirmationModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleConfirmDelete}
                title="Excluir Consulta"
                message={deleteTarget ? `Tem certeza que deseja excluir permanentemente a consulta de ${deleteTarget.patient.name} com Dr(a). ${deleteTarget.doctor.name}? Esta ação não pode ser desfeita.` : ''}
                confirmText="Excluir"
                cancelText="Cancelar"
                variant="danger"
                isLoading={isDeleting}
            />
        </DashboardLayout>
    );
}
