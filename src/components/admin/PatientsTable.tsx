import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import type { Patient } from '../../types/admin';

interface PatientsTableProps {
    patients: Patient[];
    loading: boolean;
}

export function PatientsTable({ patients, loading }: PatientsTableProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Pacientes Registrados Recentemente</CardTitle>
                    <Link
                        to="/admin/patients"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                        Ver todos
                    </Link>
                </div>
            </CardHeader>

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
                                Telefone
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-medical-700 uppercase">
                                Ação
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-medical-200">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-medical-200 rounded w-32"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-medical-200 rounded w-40"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-medical-200 rounded w-24"></div>
                                    </td>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ))
                        ) : patients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-medical-500">
                                    Nenhum paciente encontrado.
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
                                    <td className="px-6 py-4 text-sm text-medical-600">
                                        {patient.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-medical-600">
                                        {patient.phone || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to={`/admin/patients/${patient.id}`}
                                            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                        >
                                            Ver detalhes
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
