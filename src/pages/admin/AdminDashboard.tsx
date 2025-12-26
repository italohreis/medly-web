import { useAuth } from '../../hooks/useAuth';
import { useAdminDashboard } from '../../hooks/useAdminDashboard';
import { DashboardLayout } from '../../components/layouts/DashboardLayout';
import { StatCard } from '../../components/admin/StatCard';
import { DoctorsTable } from '../../components/admin/DoctorsTable';
import { PatientsTable } from '../../components/admin/PatientsTable';

export function AdminDashboard() {
  const { user } = useAuth();
  const { stats, recentDoctors, recentPatients, loading } = useAdminDashboard();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Cabeçalho */}
        <div>
          <h1 className="text-3xl font-bold text-medical-900">Visão Geral</h1>
          <p className="text-medical-600 mt-1">
            Bem-vindo ao painel administrativo, {user?.role}.
          </p>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Médicos"
            value={stats.doctors}
            loading={loading}
            colorClass="bg-primary-100"
            to="/admin/doctors"
            icon={
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            }
          />

          <StatCard
            title="Pacientes"
            value={stats.patients}
            loading={loading}
            colorClass="bg-success-100"
            to="/admin/patients"
            icon={
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />

          <StatCard
            title="Consultas"
            value={stats.appointments}
            loading={loading}
            colorClass="bg-info-100"
            to="/admin/appointments"
            icon={
              <svg className="w-8 h-8 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>

        <DoctorsTable doctors={recentDoctors} loading={loading} />

        <PatientsTable patients={recentPatients} loading={loading} />
      </div>
    </DashboardLayout>
  );
}