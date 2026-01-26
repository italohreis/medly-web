import type { TimeSlot } from '../../types/entities';
import { formatLocalDate, formatLocalTime } from '../../utils/date';
import { getSpecialtyLabel } from '../../types/common';

interface TimeSlotCardProps {
    timeSlot: TimeSlot;
    onSelect: (timeSlotId: string) => void;
    isBooking: boolean;
    selectedId?: string;
}

export function TimeSlotCard({ timeSlot, onSelect, isBooking, selectedId }: TimeSlotCardProps) {
    const isSelected = selectedId === timeSlot.id;
    const isDisabled = isBooking && !isSelected;

    return (
        <div 
            className={`p-4 rounded-xl border-2 transition-all ${
                isSelected 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-medical-200 hover:border-primary-300 hover:bg-medical-50'
            } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !isDisabled && onSelect(timeSlot.id)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Avatar do Médico */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold">
                        {timeSlot.doctor.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Informações do Médico */}
                    <div>
                        <p className="font-semibold text-medical-900">
                            Dr(a). {timeSlot.doctor.name}
                        </p>
                        <p className="text-sm text-medical-500">
                            {getSpecialtyLabel(timeSlot.doctor.specialty)}
                        </p>
                    </div>
                </div>

                {/* Data e Hora */}
                <div className="text-right">
                    <p className="font-semibold text-medical-900">
                        {formatLocalDate(timeSlot.startTime)}
                    </p>
                    <p className="text-sm text-primary-600 font-medium">
                        {formatLocalTime(timeSlot.startTime)} - {formatLocalTime(timeSlot.endTime)}
                    </p>
                </div>
            </div>

            {/* Indicador de seleção */}
            {isSelected && (
                <div className="mt-3 pt-3 border-t border-primary-200 flex items-center justify-between">
                    <span className="text-sm text-primary-700 font-medium">
                        ✓ Horário selecionado
                    </span>
                    {isBooking && (
                        <div className="flex items-center gap-2 text-primary-600">
                            <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full"></div>
                            <span className="text-sm">Agendando...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
