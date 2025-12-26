import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';
import { PatientHome } from './pages/patient/PatientHome';
import { PrivateRoute } from './components/PrivateRoute';
import { ToastProvider } from './contexts/ToastContext';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          {/* Rota Pública */}
          <Route path="/" element={<Login />} />

          {/* Rotas de ADMIN */}
          {/* Só passa aqui se tiver token E a role for ADMIN */}
          <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            {/* Futuro: <Route path="/admin/doctors" element={<DoctorsList />} /> */}
          </Route>

          {/* Rotas de DOCTOR */}
          <Route element={<PrivateRoute allowedRoles={['DOCTOR']} />}>
            <Route path="/doctor" element={<DoctorSchedule />} />
          </Route>

          {/* Rotas de PATIENT */}
          <Route element={<PrivateRoute allowedRoles={['PATIENT']} />}>
            <Route path="/patient" element={<PatientHome />} />
            {/* Futuro: <Route path="/patient/appointments" element={<MyAppointments />} /> */}
          </Route>

          {/* Rota para qualquer URL desconhecida -> vai pro login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}