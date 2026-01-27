export interface PatientSummary {
    id: string;
    name: string;
}

export interface Patient {
    id: string;
    name: string;
    email: string;
    phone?: string;
    cpf?: string;
    birthDate?: string;
}

export interface UpdatePatientData {
    name?: string;
    email?: string;
    cpf?: string;
    birthDate?: string;
}
