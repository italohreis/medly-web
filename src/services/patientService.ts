import { api } from './api';
import type { Patient } from '../types/entities';
import type { PaginatedResponse } from '../types/common';

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

export const patientService = {
    getPatients,
    getPatientById
};
