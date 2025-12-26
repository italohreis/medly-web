import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '../types/auth.ts';

interface PrivateRouteProps {
  allowedRoles?: Role[];
}

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  // Recupera dados do localStorage (salvos no useLogin)
  const token = localStorage.getItem('medly_token');
  const userRole = localStorage.getItem('medly_role') as Role;

  // 1. Se não tem token, manda pro Login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Se a rota exige roles específicas e o usuário não tem a role certa
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redireciona para o dashboard correto baseado na role dele (para não ficar preso)
    // Ou para uma página de "Acesso Negado" (403)
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (userRole === 'DOCTOR') return <Navigate to="/doctor" replace />;
    if (userRole === 'PATIENT') return <Navigate to="/patient" replace />;
    
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}