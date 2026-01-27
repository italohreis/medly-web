import { api } from './api';
import type { Patient } from '../types/entities';
import type { PaginatedResponse } from '../types/common';
import type { UpdatePatientData } from '../types/entities';

interface GetPatientsParams {
    page?: number;
    size?: number;
    name?: string;
}

const getPatients = async (params: GetPatientsParams = {}): Promise<PaginatedResponse<Patient>> => {
    const { page = 0, size = 10, ...filters } = params;
    const { data } = await api.get<PaginatedResponse<Patient>>('/patients', {
        params: { page, size, sort: 'id,desc', ...filters }
    });
    return data;
};

const getPatientById = async (id: string): Promise<Patient> => {
    const { data } = await api.get<Patient>(`/patients/${id}`);
    return data;
};

const updatePatient = async (id: string, updateData: UpdatePatientData): Promise<Patient> => {
    const { data } = await api.put<Patient>(`/patients/${id}`, updateData);
    return data;
};

export const patientService = {
    getPatients,
    getPatientById,
    updatePatient
};
