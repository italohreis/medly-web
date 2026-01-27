import type { WindowTimeSlot } from '../../../types/entities';
import type { AvailabilityStatus } from '../../../types/common';
import { formatLocalTime } from '../../../utils/date';

interface TimeSlotStatusConfig {
    label: string;
    bgClass: string;
    textClass: string;
    dotClass: string;
}

const STATUS_CONFIG: Record<AvailabilityStatus, TimeSlotStatusConfig> = {
    AVAILABLE: { 
        label: 'Disponível', 
        bgClass: 'bg-success-50', 
        textClass: 'text-success-700',
        dotClass: 'bg-success-500'
    },
    BOOKED: { 
        label: 'Agendado', 
        bgClass: 'bg-primary-50', 
        textClass: 'text-primary-700',
        dotClass: 'bg-primary-500'
    },
    BLOCKED: { 
        label: 'Bloqueado', 
        bgClass: 'bg-medical-100', 
        textClass: 'text-medical-600',
        dotClass: 'bg-medical-400'
    }
};

interface TimeSlotItemProps {
    slot: WindowTimeSlot;
    onToggleStatus?: (slotId: string, currentStatus: AvailabilityStatus) => void;
    isUpdating?: boolean;
}

export function TimeSlotItem({ slot, onToggleStatus, isUpdating }: TimeSlotItemProps) {
    const config = STATUS_CONFIG[slot.status];
    const canToggle = slot.status !== 'BOOKED' && onToggleStatus;

    const handleToggle = () => {
        if (!canToggle || isUpdating) return;
        onToggleStatus(slot.id, slot.status);
    };

    return (
        <div 
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                canToggle 
                    ? 'cursor-pointer hover:shadow-sm' 
                    : slot.status === 'BOOKED' 
                        ? 'cursor-not-allowed opacity-75' 
                        : ''
            } ${config.bgClass} border-transparent`}
            onClick={handleToggle}
        >
            <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${config.dotClass}`} />
                <span className="font-medium text-medical-900">
                    {formatLocalTime(slot.startTime)} - {formatLocalTime(slot.endTime)}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${config.bgClass} ${config.textClass}`}>
                    {config.label}
                </span>
                {canToggle && (
                    <button
                        className="p-1 hover:bg-white/50 rounded transition-colors"
                        title={slot.status === 'AVAILABLE' ? 'Bloquear horário' : 'Liberar horário'}
                        disabled={isUpdating}
                    >
                        {isUpdating ? (
                            <div className="w-4 h-4 border-2 border-medical-300 border-t-primary-500 rounded-full animate-spin" />
                        ) : slot.status === 'AVAILABLE' ? (
                            <svg className="w-4 h-4 text-medical-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}
