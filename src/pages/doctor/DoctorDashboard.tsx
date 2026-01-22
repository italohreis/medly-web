import { Link } from 'react-router-dom';
import { DoctorLayout } from '../../components/layouts/DoctorLayout';
import { Card } from '../../components/ui/Card';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import { 
    DoctorStatCard, 
    AppointmentCard, 
    QuickAction 
} from '../../components/doctor';
import { 
    CalendarIcon, 
    ClockIcon, 
    CheckIcon, 
    AlertIcon, 
    PlusIcon, 
    ClipboardIcon 
} from '../../components/icons';
import { formatLocalDate, formatLocalTime } from '../../utils/date';

export function DoctorDashboard() {
    const { appointments, windows, loading, handleStatusChange } = useDoctorDashboard();

    const upcomingAppointments = appointments
        .filter(apt => apt.status === 'SCHEDULED')
        .slice(0, 5);

    const todayAppointments = appointments.filter(apt => {
        const today = new Date().toDateString();
        return new Date(apt.startTime).toDateString() === today;
    });

    const scheduledCount = appointments.filter(a => a.status === 'SCHEDULED').length;
    const completedCount = appointments.filter(a => a.status === 'COMPLETED').length;

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
                    <h1 className="text-3xl font-bold text-medical-900">Dashboard</h1>
                    <p className="text-medical-600 mt-1">
                        Bem-vindo ao seu painel de controle
                    </p>
                </div>

                {/* Cards de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <DoctorStatCard
                        title="Consultas Hoje"
                        value={todayAppointments.length}
                        icon={<CalendarIcon />}
                        variant="info"
                    />
                    <DoctorStatCard
                        title="Agendadas"
                        value={scheduledCount}
                        icon={<ClockIcon />}
                        variant="primary"
                    />
                    <DoctorStatCard
                        title="Finalizadas"
                        value={completedCount}
                        icon={<CheckIcon />}
                        variant="success"
                    />
                    <DoctorStatCard
                        title="Horários Disponíveis"
                        value={windows.length}
                        icon={<AlertIcon />}
                        variant="warning"
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
                                    to="/doctor/appointments"
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
                                            to="/doctor/schedule"
                                            className="mt-3 inline-block text-primary-600 hover:text-primary-700 font-medium text-sm"
                                        >
                                            Configurar sua agenda →
                                        </Link>
                                    </div>
                                ) : (
                                    upcomingAppointments.map((apt) => (
                                        <AppointmentCard
                                            key={apt.id}
                                            appointment={apt}
                                            onStatusChange={handleStatusChange}
                                        />
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Ações Rápidas e Agenda */}
                    <div className="space-y-6">
                        {/* Ações Rápidas */}
                        <Card>
                            <h2 className="text-lg font-bold text-medical-900 mb-4">Ações Rápidas</h2>
                            <div className="space-y-3">
                                <QuickAction
                                    to="/doctor/schedule"
                                    icon={<PlusIcon />}
                                    title="Configurar Agenda"
                                    description="Adicionar horários disponíveis"
                                    variant="primary"
                                />
                                <QuickAction
                                    to="/doctor/appointments"
                                    icon={<ClipboardIcon />}
                                    title="Ver Consultas"
                                    description="Gerenciar todas as consultas"
                                    variant="success"
                                />
                            </div>
                        </Card>

                        {/* Próximos Horários Disponíveis */}
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-medical-900">Agenda</h2>
                                <Link
                                    to="/doctor/schedule"
                                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                                >
                                    Gerenciar
                                </Link>
                            </div>
                            <div className="space-y-3">
                                {windows.length === 0 ? (
                                    <p className="text-sm text-medical-500 text-center py-4">
                                        Nenhum horário configurado
                                    </p>
                                ) : (
                                    windows.slice(0, 3).map((win, idx) => (
                                        <div key={win.id || idx} className="p-3 bg-medical-50 rounded-lg">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="w-4 h-4 text-primary-600">
                                                    <CalendarIcon />
                                                </span>
                                                <span className="font-medium text-medical-900">
                                                    {formatLocalDate(win.startTime)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-medical-500 mt-1 ml-6">
                                                {formatLocalTime(win.startTime)} - {formatLocalTime(win.endTime)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
}
