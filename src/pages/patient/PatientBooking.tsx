import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PatientLayout } from '../../components/layouts/PatientLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useBookAppointment } from '../../hooks/useBookAppointment';
import { BookingFilters, type BookingFiltersData } from '../../components/patient/BookingFilters';
import { TimeSlotCard } from '../../components/patient/TimeSlotCard';
import { CalendarIcon } from '../../components/icons';

export function PatientBooking() {
    const navigate = useNavigate();
    const { 
        timeSlots, 
        loading, 
        booking, 
        hasSearched,
        searchTimeSlots, 
        bookAppointment 
    } = useBookAppointment();

    const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

    const handleSearch = (filters: BookingFiltersData) => {
        setSelectedSlotId(null);
        searchTimeSlots(filters);
    };

    const handleSelectSlot = (slotId: string) => {
        setSelectedSlotId(slotId === selectedSlotId ? null : slotId);
    };

    const handleConfirmBooking = async () => {
        if (!selectedSlotId) return;

        const success = await bookAppointment(selectedSlotId);
        if (success) {
            navigate('/patient/appointments');
        }
    };

    return (
        <PatientLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-medical-900">Agendar Consulta</h1>
                    <p className="text-medical-600 mt-1">
                        Encontre um horário disponível e agende sua consulta
                    </p>
                </div>

                {/* Filtros de Busca */}
                <BookingFilters onSearch={handleSearch} loading={loading} />

                {/* Resultados */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : hasSearched ? (
                    timeSlots.length === 0 ? (
                        <Card className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 bg-medical-100 rounded-full flex items-center justify-center">
                                <span className="w-8 h-8 text-medical-400">
                                    <CalendarIcon />
                                </span>
                            </div>
                            <h3 className="text-lg font-medium text-medical-900 mb-2">
                                Nenhum horário disponível
                            </h3>
                            <p className="text-medical-500">
                                Tente alterar os filtros ou buscar em outro período.
                            </p>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            {/* Contador de resultados */}
                            <div className="flex items-center justify-between">
                                <p className="text-medical-600">
                                    <span className="font-semibold text-medical-900">{timeSlots.length}</span> horário(s) encontrado(s)
                                </p>

                                {selectedSlotId && (
                                    <Button
                                        onClick={handleConfirmBooking}
                                        isLoading={booking}
                                        disabled={booking}
                                    >
                                        Confirmar Agendamento
                                    </Button>
                                )}
                            </div>

                            {/* Lista de TimeSlots */}
                            <div className="grid gap-4">
                                {timeSlots.map((slot) => (
                                    <TimeSlotCard
                                        key={slot.id}
                                        timeSlot={slot}
                                        onSelect={handleSelectSlot}
                                        isBooking={booking}
                                        selectedId={selectedSlotId || undefined}
                                    />
                                ))}
                            </div>

                            {selectedSlotId && (
                                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-medical-200 md:hidden">
                                    <Button
                                        onClick={handleConfirmBooking}
                                        isLoading={booking}
                                        disabled={booking}
                                        className="w-full"
                                    >
                                        Confirmar Agendamento
                                    </Button>
                                </div>
                            )}
                        </div>
                    )
                ) : (
                    <Card className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-medical-900 mb-2">
                            Busque por horários disponíveis
                        </h3>
                        <p className="text-medical-500">
                            Selecione uma especialidade e um período para ver os horários disponíveis.
                        </p>
                    </Card>
                )}
            </div>
        </PatientLayout>
    );
}
