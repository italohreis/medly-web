import { useState, useMemo } from 'react';
import { DoctorLayout } from '../../components/layouts/DoctorLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useDoctorSchedule } from '../../hooks/useDoctorSchedule';
import { DoctorStatCard, ScheduleModal, type ScheduleFormData } from '../../components/doctor';
import { WindowDetailCard } from '../../components/doctor/schedule';
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
    const { 
        windows, 
        loading, 
        creating,
        deletingId,
        stats,
        createWindow, 
        deleteWindow,
        updateTimeSlotStatus
    } = useDoctorSchedule();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const groupedWindows = useMemo(() => groupWindowsByDate(windows), [windows]);
    const windowsInNextWeek = useMemo(() => countWindowsInNextWeek(windows), [windows]);

    const handleSubmit = async (data: ScheduleFormData) => {
        const success = await createWindow({
            startTime: data.startTime,
            endTime: data.endTime,
            slotDurationInMinutes: data.slotDurationInMinutes
        });
        
        if (success) {
            setIsModalOpen(false);
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
                        Nova Janela
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DoctorStatCard
                        title="Total de Janelas"
                        value={stats.totalWindows}
                        icon={<CalendarIcon />}
                        variant="gradient"
                    />
                    <DoctorStatCard
                        title="Próximos 7 dias"
                        value={windowsInNextWeek}
                        icon={<ClockIcon />}
                        variant="info"
                    />
                    <DoctorStatCard
                        title="Slots Disponíveis"
                        value={stats.availableSlots}
                        icon={<CheckIcon />}
                        variant="success"
                    />
                    <DoctorStatCard
                        title="Slots Agendados"
                        value={stats.bookedSlots}
                        icon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        }
                        variant="warning"
                    />
                </div>

                {/* Lista de Janelas */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-6 border-b border-medical-100">
                        <h2 className="text-lg font-bold text-medical-900">Janelas de Disponibilidade</h2>
                        <p className="text-sm text-medical-500 mt-1">
                            Clique em uma janela para ver e gerenciar os horários individuais
                        </p>
                    </div>

                    {windows.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-medical-100 rounded-full flex items-center justify-center">
                                <span className="text-medical-400">
                                    <CalendarIcon />
                                </span>
                            </div>
                            <h3 className="text-lg font-medium text-medical-900 mb-2">
                                Nenhuma janela configurada
                            </h3>
                            <p className="text-medical-500 mb-6">
                                Comece adicionando suas janelas de disponibilidade para que os pacientes possam agendar consultas.
                            </p>
                            <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
                                <PlusIcon />
                                Adicionar Primeira Janela
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
                                        <span className="ml-auto text-xs font-normal text-medical-400 normal-case">
                                            {dateWindows.length} janela{dateWindows.length !== 1 ? 's' : ''}
                                        </span>
                                    </h3>
                                    <div className="space-y-4">
                                        {dateWindows.map((win, idx) => (
                                            <WindowDetailCard
                                                key={win.id || idx}
                                                window={win}
                                                onDelete={deleteWindow}
                                                onToggleSlotStatus={updateTimeSlotStatus}
                                                isDeleting={deletingId === win.id}
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
                    isSubmitting={creating}
                />
            </div>
        </DoctorLayout>
    );
}
