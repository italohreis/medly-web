import { useState, useCallback, useEffect } from 'react';
import { scheduleService } from '../services/scheduleService';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import type { AvailabilityWindow } from '../types/entities';
import type { AvailabilityStatus } from '../types/common';

interface CreateWindowData {
    startTime: string;
    endTime: string;
    slotDurationInMinutes: number;
}

export function useDoctorSchedule() {
    const { user } = useAuth();
    const { showToast } = useToast();

    const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const doctorId = user?.profile?.doctorProfile?.doctorId;

    const fetchWindows = useCallback(async () => {
        if (!doctorId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await scheduleService.getAvailabilityWindows(doctorId);
            const sortedWindows = response.content
                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                .map(window => ({
                    ...window,
                    timeSlots: window.timeSlots?.sort((a, b) => 
                        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
                    )
                }));
            setWindows(sortedWindows);
        } catch (error) {
            console.error('Erro ao carregar janelas:', error);
            showToast('Erro ao carregar agenda.', 'error');
        } finally {
            setLoading(false);
        }
    }, [doctorId, showToast]);

    useEffect(() => {
        fetchWindows();
    }, [fetchWindows]);

    const createWindow = async (data: CreateWindowData): Promise<boolean> => {
        if (!doctorId) {
            showToast('Erro ao identificar médico.', 'error');
            return false;
        }

        setCreating(true);
        try {
            const newWindow = await scheduleService.createAvailabilityWindow(doctorId, data);
            setWindows(prev => [...prev, newWindow].sort((a, b) => 
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            ));
            showToast('Janela de disponibilidade criada com sucesso!', 'success');
            return true;
        } catch (error) {
            console.error('Erro ao criar janela:', error);
            showToast('Erro ao criar janela de disponibilidade.', 'error');
            return false;
        } finally {
            setCreating(false);
        }
    };

    const deleteWindow = async (windowId: string): Promise<boolean> => {
        setDeletingId(windowId);
        try {
            await scheduleService.deleteAvailabilityWindow(windowId);
            setWindows(prev => prev.filter(w => w.id !== windowId));
            showToast('Janela excluída com sucesso!', 'success');
            return true;
        } catch (error) {
            console.error('Erro ao excluir janela:', error);
            showToast('Erro ao excluir janela.', 'error');
            return false;
        } finally {
            setDeletingId(null);
        }
    };

    const updateTimeSlotStatus = async (slotId: string, newStatus: AvailabilityStatus): Promise<boolean> => {
        try {
            const updatedSlot = await scheduleService.updateTimeSlotStatus(slotId, newStatus);
            
            setWindows(prev => prev.map(window => ({
                ...window,
                timeSlots: window.timeSlots
                    ?.map(slot => 
                        slot.id === slotId 
                            ? { ...slot, status: updatedSlot.status }
                            : slot
                    )
                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
            })));

            const statusLabel = newStatus === 'AVAILABLE' ? 'liberado' : 'bloqueado';
            showToast(`Horário ${statusLabel} com sucesso!`, 'success');
            return true;
        } catch (error) {
            console.error('Erro ao atualizar status do slot:', error);
            showToast('Erro ao atualizar status do horário.', 'error');
            return false;
        }
    };

    const stats = {
        totalWindows: windows.length,
        totalSlots: windows.reduce((acc, w) => acc + (w.timeSlots?.length || 0), 0),
        availableSlots: windows.reduce((acc, w) => 
            acc + (w.timeSlots?.filter(s => s.status === 'AVAILABLE').length || 0), 0
        ),
        bookedSlots: windows.reduce((acc, w) => 
            acc + (w.timeSlots?.filter(s => s.status === 'BOOKED').length || 0), 0
        ),
        blockedSlots: windows.reduce((acc, w) => 
            acc + (w.timeSlots?.filter(s => s.status === 'BLOCKED').length || 0), 0
        )
    };

    return {
        windows,
        loading,
        creating,
        deletingId,
        stats,
        fetchWindows,
        createWindow,
        deleteWindow,
        updateTimeSlotStatus
    };
}
