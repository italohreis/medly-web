import { Navigate, Outlet } from 'react-router-dom';
import type { Role } from '../types/auth.ts';

interface PrivateRouteProps {
  allowedRoles?: Role[];
}

export function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const token = localStorage.getItem('medly_token');
  const userRole = localStorage.getItem('medly_role') as Role;

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (userRole === 'DOCTOR') return <Navigate to="/doctor" replace />;
    if (userRole === 'PATIENT') return <Navigate to="/patient" replace />;
    
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}