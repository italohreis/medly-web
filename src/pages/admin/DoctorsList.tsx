import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import { DoctorModal, type DoctorFormData } from '../../components/admin/DoctorModal';
import { useDoctorsList } from '../../hooks/useDoctorsList';
import { doctorService } from '../../services/doctorService';
import { useToast } from '../../hooks/useToast';

export function DoctorsList() {
    const { doctors, totalPages, totalElements, currentPage, loading, setCurrentPage, refetch } = useDoctorsList(10);
    const { showToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<typeof doctors[0] | null>(null);

    const handleCreateDoctor = async (data: DoctorFormData) => {
        setIsSubmitting(true);
        try {
            await doctorService.createDoctor(data);
            showToast('Médico cadastrado com sucesso!', 'success');
            setIsModalOpen(false);
            refetch();
        } catch (error) {
            console.error('Erro ao cadastrar médico:', error);
            showToast('Erro ao cadastrar médico. Tente novamente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateDoctor = async (data: DoctorFormData) => {
        if (!editingDoctor) return;
        setIsSubmitting(true);
        try {
            const updateData: Partial<Pick<typeof doctors[0], 'name' | 'email' | 'specialty'>> = {};
            if (data.name) updateData.name = data.name;
            if (data.email) updateData.email = data.email;
            if (data.specialty) updateData.specialty = data.specialty;

            await doctorService.updateDoctor(String(editingDoctor.id), updateData);
            showToast('Médico atualizado com sucesso!', 'success');
            setIsModalOpen(false);
            setEditingDoctor(null);
            refetch();
        } catch (error) {
            console.error('Erro ao atualizar médico:', error);
            showToast('Erro ao atualizar médico. Tente novamente.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteDoctor = async (id: string, name: string) => {
        if (!confirm(`Tem certeza que deseja excluir o médico ${name}?`)) return;

        try {
            await doctorService.deleteDoctor(id);
            showToast('Médico excluído com sucesso!', 'success');
            refetch();
        } catch (error) {
            console.error('Erro ao excluir médico:', error);
            showToast('Erro ao excluir médico. Tente novamente.', 'error');
        }
    };

    const openEditModal = (doctor: typeof doctors[0]) => {
        setEditingDoctor(doctor);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setEditingDoctor(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingDoctor(null);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <Link
                            to="/admin"
                            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 font-medium mb-2"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Voltar ao Dashboard
                        </Link>
                        <h1 className="text-3xl font-bold text-medical-900">Médicos</h1>
                        <p className="text-medical-600 mt-1">
                            {totalElements} médicos cadastrados
                        </p>
                    </div>
                    <Button variant="primary" size="md" onClick={openCreateModal}>
                        Novo Médico
                    </Button>
                </div>

                <Card>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-medical-50 border-y border-medical-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        Nome
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        Especialidade
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        CRM
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-medical-700 uppercase">
                                        Ação
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-medical-200">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-24"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-20"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-40"></div></td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    ))
                                ) : doctors.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-medical-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                                <p className="text-medical-600 font-medium">Nenhum médico encontrado</p>
                                                <p className="text-medical-500 text-sm mt-1">Comece adicionando um novo médico</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    doctors.map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-medical-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm mr-3">
                                                        {doctor.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-medical-900">
                                                        {doctor.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                                                    {doctor.specialty}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-medical-600">{doctor.crm}</td>
                                            <td className="px-6 py-4 text-sm text-medical-600">{doctor.email || '-'}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <button
                                                        onClick={() => openEditModal(doctor)}
                                                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteDoctor(String(doctor.id), doctor.name)}
                                                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {!loading && doctors.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            loading={loading}
                        />
                    )}
                </Card>
            </div>

            <DoctorModal
                isOpen={isModalOpen}
                onClose={closeModal}
                onSubmit={editingDoctor ? handleUpdateDoctor : handleCreateDoctor}
                doctor={editingDoctor || undefined}
                isEditMode={!!editingDoctor}
                loading={isSubmitting}
            />
        </DashboardLayout>
    );
}
