export type Role = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: Role;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  birthDate: string;
}