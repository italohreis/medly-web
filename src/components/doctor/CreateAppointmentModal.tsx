import { useState, useEffect, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCreateAppointment } from '../../hooks/useCreateAppointment';
import { useAvailableTimeSlots } from '../../hooks/useAvailableTimeSlots';
import { usePatients } from '../../hooks/usePatients';
import { formatLocalDateTime, formatLocalTime } from '../../utils/date';

interface CreateAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CreateAppointmentModal({ 
    isOpen, 
    onClose, 
    onSuccess 
}: CreateAppointmentModalProps) {
    const [patientId, setPatientId] = useState<string>('');
    const [timeSlotId, setTimeSlotId] = useState<string>('');
    const [searchDate, setSearchDate] = useState<string>('');
    const [patientSearch, setPatientSearch] = useState<string>('');

    const { patients, loading: loadingPatients, searchPatients } = usePatients();
    const { timeSlots, loading: loadingSlots, fetchTimeSlots } = useAvailableTimeSlots();
    const { isCreating, error, createAppointment, clearError } = useCreateAppointment(() => {
        onSuccess();
        handleClose();
    });

    useEffect(() => {
        if (searchDate) {
            const startDate = `${searchDate}T00:00:00`;
            const endDate = `${searchDate}T23:59:59`;
            fetchTimeSlots(startDate, endDate);
        }
    }, [searchDate, fetchTimeSlots]);

    useEffect(() => {
        const timer = setTimeout(() => {
            searchPatients(patientSearch);
        }, 300);

        return () => clearTimeout(timer);
    }, [patientSearch, searchPatients]);

    const handleClose = () => {
        setPatientId('');
        setTimeSlotId('');
        setSearchDate('');
        setPatientSearch('');
        clearError();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!patientId || !timeSlotId) {
            return;
        }

        await createAppointment({
            patientId,
            timeSlotId
        });
    };

    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const availableTimeSlots = useMemo(() => 
        timeSlots.filter(slot => slot.status === 'AVAILABLE'),
        [timeSlots]
    );

    const selectedPatient = useMemo(() => 
        patients.find(p => String(p.id) === patientId),
        [patients, patientId]
    );

    const selectedTimeSlot = useMemo(() => 
        timeSlots.find(s => s.id === timeSlotId),
        [timeSlots, timeSlotId]
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Nova Consulta"
            size="lg"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                        <p className="text-sm text-danger-600">{error}</p>
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-info-50 border border-info-200 rounded-lg p-4">
                    <div className="flex gap-3">
                        <svg className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-info-800">
                            <p className="font-medium">Como funciona?</p>
                            <p className="mt-1">
                                Selecione uma data para visualizar seus horários disponíveis, 
                                escolha o paciente e o horário desejado para criar a consulta.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Seleção de Data */}
                <div>
                    <Input
                        label="Data da Consulta"
                        type="date"
                        value={searchDate}
                        onChange={(e) => {
                            setSearchDate(e.target.value);
                            setTimeSlotId('');
                        }}
                        min={getMinDate()}
                    />
                </div>

                {/* Seleção de Horário */}
                {searchDate && (
                    <div>
                        <label className="block text-sm font-medium text-medical-700 mb-2">
                            Horário Disponível
                        </label>
                        {loadingSlots ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                            </div>
                        ) : availableTimeSlots.length === 0 ? (
                            <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg text-center">
                                <p className="text-sm text-warning-700">
                                    Nenhum horário disponível para esta data.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                                {availableTimeSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        type="button"
                                        onClick={() => setTimeSlotId(slot.id)}
                                        className={`
                                            py-2 px-3 text-sm font-medium rounded-lg border-2 transition-all
                                            ${timeSlotId === slot.id
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-medical-200 hover:border-primary-300 text-medical-700'
                                            }
                                        `}
                                    >
                                        {formatLocalTime(slot.startTime)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Busca de Paciente */}
                <div>
                    <Input
                        label="Buscar Paciente"
                        type="text"
                        value={patientSearch}
                        onChange={(e) => setPatientSearch(e.target.value)}
                        placeholder="Digite o nome do paciente..."
                    />
                </div>

                {/* Lista de Pacientes */}
                <div>
                    <label className="block text-sm font-medium text-medical-700 mb-2">
                        Selecione o Paciente
                    </label>
                    {loadingPatients ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="p-4 bg-medical-50 border border-medical-200 rounded-lg text-center">
                            <p className="text-sm text-medical-600">
                                Nenhum paciente encontrado.
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-48 overflow-y-auto border border-medical-200 rounded-lg divide-y divide-medical-100">
                            {patients.map((patient) => (
                                <button
                                    key={patient.id}
                                    type="button"
                                    onClick={() => setPatientId(String(patient.id))}
                                    className={`
                                        w-full p-3 text-left transition-colors flex items-center gap-3
                                        ${String(patient.id) === patientId
                                            ? 'bg-primary-50'
                                            : 'hover:bg-medical-50'
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                                        ${String(patient.id) === patientId
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-medical-200 text-medical-700'
                                        }
                                    `}>
                                        {patient.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className={`font-medium ${String(patient.id) === patientId ? 'text-primary-700' : 'text-medical-900'}`}>
                                            {patient.name}
                                        </p>
                                        <p className="text-sm text-medical-500">{patient.email}</p>
                                    </div>
                                    {String(patient.id) === patientId && (
                                        <svg className="w-5 h-5 text-primary-600 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Resumo da Seleção */}
                {(selectedPatient || selectedTimeSlot) && (
                    <div className="bg-medical-50 rounded-lg p-4 border border-medical-200">
                        <h4 className="text-sm font-medium text-medical-700 mb-3">Resumo da Consulta</h4>
                        <div className="space-y-2">
                            {selectedPatient && (
                                <div className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-medical-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-medical-600">Paciente:</span>
                                    <span className="font-medium text-medical-900">{selectedPatient.name}</span>
                                </div>
                            )}
                            {selectedTimeSlot && (
                                <div className="flex items-center gap-2 text-sm">
                                    <svg className="w-4 h-4 text-medical-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-medical-600">Horário:</span>
                                    <span className="font-medium text-medical-900">
                                        {formatLocalDateTime(selectedTimeSlot.startTime)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Botões */}
                <div className="flex justify-end gap-3 pt-4 border-t border-medical-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleClose}
                        disabled={isCreating}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        isLoading={isCreating}
                        disabled={!patientId || !timeSlotId}
                    >
                        Criar Consulta
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
