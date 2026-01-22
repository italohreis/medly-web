import { useState } from 'react';
import { DoctorLayout } from '../../components/layouts/DoctorLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import { 
    DoctorStatCard, 
    AvailabilityWindowCard, 
    ScheduleModal,
    type ScheduleFormData 
} from '../../components/doctor';
import { CalendarIcon, CheckIcon, ClockIcon, PlusIcon } from '../../components/icons';
import type { AvailabilityWindow } from '../../types/entities';
import { formatLocalDateFull, parseLocalDateTime } from '../../utils/date';

const groupWindowsByDate = (windows: AvailabilityWindow[]) => {
    return windows.reduce((acc, win) => {
        const date = formatLocalDateFull(win.startTime);
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(win);
        return acc;
    }, {} as Record<string, AvailabilityWindow[]>);
};

const countWindowsInNextWeek = (windows: AvailabilityWindow[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return windows.filter(w => {
        const windowDate = parseLocalDateTime(w.startTime);
        return windowDate >= today && windowDate <= weekFromNow;
    }).length;
};

export function DoctorScheduleManagement() {
    const { windows, loading, handleAddWindow, handleDeleteWindow } = useDoctorDashboard();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const groupedWindows = groupWindowsByDate(windows);
    const windowsInNextWeek = countWindowsInNextWeek(windows);

    const handleSubmit = async (data: ScheduleFormData) => {
        setIsSubmitting(true);
        try {
            await handleAddWindow(data);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erro ao adicionar horário:', error);
        } finally {
            setIsSubmitting(false);
        }
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
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-medical-900">Minha Agenda</h1>
                        <p className="text-medical-600 mt-1">
                            Configure seus horários de disponibilidade para consultas
                        </p>
                    </div>
                    <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
                        <PlusIcon />
                        Novo Horário
                    </Button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <DoctorStatCard
                        title="Total de Janelas"
                        value={windows.length}
                        icon={<CalendarIcon />}
                        variant="gradient"
                    />
                    <DoctorStatCard
                        title="Próximos 7 dias"
                        value={windowsInNextWeek}
                        icon={<CheckIcon />}
                        variant="success"
                    />
                    <DoctorStatCard
                        title="Dias Configurados"
                        value={Object.keys(groupedWindows).length}
                        icon={<ClockIcon />}
                        variant="info"
                    />
                </div>

                {/* Lista de Horários */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-6 border-b border-medical-100">
                        <h2 className="text-lg font-bold text-medical-900">Horários Configurados</h2>
                        <p className="text-sm text-medical-500 mt-1">
                            Seus horários disponíveis para agendamento de consultas
                        </p>
                    </div>

                    {windows.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-medical-100 rounded-full flex items-center justify-center">
                                <span className="text-medical-400">
                                    <CalendarIcon />
                                </span>
                            </div>
                            <h3 className="text-lg font-medium text-medical-900 mb-2">Nenhum horário configurado</h3>
                            <p className="text-medical-500 mb-6">
                                Comece adicionando seus horários de disponibilidade para que os pacientes possam agendar consultas.
                            </p>
                            <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
                                <PlusIcon />
                                Adicionar Primeiro Horário
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-medical-100">
                            {Object.entries(groupedWindows).map(([date, dateWindows]) => (
                                <div key={date} className="p-6">
                                    <h3 className="text-sm font-semibold text-medical-700 uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <span className="text-primary-600">
                                            <CalendarIcon />
                                        </span>
                                        {date}
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {dateWindows.map((win, idx) => (
                                            <AvailabilityWindowCard
                                                key={win.id || idx}
                                                window={win}
                                                onDelete={handleDeleteWindow}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Modal */}
                <ScheduleModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />
            </div>
        </DoctorLayout>
    );
}
