import { Link } from 'react-router-dom';
import { PatientLayout } from '../../components/layouts/PatientLayout';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { StatusFilter } from '../../components/ui/StatusFilter';
import { usePatientAppointments, type FilterStatus } from '../../hooks/usePatientAppointments';
import { PatientAppointmentsTable } from '../../components/patient/PatientAppointmentsTable';
import { CalendarIcon } from '../../components/icons';

export function PatientAppointments() {
    const {
        appointments,
        statusFilter,
        statusCounts,
        currentPage,
        totalPages,
        loading,
        handleFilterChange,
        handleCancelAppointment,
        setCurrentPage
    } = usePatientAppointments({ pageSize: 10 });

    if (loading) {
        return (
            <PatientLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </PatientLayout>
        );
    }

    return (
        <PatientLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-medical-900">Minhas Consultas</h1>
                        <p className="text-medical-600 mt-1">
                            Visualize e gerencie todas as suas consultas
                        </p>
                    </div>
                    <Link
                        to="/patient/book"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Agendar Consulta
                    </Link>
                </div>

                {/* Filtros por Status */}
                <StatusFilter
                    currentFilter={statusFilter}
                    onFilterChange={handleFilterChange}
                    counts={statusCounts}
                />

                {/* Lista de Consultas */}
                <Card padding="none" className="overflow-hidden">
                    {appointments.length === 0 ? (
                        <EmptyState statusFilter={statusFilter} />
                    ) : (
                        <>
                            <PatientAppointmentsTable
                                appointments={appointments}
                                onCancel={handleCancelAppointment}
                            />

                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    loading={loading}
                                />
                            )}
                        </>
                    )}
                </Card>
            </div>
        </PatientLayout>
    );
}

interface EmptyStateProps {
    statusFilter: FilterStatus;
}

function EmptyState({ statusFilter }: EmptyStateProps) {
    const statusLabels: Record<FilterStatus, string> = {
        ALL: 'Nenhuma consulta encontrada',
        SCHEDULED: 'Nenhuma consulta agendada',
        COMPLETED: 'Nenhuma consulta realizada',
        CANCELLED: 'Nenhuma consulta cancelada'
    };

    return (
        <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-medical-100 rounded-full flex items-center justify-center">
                <span className="w-8 h-8 text-medical-400">
                    <CalendarIcon />
                </span>
            </div>
            <h3 className="text-lg font-medium text-medical-900 mb-2">
                {statusLabels[statusFilter]}
            </h3>
            <p className="text-medical-500 mb-4">
                {statusFilter === 'ALL'
                    ? 'Você ainda não possui consultas agendadas.'
                    : 'Não há consultas com este status no momento.'}
            </p>
            {statusFilter === 'ALL' && (
                <Link
                    to="/patient/book"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                    Agendar sua primeira consulta →
                </Link>
            )}
        </div>
    );
}
