import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';
import { PatientHome } from './pages/patient/PatientHome';
import { PrivateRoute } from './components/PrivateRoute';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Rota Pública */}
            <Route path="/" element={<Login />} />

            {/* Rotas de ADMIN */}
            <Route element={<PrivateRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Rotas de DOCTOR */}
            <Route element={<PrivateRoute allowedRoles={['DOCTOR']} />}>
              <Route path="/doctor" element={<DoctorSchedule />} />
            </Route>

            {/* Rotas de PATIENT */}
            <Route element={<PrivateRoute allowedRoles={['PATIENT']} />}>
              <Route path="/patient" element={<PatientHome />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}