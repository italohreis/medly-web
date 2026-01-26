import { useState } from 'react';
import { SPECIALTIES, type Specialty } from '../../types/common';

interface BookingFiltersProps {
    onSearch: (filters: BookingFiltersData) => void;
    loading: boolean;
}

export interface BookingFiltersData {
    specialty?: Specialty;
    startDate: string;
    endDate: string;
}

export function BookingFilters({ onSearch, loading }: BookingFiltersProps) {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [specialty, setSpecialty] = useState<Specialty | ''>('');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(nextWeek);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const startDateTime = `${startDate}T00:00:00`;
        const endDateTime = `${endDate}T23:59:59`;

        onSearch({
            specialty: specialty || undefined,
            startDate: startDateTime,
            endDate: endDateTime
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-medical-200 p-6">
            <h2 className="text-lg font-bold text-medical-900 mb-4">Buscar Horários</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Especialidade */}
                <div>
                    <label className="block text-sm font-medium text-medical-700 mb-1">
                        Especialidade
                    </label>
                    <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value as Specialty | '')}
                        className="w-full px-3 py-2 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                        <option value="">Todas as especialidades</option>
                        {SPECIALTIES.map((spec) => (
                            <option key={spec.value} value={spec.value}>
                                {spec.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Data Início */}
                <div>
                    <label className="block text-sm font-medium text-medical-700 mb-1">
                        Data Início
                    </label>
                    <input
                        type="date"
                        value={startDate}
                        min={today}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                    />
                </div>

                {/* Data Fim */}
                <div>
                    <label className="block text-sm font-medium text-medical-700 mb-1">
                        Data Fim
                    </label>
                    <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                    />
                </div>

                {/* Botão Buscar */}
                <div className="flex items-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Buscando...
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                Buscar
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
