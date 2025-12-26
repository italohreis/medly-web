import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import type { Doctor } from '../../types/admin';

interface DoctorsTableProps {
    doctors: Doctor[];
    loading: boolean;
}

export function DoctorsTable({ doctors, loading }: DoctorsTableProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Médicos Adicionados Recentemente</CardTitle>
                    <Link
                        to="/admin/doctors"
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
                                Especialidade
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-medical-700 uppercase">
                                CRM
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
                                        <div className="h-4 bg-medical-200 rounded w-24"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 bg-medical-200 rounded w-16"></div>
                                    </td>
                                    <td className="px-6 py-4"></td>
                                </tr>
                            ))
                        ) : doctors.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-medical-500">
                                    Nenhum médico encontrado.
                                </td>
                            </tr>
                        ) : (
                            doctors.map((doc) => (
                                <tr key={doc.id} className="hover:bg-medical-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm mr-3">
                                                {doc.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-medical-900">
                                                {doc.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                                            {doc.specialty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-medical-600">{doc.crm}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to={`/admin/doctors/${doc.id}`}
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
