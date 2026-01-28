import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { Card } from '../../components/ui/Card';
import { Pagination } from '../../components/ui/Pagination';
import { ConfirmationModal } from '../../components/ui/ConfirmationModal';
import { usePatientsList } from '../../hooks/usePatientsList';
import { patientService } from '../../services/patientService';
import { useToast } from '../../hooks/useToast';
import { formatLocalDate } from '../../utils/date';
import { maskCPF } from '../../utils/masks';

export function PatientsList() {
    const { patients, totalPages, totalElements, currentPage, loading, setCurrentPage, refetch } = usePatientsList(10);
    const { showToast } = useToast();
    const [deletingPatient, setDeletingPatient] = useState<{ id: string; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeletePatient = async () => {
        if (!deletingPatient) return;

        setIsDeleting(true);
        try {
            await patientService.deletePatient(deletingPatient.id);
            showToast('Paciente excluído com sucesso!', 'success');
            setDeletingPatient(null);
            refetch();
        } catch (error) {
            console.error('Erro ao excluir paciente:', error);
            showToast('Erro ao excluir paciente. Tente novamente.', 'error');
        } finally {
            setIsDeleting(false);
        }
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
                        <h1 className="text-3xl font-bold text-medical-900">Pacientes</h1>
                        <p className="text-medical-600 mt-1">
                            {totalElements} pacientes registrados
                        </p>
                    </div>
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
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        CPF
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                        Data de Nascimento
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-medical-700 uppercase">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-medical-200">
                                {loading ? (
                                    [1, 2, 3, 4, 5].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-40"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-28"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-medical-200 rounded w-24"></div></td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    ))
                                ) : patients.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-12 h-12 text-medical-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <p className="text-medical-600 font-medium">Nenhum paciente encontrado</p>
                                                <p className="text-medical-500 text-sm mt-1">Os pacientes aparecerão aqui após o cadastro</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient) => (
                                        <tr key={patient.id} className="hover:bg-medical-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-success-100 flex items-center justify-center text-success-700 font-bold text-sm mr-3">
                                                        {patient.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-medical-900">
                                                        {patient.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-medical-600">{patient.email}</td>
                                            <td className="px-6 py-4 text-sm text-medical-600">
                                                {patient.cpf ? maskCPF(patient.cpf) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-medical-600">
                                                {formatLocalDate(patient.birthDate)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setDeletingPatient({ id: patient.id, name: patient.name })}
                                                    className="text-danger-600 hover:text-danger-700 font-medium text-sm"
                                                    title="Excluir paciente"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {!loading && patients.length > 0 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            loading={loading}
                        />
                    )}
                </Card>
            </div>

            <ConfirmationModal
                isOpen={!!deletingPatient}
                onClose={() => setDeletingPatient(null)}
                onConfirm={handleDeletePatient}
                title="Excluir Paciente"
                message={`Tem certeza que deseja excluir o paciente ${deletingPatient?.name}? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                variant="danger"
                isLoading={isDeleting}
            />
        </DashboardLayout>
    );
}
