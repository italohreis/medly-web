import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface ScheduleFormData {
    startTime: string;
    endTime: string;
    slotDurationInMinutes: number;
}

interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ScheduleFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export function ScheduleModal({ isOpen, onClose, onSubmit, isSubmitting = false }: ScheduleModalProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ScheduleFormData>({
        defaultValues: {
            slotDurationInMinutes: 30
        }
    });

    const handleFormSubmit = async (data: ScheduleFormData) => {
        await onSubmit(data);
        reset();
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Adicionar Novo Horário" size="lg">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                <div className="bg-info-50 border border-info-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-3">
                        <svg className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-info-800">
                            <p className="font-medium">Como funciona?</p>
                            <p className="mt-1">
                                Configure uma janela de tempo (ex: 08:00 às 12:00) e o sistema criará automaticamente
                                os slots de consulta com base na duração definida.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-medical-700 mb-2">
                            Data e Hora de Início
                        </label>
                        <input
                            type="datetime-local"
                            {...register('startTime', { required: 'Campo obrigatório' })}
                            className="w-full px-4 py-3 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        {errors.startTime && (
                            <p className="mt-1 text-sm text-danger-600">{errors.startTime.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-medical-700 mb-2">
                            Data e Hora de Término
                        </label>
                        <input
                            type="datetime-local"
                            {...register('endTime', { required: 'Campo obrigatório' })}
                            className="w-full px-4 py-3 border border-medical-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        {errors.endTime && (
                            <p className="mt-1 text-sm text-danger-600">{errors.endTime.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-medical-700 mb-2">
                        Duração de cada consulta (minutos)
                    </label>
                    <div className="flex gap-3">
                        {[15, 30, 45, 60].map((duration) => (
                            <label key={duration} className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value={duration}
                                    {...register('slotDurationInMinutes', { valueAsNumber: true })}
                                    className="sr-only peer"
                                />
                                <div className="text-center py-3 px-4 border-2 border-medical-200 rounded-lg peer-checked:border-primary-500 peer-checked:bg-primary-50 peer-checked:text-primary-700 transition-all">
                                    <span className="font-medium">{duration} min</span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={handleClose}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar Horário'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
