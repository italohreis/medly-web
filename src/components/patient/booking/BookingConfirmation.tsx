import type { TimeSlot } from '../../../types/entities';
import { getSpecialtyLabel } from '../../../types/common';
import { formatLocalTime } from '../../../utils/date';

interface BookingConfirmationProps {
    timeSlot: TimeSlot;
    isBooking: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function BookingConfirmation({ timeSlot, isBooking, onConfirm, onCancel }: BookingConfirmationProps) {
    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-gradient-to-br from-primary-50 to-white rounded-xl border-2 border-primary-200 p-6 shadow-lg">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-medical-900 mb-1">
                        Confirmar Agendamento
                    </h3>
                    <p className="text-sm text-medical-500 mb-4">
                        Revise os detalhes da consulta antes de confirmar
                    </p>

                    {/* Detalhes da Consulta */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-medical-200">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold">
                                {timeSlot.doctor.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-semibold text-medical-900">
                                    Dr(a). {timeSlot.doctor.name}
                                </p>
                                <p className="text-sm text-medical-500">
                                    {getSpecialtyLabel(timeSlot.doctor.specialty)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-medical-200">
                            <div className="w-10 h-10 rounded-full bg-medical-100 flex items-center justify-center">
                                <svg className="w-5 h-5 text-medical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-semibold text-medical-900 capitalize">
                                    {formatDate(timeSlot.startTime)}
                                </p>
                                <p className="text-sm text-primary-600 font-medium">
                                    {formatLocalTime(timeSlot.startTime)} - {formatLocalTime(timeSlot.endTime)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isBooking}
                            className="flex-1 px-4 py-2.5 border border-medical-300 text-medical-700 rounded-lg font-medium hover:bg-medical-50 transition-colors disabled:opacity-50"
                        >
                            Alterar Horário
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isBooking}
                            className="flex-1 px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isBooking ? (
                                <>
                                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                    Agendando...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Confirmar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
