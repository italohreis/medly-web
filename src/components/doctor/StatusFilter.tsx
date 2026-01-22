import type { AppointmentStatus } from '../../types/common';

type FilterStatus = AppointmentStatus | 'ALL';

interface StatusFilterProps {
    currentFilter: FilterStatus;
    onFilterChange: (status: FilterStatus) => void;
    counts: Record<FilterStatus, number>;
}

const filterConfig: Record<FilterStatus, { label: string; activeClass: string; inactiveClass: string }> = {
    ALL: {
        label: 'Todas',
        activeClass: 'bg-medical-900 text-white',
        inactiveClass: 'bg-white text-medical-600 border border-medical-200 hover:bg-medical-50'
    },
    SCHEDULED: {
        label: 'Agendadas',
        activeClass: 'bg-info-600 text-white',
        inactiveClass: 'bg-info-50 text-info-700 border border-info-200 hover:bg-info-100'
    },
    COMPLETED: {
        label: 'Finalizadas',
        activeClass: 'bg-success-600 text-white',
        inactiveClass: 'bg-success-50 text-success-700 border border-success-200 hover:bg-success-100'
    },
    CANCELLED: {
        label: 'Canceladas',
        activeClass: 'bg-danger-600 text-white',
        inactiveClass: 'bg-danger-50 text-danger-700 border border-danger-200 hover:bg-danger-100'
    }
};

export function StatusFilter({ currentFilter, onFilterChange, counts }: StatusFilterProps) {
    const filters: FilterStatus[] = ['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'];

    return (
        <div className="flex flex-wrap gap-3">
            {filters.map((status) => {
                const config = filterConfig[status];
                const isActive = currentFilter === status;
                return (
                    <button
                        key={status}
                        onClick={() => onFilterChange(status)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            isActive ? config.activeClass : config.inactiveClass
                        }`}
                    >
                        {config.label} ({counts[status]})
                    </button>
                );
            })}
        </div>
    );
}

export type { FilterStatus };
