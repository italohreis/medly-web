import type { TimeSlot } from '../../../types/entities';
import { formatLocalTime } from '../../../utils/date';

interface TimeSlotButtonProps {
    timeSlot: TimeSlot;
    isSelected: boolean;
    isDisabled: boolean;
    onSelect: (timeSlotId: string) => void;
}

export function TimeSlotButton({ timeSlot, isSelected, isDisabled, onSelect }: TimeSlotButtonProps) {
    return (
        <button
            onClick={() => !isDisabled && onSelect(timeSlot.id)}
            disabled={isDisabled}
            className={`px-4 py-3 rounded-lg border-2 transition-all font-medium text-sm ${
                isSelected
                    ? 'border-primary-500 bg-primary-500 text-white shadow-md'
                    : isDisabled
                        ? 'border-medical-200 bg-medical-100 text-medical-400 cursor-not-allowed'
                        : 'border-medical-200 hover:border-primary-400 hover:bg-primary-50 text-medical-700'
            }`}
        >
            {formatLocalTime(timeSlot.startTime)}
        </button>
    );
}

interface TimeSlotGridProps {
    timeSlots: TimeSlot[];
    selectedId: string | null;
    isBooking: boolean;
    onSelect: (timeSlotId: string) => void;
}

export function TimeSlotGrid({ timeSlots, selectedId, isBooking, onSelect }: TimeSlotGridProps) {
    const groupedByDate = timeSlots.reduce((acc, slot) => {
        const date = slot.startTime.split('T')[0];
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(slot);
        return acc;
    }, {} as Record<string, TimeSlot[]>);

    const sortedDates = Object.keys(groupedByDate).sort();

    const formatDateHeader = (dateStr: string): string => {
        const date = new Date(dateStr + 'T12:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);

        if (dateOnly.getTime() === today.getTime()) {
            return 'Hoje';
        }
        if (dateOnly.getTime() === tomorrow.getTime()) {
            return 'Amanhã';
        }

        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
        });
    };

    return (
        <div className="space-y-6">
            {sortedDates.map(date => (
                <div key={date}>
                    <h4 className="text-sm font-semibold text-medical-700 mb-3 capitalize">
                        {formatDateHeader(date)}
                    </h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {groupedByDate[date]
                            .sort((a, b) => a.startTime.localeCompare(b.startTime))
                            .map(slot => (
                                <TimeSlotButton
                                    key={slot.id}
                                    timeSlot={slot}
                                    isSelected={selectedId === slot.id}
                                    isDisabled={isBooking && selectedId !== slot.id}
                                    onSelect={onSelect}
                                />
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
