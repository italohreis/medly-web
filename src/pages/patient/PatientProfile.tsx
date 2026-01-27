import { useEffect, useState } from 'react';
import { PatientLayout } from '../../components/layouts/PatientLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { usePatientProfile } from '../../hooks/usePatientProfile';
import { formatLocalDate } from '../../utils/date';
import { maskCPF } from '../../utils/masks';

export function PatientProfile() {
    const { patient, loading, updating, fetchProfile, updateProfile } = usePatientProfile();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        cpf: '',
        birthDate: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (patient) {
            setFormData({
                name: patient.name || '',
                email: patient.email || '',
                cpf: patient.cpf ? maskCPF(patient.cpf) : '',
                birthDate: patient.birthDate || ''
            });
        }
    }, [patient]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const success = await updateProfile({
            name: formData.name,
            email: formData.email,
            cpf: formData.cpf,
            birthDate: formData.birthDate || undefined
        });

        if (success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (patient) {
            setFormData({
                name: patient.name || '',
                email: patient.email || '',
                cpf: patient.cpf ? maskCPF(patient.cpf) : '',
                birthDate: patient.birthDate || ''
            });
        }
        setIsEditing(false);
    };

    const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const masked = maskCPF(e.target.value);
        setFormData({ ...formData, cpf: masked });
    };

    // Calcular idade
    const calculateAge = (birthDate: string | undefined): string => {
        if (!birthDate) return '-';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} anos`;
    };

    if (loading) {
        return (
            <PatientLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </PatientLayout>
        );
    }

    return (
        <PatientLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-medical-900">Meu Perfil</h1>
                    <p className="text-medical-600 mt-1">Visualize e edite suas informações pessoais</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Card de Perfil */}
                    <Card className="lg:col-span-1">
                        <div className="p-6 text-center">
                            <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                                {patient?.name?.charAt(0).toUpperCase() || 'P'}
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-medical-900">
                                {patient?.name || 'Paciente'}
                            </h2>
                            <p className="text-medical-500">
                                {patient?.email}
                            </p>
                            
                            <div className="mt-6 space-y-3">
                                <div className="p-3 bg-medical-50 rounded-lg">
                                    <p className="text-sm text-medical-600">Data de Nascimento</p>
                                    <p className="font-semibold text-medical-900">
                                        {formatLocalDate(patient?.birthDate)}
                                    </p>
                                </div>
                                <div className="p-3 bg-primary-50 rounded-lg">
                                    <p className="text-sm text-primary-600">Idade</p>
                                    <p className="font-semibold text-primary-900">
                                        {calculateAge(patient?.birthDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Formulário de Edição */}
                    <Card className="lg:col-span-2">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-medical-900">
                                    Informações Pessoais
                                </h3>
                                {!isEditing && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Editar
                                    </Button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-medical-700 mb-1">
                                            Nome Completo
                                        </label>
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Seu nome completo"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-medical-700 mb-1">
                                            E-mail
                                        </label>
                                        <Input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="seu@email.com"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-medical-700 mb-1">
                                                CPF
                                            </label>
                                            <Input
                                                value={formData.cpf}
                                                onChange={handleCpfChange}
                                                placeholder="000.000.000-00"
                                                maxLength={14}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-medical-700 mb-1">
                                                Data de Nascimento
                                            </label>
                                            <Input
                                                type="date"
                                                value={formData.birthDate}
                                                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={updating}
                                        >
                                            {updating ? 'Salvando...' : 'Salvar Alterações'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={handleCancel}
                                            disabled={updating}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-medical-500 mb-1">
                                                Nome Completo
                                            </label>
                                            <p className="text-medical-900 font-medium">
                                                {patient?.name || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-medical-500 mb-1">
                                                E-mail
                                            </label>
                                            <p className="text-medical-900 font-medium">
                                                {patient?.email || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-medical-500 mb-1">
                                                CPF
                                            </label>
                                            <p className="text-medical-900 font-medium">
                                                {patient?.cpf || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-medical-500 mb-1">
                                                Data de Nascimento
                                            </label>
                                            <p className="text-medical-900 font-medium">
                                                {formatLocalDate(patient?.birthDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </PatientLayout>
    );
}
