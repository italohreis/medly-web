import { useDoctorDashboard } from '../../hooks/useDoctorDashboard';
import { useForm } from 'react-hook-form';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
  });
};

export function DoctorSchedule() {
  const { appointments, windows, loading, handleStatusChange, handleAddWindow, userName } = useDoctorDashboard();

  const { register, handleSubmit, reset } = useForm<{ startTime: string, endTime: string, slotDurationInMinutes: number }>();

  const onSubmitWindow = async (data: { startTime: string, endTime: string, slotDurationInMinutes: number }) => {
    await handleAddWindow(data);
    reset();
  };

  if (loading) return <div className="p-8 flex justify-center">Carregando painel médico...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 via-white to-medical-50">
      {/* Header */}
      <header className="bg-white border-b border-medical-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-medical-900">Painel do Médico</h1>
              <p className="text-medical-600 mt-1">
                Bem-vindo, Dr(a). {userName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {userName?.charAt(0) || 'D'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Próximas Consultas
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {appointments.length === 0 ? (
                  <p className="p-6 text-center text-gray-500">Nenhuma consulta agendada.</p>
                ) : (
                  appointments.map((apt) => (
                    <div key={apt.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 transition-colors">
                      <div className="flex gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{apt.patient.name}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1 gap-3">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {formatDate(apt.startTime)}
                            </span>
                          </div>
                          <span className={`mt-2 inline-flex text-xs font-semibold px-2 py-1 rounded-full 
                          ${apt.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                              apt.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {apt.status === 'SCHEDULED' ? 'Agendado' : apt.status === 'COMPLETED' ? 'Finalizado' : 'Cancelado'}
                          </span>
                        </div>
                      </div>

                      {/* Ações */}
                      {apt.status === 'SCHEDULED' && (
                        <div className="mt-4 sm:mt-0 flex gap-2">
                          <button
                            onClick={() => handleStatusChange(apt.id, 'COMPLETED')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg> Finalizar
                          </button>
                          <button
                            onClick={() => handleStatusChange(apt.id, 'CANCELLED')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-sm font-medium transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg> Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* COLUNA DA DIREITA: CONFIGURAR AGENDA (Menor) */}
          <div className="space-y-6">

            {/* Formulário de Nova Janela */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Adicionar Horário
              </h2>
              <form onSubmit={handleSubmit(onSubmitWindow)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora de Início</label>
                  <input 
                    type="datetime-local" 
                    {...register('startTime')} 
                    required 
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora de Término</label>
                  <input 
                    type="datetime-local" 
                    {...register('endTime')} 
                    required 
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duração de cada slot (minutos)</label>
                  <input 
                    type="number" 
                    min="15"
                    step="15"
                    defaultValue={30}
                    {...register('slotDurationInMinutes', { valueAsNumber: true })} 
                    required 
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 border p-2" 
                    placeholder="30"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium transition-colors shadow-sm">
                  Salvar Disponibilidade
                </button>
              </form>
            </div>

            {/* Lista de Janelas Atuais */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Suas Janelas de Disponibilidade</h3>
              <div className="space-y-3">
                {windows.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhuma janela configurada.</p>
                ) : (
                  windows.map((win, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">
                          {new Date(win.startTime).toLocaleString('pt-BR', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        até {new Date(win.endTime).toLocaleString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}