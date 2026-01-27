import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientLayout } from '../../components/layouts/PatientLayout';
import { Card } from '../../components/ui/Card';
import { useBookAppointment } from '../../hooks/useBookAppointment';
import { 
    SpecialtyFilter, 
    DateRangePicker, 
    DoctorCard, 
    TimeSlotGrid,
    BookingConfirmation,
    type DoctorInfo 
} from '../../components/patient/booking';
import { CalendarIcon } from '../../components/icons';
import type { Specialty } from '../../types/common';

type BookingStep = 'filters' | 'doctors' | 'timeslots' | 'confirmation';

export function PatientBooking() {
    const navigate = useNavigate();
    const { 
        timeSlots, 
        loading, 
        booking, 
        hasSearched,
        searchTimeSlots, 
        bookAppointment,
        clearResults 
    } = useBookAppointment();

    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [specialty, setSpecialty] = useState<Specialty | ''>('');
    const [startDate, setStartDate] = useState(today);
    const [endDate, setEndDate] = useState(nextWeek);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    // Derived state: extrair médicos únicos dos timeslots
    const availableDoctors: DoctorInfo[] = useMemo(() => {
        const doctorMap = new Map<string, DoctorInfo>();
        
        timeSlots.forEach(slot => {
            const existing = doctorMap.get(slot.doctor.id);
            if (existing) {
                existing.availableSlots++;
            } else {
                doctorMap.set(slot.doctor.id, {
                    id: slot.doctor.id,
                    name: slot.doctor.name,
                    specialty: slot.doctor.specialty as Specialty | undefined,
                    availableSlots: 1
                });
            }
        });

        return Array.from(doctorMap.values())
            .sort((a, b) => b.availableSlots - a.availableSlots);
    }, [timeSlots]);

    const filteredTimeSlots = useMemo(() => {
        if (!selectedDoctorId) return [];
        return timeSlots.filter(slot => slot.doctor.id === selectedDoctorId);
    }, [timeSlots, selectedDoctorId]);

    const selectedTimeSlot = useMemo(() => {
        if (!selectedSlotId) return null;
        return timeSlots.find(slot => slot.id === selectedSlotId) || null;
    }, [timeSlots, selectedSlotId]);

    const currentStep: BookingStep = useMemo(() => {
        if (selectedSlotId && selectedTimeSlot) return 'confirmation';
        if (selectedDoctorId) return 'timeslots';
        if (hasSearched && availableDoctors.length > 0) return 'doctors';
        return 'filters';
    }, [selectedSlotId, selectedTimeSlot, selectedDoctorId, hasSearched, availableDoctors.length]);

    const handleSearch = () => {
        setSelectedDoctorId(null);
        setSelectedSlotId(null);
        
        searchTimeSlots({
            specialty: specialty || undefined,
            startDate: `${startDate}T00:00:00`,
            endDate: `${endDate}T23:59:59`
        });
    };

    const handleSelectDoctor = (doctorId: string) => {
        setSelectedDoctorId(doctorId === selectedDoctorId ? null : doctorId);
        setSelectedSlotId(null);
    };

    const handleSelectSlot = (slotId: string) => {
        setSelectedSlotId(slotId);
    };

    const handleClearSlot = () => {
        setSelectedSlotId(null);
    };

    const handleBackToDoctors = () => {
        setSelectedDoctorId(null);
        setSelectedSlotId(null);
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlotId) return;

        const success = await bookAppointment(selectedSlotId);
        if (success) {
            navigate('/patient/appointments');
        }
    };

    const handleReset = () => {
        setSpecialty('');
        setStartDate(today);
        setEndDate(nextWeek);
        setSelectedDoctorId(null);
        setSelectedSlotId(null);
        clearResults();
    };

    const renderStepIndicator = () => {
        const steps = [
            { key: 'filters', label: 'Filtros', icon: '1' },
            { key: 'doctors', label: 'Médico', icon: '2' },
            { key: 'timeslots', label: 'Horário', icon: '3' },
            { key: 'confirmation', label: 'Confirmar', icon: '4' }
        ];

        const currentIndex = steps.findIndex(s => s.key === currentStep);

        return (
            <div className="flex items-center justify-center gap-2 mb-8">
                {steps.map((step, index) => {
                    const isActive = index <= currentIndex;
                    const isCurrent = step.key === currentStep;

                    return (
                        <div key={step.key} className="flex items-center">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors ${
                                isCurrent 
                                    ? 'bg-primary-600 text-white' 
                                    : isActive 
                                        ? 'bg-primary-100 text-primary-700' 
                                        : 'bg-medical-100 text-medical-400'
                            }`}>
                                <span className="text-sm font-bold">{step.icon}</span>
                                <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-8 h-0.5 mx-1 ${
                                    index < currentIndex ? 'bg-primary-300' : 'bg-medical-200'
                                }`} />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <PatientLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-medical-900">Agendar Consulta</h1>
                        <p className="text-medical-600 mt-1">
                            Encontre um horário disponível e agende sua consulta
                        </p>
                    </div>
                    {hasSearched && (
                        <button
                            onClick={handleReset}
                            className="text-sm text-medical-500 hover:text-medical-700 flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reiniciar
                        </button>
                    )}
                </div>

                {/* Step Indicator */}
                {renderStepIndicator()}

                {/* Filtros */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <SpecialtyFilter value={specialty} onChange={setSpecialty} />
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateChange={setStartDate}
                        onEndDateChange={setEndDate}
                    />
                </div>

                {/* Botão de Busca */}
                {currentStep === 'filters' && (
                    <div className="flex justify-center">
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary-600/30"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                                    Buscando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Buscar Horários Disponíveis
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                )}

                {/* Nenhum resultado */}
                {!loading && hasSearched && availableDoctors.length === 0 && (
                    <Card className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-medical-100 rounded-full flex items-center justify-center">
                            <span className="w-8 h-8 text-medical-400">
                                <CalendarIcon />
                            </span>
                        </div>
                        <h3 className="text-lg font-medium text-medical-900 mb-2">
                            Nenhum horário disponível
                        </h3>
                        <p className="text-medical-500 mb-4">
                            Tente alterar os filtros ou buscar em outro período.
                        </p>
                        <button
                            onClick={handleSearch}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Buscar novamente
                        </button>
                    </Card>
                )}

                {/* Lista de Médicos */}
                {!loading && currentStep === 'doctors' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-medical-900">
                                Selecione um médico
                            </h3>
                            <span className="text-sm text-medical-500">
                                {availableDoctors.length} médico(s) disponível(is)
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableDoctors.map(doctor => (
                                <DoctorCard
                                    key={doctor.id}
                                    doctor={doctor}
                                    isSelected={selectedDoctorId === doctor.id}
                                    onSelect={handleSelectDoctor}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Horários do Médico Selecionado */}
                {!loading && currentStep === 'timeslots' && selectedDoctorId && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleBackToDoctors}
                                    className="p-2 hover:bg-medical-100 rounded-lg transition-colors"
                                >
                                    <svg className="w-5 h-5 text-medical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <h3 className="text-lg font-semibold text-medical-900">
                                    Escolha um horário
                                </h3>
                            </div>
                            <span className="text-sm text-medical-500">
                                {filteredTimeSlots.length} horário(s)
                            </span>
                        </div>

                        <Card className="p-6">
                            <TimeSlotGrid
                                timeSlots={filteredTimeSlots}
                                selectedId={selectedSlotId}
                                isBooking={booking}
                                onSelect={handleSelectSlot}
                            />
                        </Card>
                    </div>
                )}

                {/* Confirmação */}
                {!loading && currentStep === 'confirmation' && selectedTimeSlot && (
                    <BookingConfirmation
                        timeSlot={selectedTimeSlot}
                        isBooking={booking}
                        onConfirm={handleConfirmBooking}
                        onCancel={handleClearSlot}
                    />
                )}
            </div>
        </PatientLayout>
    );
}
