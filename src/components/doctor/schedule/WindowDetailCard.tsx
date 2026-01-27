import { useState } from 'react';
import type { AvailabilityWindow } from '../../../types/entities';
import type { AvailabilityStatus } from '../../../types/common';
import { formatLocalTime, formatLocalDateFull } from '../../../utils/date';
import { TimeSlotItem } from './TimeSlotItem';
import { ConfirmationModal } from '../../ui/ConfirmationModal';

interface WindowDetailCardProps {
    window: AvailabilityWindow;
    onDelete?: (id: string) => void;
    onToggleSlotStatus?: (slotId: string, newStatus: AvailabilityStatus) => Promise<boolean>;
    isDeleting?: boolean;
}

export function WindowDetailCard({ 
    window: win, 
    onDelete,
    onToggleSlotStatus,
    isDeleting 
}: WindowDetailCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [updatingSlotId, setUpdatingSlotId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const timeSlots = win.timeSlots || [];
    const availableCount = timeSlots.filter(s => s.status === 'AVAILABLE').length;
    const bookedCount = timeSlots.filter(s => s.status === 'BOOKED').length;
    const blockedCount = timeSlots.filter(s => s.status === 'BLOCKED').length;

    const handleToggleSlotStatus = async (slotId: string, currentStatus: AvailabilityStatus) => {
        if (!onToggleSlotStatus) return;
        
        const newStatus: AvailabilityStatus = currentStatus === 'AVAILABLE' ? 'BLOCKED' : 'AVAILABLE';
        setUpdatingSlotId(slotId);
        
        await onToggleSlotStatus(slotId, newStatus);
        setUpdatingSlotId(null);
    };

    const handleDeleteConfirm = async () => {
        if (onDelete && win.id) {
            onDelete(win.id);
            setShowDeleteModal(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-medical-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Header */}
                <div 
                    className="p-4 cursor-pointer"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Ícone de horário */}
                            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>

                            {/* Info */}
                            <div>
                                <h3 className="font-bold text-lg text-medical-900">
                                    {formatLocalTime(win.startTime)} - {formatLocalTime(win.endTime)}
                                </h3>
                                <p className="text-sm text-medical-500">
                                    {formatLocalDateFull(win.startTime)} • {timeSlots.length} slot{timeSlots.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Status badges */}
                            <div className="hidden sm:flex items-center gap-2">
                                {availableCount > 0 && (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
                                        {availableCount} disponível
                                    </span>
                                )}
                                {bookedCount > 0 && (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                                        {bookedCount} agendado
                                    </span>
                                )}
                                {blockedCount > 0 && (
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-medical-100 text-medical-600">
                                        {blockedCount} bloqueado
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                                {onDelete && win.id && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDeleteModal(true);
                                        }}
                                        disabled={isDeleting}
                                        className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                                        title="Excluir janela"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}

                                {/* Expand icon */}
                                <button className="p-2 text-medical-400 hover:bg-medical-50 rounded-lg transition-colors">
                                    <svg 
                                        className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile badges */}
                    <div className="flex sm:hidden items-center gap-2 mt-3">
                        {availableCount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-success-100 text-success-700">
                                {availableCount} disp.
                            </span>
                        )}
                        {bookedCount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-700">
                                {bookedCount} agend.
                            </span>
                        )}
                        {blockedCount > 0 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-medical-100 text-medical-600">
                                {blockedCount} bloq.
                            </span>
                        )}
                    </div>
                </div>

                {/* Expanded content with time slots */}
                {isExpanded && timeSlots.length > 0 && (
                    <div className="border-t border-medical-100 p-4 bg-medical-50/50">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-medical-700">
                                Horários
                            </h4>
                            <p className="text-xs text-medical-500">
                                Clique para alternar disponibilidade
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {[...timeSlots]
                                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                .map(slot => (
                                <TimeSlotItem
                                    key={slot.id}
                                    slot={slot}
                                    onToggleStatus={onToggleSlotStatus ? handleToggleSlotStatus : undefined}
                                    isUpdating={updatingSlotId === slot.id}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {isExpanded && timeSlots.length === 0 && (
                    <div className="border-t border-medical-100 p-6 bg-medical-50/50 text-center">
                        <p className="text-medical-500 text-sm">
                            Nenhum slot disponível nesta janela
                        </p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Excluir Janela de Disponibilidade"
                message="Tem certeza que deseja excluir esta janela? Todos os horários associados serão removidos. Esta ação não pode ser desfeita."
                confirmText="Excluir"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
}
