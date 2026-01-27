import { getSpecialtyLabel, type Specialty } from '../../../types/common';

export interface DoctorInfo {
    id: string;
    name: string;
    specialty?: Specialty;
    availableSlots: number;
}

interface DoctorCardProps {
    doctor: DoctorInfo;
    isSelected: boolean;
    onSelect: (doctorId: string) => void;
}

export function DoctorCard({ doctor, isSelected, onSelect }: DoctorCardProps) {
    return (
        <button
            onClick={() => onSelect(doctor.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-medical-200 hover:border-primary-300 hover:bg-medical-50'
            }`}
        >
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl ${
                    isSelected
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700'
                        : 'bg-gradient-to-br from-medical-400 to-medical-500'
                }`}>
                    {doctor.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-medical-900 truncate">
                        Dr(a). {doctor.name}
                    </h3>
                    <p className="text-sm text-medical-500">
                        {doctor.specialty ? getSpecialtyLabel(doctor.specialty) : 'Especialidade não informada'}
                    </p>
                </div>

                {/* Badge de horários */}
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    isSelected
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-medical-100 text-medical-600'
                }`}>
                    {doctor.availableSlots} horário{doctor.availableSlots !== 1 ? 's' : ''}
                </div>
            </div>

            {isSelected && (
                <div className="mt-3 pt-3 border-t border-primary-200 flex items-center gap-2 text-primary-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Médico selecionado</span>
                </div>
            )}
        </button>
    );
}
