import { Link } from 'react-router-dom';
import { PatientLayout } from '../../components/layouts/PatientLayout';
import { Card } from '../../components/ui/Card';
import { usePatientDashboard } from '../../hooks/usePatientDashboard';
import { 
    PatientStatCard, 
    PatientAppointmentCard, 
    QuickActionCard 
} from '../../components/patient';
import { 
    CalendarIcon, 
    ClockIcon, 
    CheckIcon, 
    PlusIcon 
} from '../../components/icons';
import { formatLocalDateTime } from '../../utils/date';
import { getSpecialtyLabel } from '../../types/common';

export function PatientDashboard() {
    const { 
        scheduledAppointments,
        completedAppointments,
        upcomingAppointments,
        nextAppointment,
        loading, 
        handleCancelAppointment 
    } = usePatientDashboard();

    if (loading) {
        return (
            <PatientLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </PatientLayout>
        );
    }

    const nextAppointmentSpecialty = nextAppointment?.doctor.specialty 
        ? getSpecialtyLabel(nextAppointment.doctor.specialty)
        : null;

    return (
        <PatientLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-medical-900">Dashboard</h1>
                    <p className="text-medical-600 mt-1">
                        Bem-vindo ao seu painel de consultas
                    </p>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PatientStatCard
                        title="Consultas Agendadas"
                        value={scheduledAppointments.length}
                        icon={<ClockIcon />}
                        variant="primary"
                    />
                    <PatientStatCard
                        title="Consultas Realizadas"
                        value={completedAppointments.length}
                        icon={<CheckIcon />}
                        variant="success"
                    />
                    <PatientStatCard
                        title="Total de Consultas"
                        value={scheduledAppointments.length + completedAppointments.length}
                        icon={<CalendarIcon />}
                        variant="info"
                    />
                </div>

                {/* Grid Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Próximas Consultas */}
                    <div className="lg:col-span-2">
                        <Card padding="none" className="overflow-hidden">
                            <div className="p-6 border-b border-medical-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-medical-900 flex items-center gap-2">
                                    <span className="text-primary-600"><CalendarIcon /></span>
                                    Próximas Consultas
                                </h2>
                                <Link
                                    to="/patient/appointments"
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Ver todas →
                                </Link>
                            </div>

                            <div className="divide-y divide-medical-100">
                                {upcomingAppointments.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="w-12 h-12 mx-auto mb-4 text-medical-300">
                                            <CalendarIcon />
                                        </div>
                                        <p className="text-medical-500">Nenhuma consulta agendada</p>
                                        <Link
                                            to="/patient/book"
                                            className="mt-3 inline-block text-primary-600 hover:text-primary-700 font-medium text-sm"
                                        >
                                            Agendar uma consulta →
                                        </Link>
                                    </div>
                                ) : (
                                    upcomingAppointments.slice(0, 5).map((apt) => (
                                        <PatientAppointmentCard
                                            key={apt.id}
                                            appointment={apt}
                                            onCancel={handleCancelAppointment}
                                        />
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {nextAppointment && (
                            <Card className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                                <h3 className="text-sm font-medium opacity-90 mb-3">Próxima Consulta</h3>
                                <div className="space-y-2">
                                    <p className="text-lg font-bold">
                                        Dr(a). {nextAppointment.doctor.name}
                                    </p>
                                    {nextAppointmentSpecialty && (
                                        <p className="text-sm opacity-90">{nextAppointmentSpecialty}</p>
                                    )}
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/20">
                                        <CalendarIcon />
                                        <span className="text-sm font-medium">
                                            {formatLocalDateTime(nextAppointment.startTime)}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Ações Rápidas */}
                        <Card>
                            <h2 className="text-lg font-bold text-medical-900 mb-4">Ações Rápidas</h2>
                            <div className="space-y-3">
                                <QuickActionCard
                                    to="/patient/book"
                                    icon={<PlusIcon />}
                                    title="Agendar Consulta"
                                    description="Encontre um médico e agende"
                                    variant="primary"
                                />
                                <QuickActionCard
                                    to="/patient/appointments"
                                    icon={<CalendarIcon />}
                                    title="Minhas Consultas"
                                    description="Ver histórico completo"
                                    variant="success"
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
}