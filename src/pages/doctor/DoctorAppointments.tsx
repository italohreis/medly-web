import { useState } from 'react';
import { DoctorLayout } from '../../components/layouts/DoctorLayout';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import { 
    StatusFilter, 
    AppointmentsTable,
    type FilterStatus 
} from '../../components/doctor';

const ITEMS_PER_PAGE = 10;

export function DoctorAppointments() {
    const { appointments, loading, handleStatusChange } = useDoctorDashboard();
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
    const [currentPage, setCurrentPage] = useState(0);

    const filteredAppointments = statusFilter === 'ALL'
        ? appointments
        : appointments.filter(apt => apt.status === statusFilter);

    const paginatedAppointments = filteredAppointments.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

    const statusCounts: Record<FilterStatus, number> = {
        ALL: appointments.length,
        SCHEDULED: appointments.filter(a => a.status === 'SCHEDULED').length,
        COMPLETED: appointments.filter(a => a.status === 'COMPLETED').length,
        CANCELLED: appointments.filter(a => a.status === 'CANCELLED').length
    };

    const handleFilterChange = (status: FilterStatus) => {
        setStatusFilter(status);
        setCurrentPage(0);
    };

    if (loading) {
        return (
            <DoctorLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DoctorLayout>
        );
    }

    return (
        <DoctorLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-medical-900">Consultas</h1>
                    <p className="text-medical-600 mt-1">
                        Gerencie todas as suas consultas em um só lugar
                    </p>
                </div>

                {/* Filtros por Status */}
                <StatusFilter
                    currentFilter={statusFilter}
                    onFilterChange={handleFilterChange}
                    counts={statusCounts}
                />

                {/* Lista de Consultas */}
                <Card padding="none" className="overflow-hidden">
                    {filteredAppointments.length === 0 ? (
                        <EmptyState statusFilter={statusFilter} />
                    ) : (
                        <>
                            <AppointmentsTable
                                appointments={paginatedAppointments}
                                onStatusChange={handleStatusChange}
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
        </DoctorLayout>
    );
}

// Componente de estado vazio
interface EmptyStateProps {
    statusFilter: FilterStatus;
}

function EmptyState({ statusFilter }: EmptyStateProps) {
    const statusLabels: Record<FilterStatus, string> = {
        ALL: 'Nenhuma consulta encontrada',
        SCHEDULED: 'Nenhuma consulta agendada',
        COMPLETED: 'Nenhuma consulta finalizada',
        CANCELLED: 'Nenhuma consulta cancelada'
    };

    return (
        <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-medical-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-medical-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            </div>
            <h3 className="text-lg font-medium text-medical-900 mb-2">
                {statusLabels[statusFilter]}
            </h3>
            <p className="text-medical-500">
                {statusFilter === 'ALL'
                    ? 'As consultas aparecerão aqui quando os pacientes agendarem.'
                    : 'Não há consultas com este status no momento.'}
            </p>
        </div>
    );
}
