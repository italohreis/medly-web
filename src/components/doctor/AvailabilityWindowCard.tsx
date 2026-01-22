import type { AvailabilityWindow } from '../../types/entities';
import { formatLocalTime } from '../../utils/date';

interface AvailabilityWindowCardProps {
    window: AvailabilityWindow;
    onDelete?: (id: string) => void;
}

export function AvailabilityWindowCard({ window: win, onDelete }: AvailabilityWindowCardProps) {
    return (
        <div className="bg-medical-50 rounded-lg p-4 border border-medical-100 hover:border-primary-200 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-medical-900">
                            {formatLocalTime(win.startTime)} - {formatLocalTime(win.endTime)}
                        </p>
                        <p className="text-xs text-medical-500">
                            Disponível para agendamento
                        </p>
                    </div>
                </div>
                {onDelete && win.id && (
                    <button
                        onClick={() => onDelete(win.id!)}
                        className="p-2 text-danger-500 hover:bg-danger-50 rounded-lg transition-colors"
                        title="Remover horário"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
