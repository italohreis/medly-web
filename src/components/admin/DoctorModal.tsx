import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface DoctorFormData {
    name: string;
    email: string;
    crm: string;
    specialty: string;
    phone?: string;
}

interface DoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DoctorFormData) => Promise<void>;
    loading?: boolean;
}

export function DoctorModal({ isOpen, onClose, onSubmit, loading }: DoctorModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<DoctorFormData>();

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFormSubmit = async (data: DoctorFormData) => {
        await onSubmit(data);
        reset();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Novo Médico" size="lg">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nome Completo"
                        {...register('name', { required: 'Nome é obrigatório' })}
                        error={errors.name?.message}
                        placeholder="Dr. João Silva"
                    />

                    <Input
                        label="Email"
                        type="email"
                        {...register('email', {
                            required: 'Email é obrigatório',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email inválido'
                            }
                        })}
                        error={errors.email?.message}
                        placeholder="joao.silva@hospital.com"
                    />

                    <Input
                        label="CRM"
                        {...register('crm', { required: 'CRM é obrigatório' })}
                        error={errors.crm?.message}
                        placeholder="12345-SP"
                    />

                    <Input
                        label="Especialidade"
                        {...register('specialty', { required: 'Especialidade é obrigatória' })}
                        error={errors.specialty?.message}
                        placeholder="Cardiologia"
                    />

                    <Input
                        label="Telefone"
                        {...register('phone')}
                        error={errors.phone?.message}
                        placeholder="(11) 99999-9999"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={loading}
                    >
                        Cadastrar Médico
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
