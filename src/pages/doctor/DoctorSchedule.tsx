import { authService } from '../../services/authService';

export function DoctorSchedule() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-800">Painel do Doutor</h1>
      <p className="mt-4">Bem-vindo, Doutor. Aqui você gerencia sua agenda e pacientes.</p>
      <button onClick={authService.logout} className="mt-6 bg-red-500 text-white px-4 py-2 rounded">
        Sair
      </button>
    </div>
  );
}