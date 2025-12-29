export interface PatientProfile {
    patientId: string;
    cpf: string;
    birthDate: string;
}

export interface DoctorProfile {
    doctorId: string;
    crm: string;
    specialty: string;
}

export interface UserProfile {
    userId: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    patientProfile?: PatientProfile;
    doctorProfile?: DoctorProfile;
}
