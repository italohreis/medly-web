import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { Doctor } from '../../types/admin';

export interface DoctorFormData {
    name: string;
    crm: string;
    specialty: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

interface DoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: DoctorFormData) => Promise<void>;
    loading?: boolean;
    doctor?: Doctor;
    isEditMode?: boolean;
}

export function DoctorModal({ isOpen, onClose, onSubmit, loading, doctor, isEditMode }: DoctorModalProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<DoctorFormData>();

    const password = watch('password');

    useEffect(() => {
        if (isEditMode && doctor) {
            reset({
                name: doctor.name,
                email: doctor.email || '',
                specialty: doctor.specialty,
                crm: doctor.crm,
                password: ''
            });
        } else {
            reset({
                name: '',
                email: '',
                specialty: '',
                crm: '',
                password: '',
                confirmPassword: ''
            });
        }
    }, [isEditMode, doctor, reset, isOpen]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleFormSubmit = async (data: DoctorFormData) => {
        await onSubmit(data);
        reset();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title={isEditMode ? "Editar Médico" : "Novo Médico"} size="lg">
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Nome Completo"
                        {...register('name', { required: !isEditMode ? 'Nome é obrigatório' : false })}
                        error={errors.name?.message}
                        placeholder="Dr. João Silva"
                    />

                    {!isEditMode && (
                        <Input
                            label="CRM"
                            {...register('crm', { required: 'CRM é obrigatório' })}
                            error={errors.crm?.message}
                            placeholder="12345-SP"
                        />
                    )}

                    <div className={isEditMode ? "md:col-span-2" : ""}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Especialidade
                        </label>
                        <select
                            {...register('specialty', { required: !isEditMode ? 'Especialidade é obrigatória' : false })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Selecione uma especialidade</option>
                            <option value="CARDIOLOGY">Cardiology</option>
                            <option value="DERMATOLOGY">Dermatology</option>
                            <option value="NEUROLOGY">Neurology</option>
                            <option value="PEDIATRICS">Pediatrics</option>
                            <option value="PSYCHIATRY">Psychiatry</option>
                            <option value="RADIOLOGY">Radiology</option>
                            <option value="SURGERY">Surgery</option>
                        </select>
                        {errors.specialty && (
                            <p className="text-red-500 text-sm mt-1">{errors.specialty.message}</p>
                        )}
                    </div>

                    <Input
                        label="Email"
                        type="email"
                        {...register('email', {
                            required: !isEditMode ? 'Email é obrigatório' : false,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email inválido'
                            }
                        })}
                        error={errors.email?.message}
                        placeholder="joao.silva@hospital.com"
                    />

                    {!isEditMode && (
                        <>
                            <Input
                                label="Senha"
                                type="password"
                                {...register('password', { 
                                    required: 'Senha é obrigatória',
                                    minLength: {
                                        value: 6,
                                        message: 'Senha deve ter no mínimo 6 caracteres'
                                    }
                                })}
                                error={errors.password?.message}
                                placeholder="********"
                            />
                            <Input
                                label="Confirmar Senha"
                                type="password"
                                {...register('confirmPassword', { 
                                    required: 'Confirmação de senha é obrigatória',
                                    validate: (value) => value === password || 'As senhas não coincidem'
                                })}
                                error={errors.confirmPassword?.message}
                                placeholder="********"
                            />
                        </>
                    )}
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
                        {isEditMode ? 'Salvar Alterações' : 'Cadastrar Médico'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
