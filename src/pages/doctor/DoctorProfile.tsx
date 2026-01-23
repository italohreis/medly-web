import { useEffect, useState } from 'react';
import { DoctorLayout } from '../../components/layouts/DoctorLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useDoctorProfile } from '../../hooks/useDoctorProfile';
import { SPECIALTIES } from '../../types/common';

export function DoctorProfile() {
    const { doctor, loading, updating, fetchProfile, updateProfile } = useDoctorProfile();
    
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialty: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (doctor) {
            setFormData({
                name: doctor.name || '',
                email: doctor.email || '',
                specialty: doctor.specialty || ''
            });
        }
    }, [doctor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const success = await updateProfile({
            name: formData.name,
            email: formData.email,
            specialty: formData.specialty
        });

        if (success) {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        if (doctor) {
            setFormData({
                name: doctor.name || '',
                email: doctor.email || '',
                specialty: doctor.specialty || ''
            });
        }
        setIsEditing(false);
    };

    if (loading) {
        return (
            <DoctorLayout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            </DoctorLayout>
        );
    }

    return (
        <DoctorLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-medical-900">Meu Perfil</h1>
                    <p className="text-medical-600 mt-1">Visualize e edite suas informações</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Card de Perfil */}
                    <Card className="lg:col-span-1">
                        <div className="p-6 text-center">
                            <div className="h-24 w-24 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                                {doctor?.name?.charAt(0).toUpperCase() || 'D'}
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-medical-900">
                                Dr(a). {doctor?.name}
                            </h2>
                            <p className="text-medical-500">
                                {SPECIALTIES.find(s => s.value === doctor?.specialty)?.label || doctor?.specialty}
                            </p>
                            <div className="mt-4 p-3 bg-medical-50 rounded-lg">
                                <p className="text-sm text-medical-600">CRM</p>
                                <p className="font-semibold text-medical-900">{doctor?.crm}</p>
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

                                    <div>
                                        <label className="block text-sm font-medium text-medical-700 mb-1">
                                            Especialidade
                                        </label>
                                        <select
                                            value={formData.specialty}
                                            onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-medical-300 rounded-xl text-medical-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                                        >
                                            <option value="">Selecione uma especialidade</option>
                                            {SPECIALTIES.map((spec) => (
                                                <option key={spec.value} value={spec.value}>
                                                    {spec.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-medical-700 mb-1">
                                            CRM
                                        </label>
                                        <Input
                                            value={doctor?.crm || ''}
                                            disabled
                                            className="bg-medical-100 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-medical-500 mt-1">
                                            O CRM não pode ser alterado
                                        </p>
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
                                                {doctor?.name || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-medical-500 mb-1">
                                                E-mail
                                            </label>
                                            <p className="text-medical-900 font-medium">
                                                {doctor?.email || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-medical-500 mb-1">
                                                Especialidade
                                            </label>
                                            <p className="text-medical-900 font-medium">
                                                {SPECIALTIES.find(s => s.value === doctor?.specialty)?.label || doctor?.specialty || '-'}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-medical-500 mb-1">
                                                CRM
                                            </label>
                                            <p className="text-medical-900 font-medium">
                                                {doctor?.crm || '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </DoctorLayout>
    );
}
