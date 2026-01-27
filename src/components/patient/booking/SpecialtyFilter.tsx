import { SPECIALTIES, type Specialty } from '../../../types/common';

interface SpecialtyFilterProps {
    value: Specialty | '';
    onChange: (specialty: Specialty | '') => void;
}

export function SpecialtyFilter({ value, onChange }: SpecialtyFilterProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-medical-200 p-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-bold text-medical-900">Especialidade</h2>
                    <p className="text-sm text-medical-500">Selecione o tipo de consulta</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                <button
                    onClick={() => onChange('')}
                    className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        value === ''
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-medical-200 hover:border-primary-300 text-medical-600'
                    }`}
                >
                    Todas
                </button>
                {SPECIALTIES.map(spec => (
                    <button
                        key={spec.value}
                        onClick={() => onChange(spec.value)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            value === spec.value
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-medical-200 hover:border-primary-300 text-medical-600'
                        }`}
                    >
                        {spec.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
