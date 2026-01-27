import { api } from './api';
import type { Doctor } from '../types/entities';
import type { PaginatedResponse } from '../types/common';
import type { DoctorUpdateData } from '../types/entities';

interface GetDoctorsParams {
    page?: number;
    size?: number;
    name?: string;
    specialty?: string;
    crm?: string;
}

const getDoctors = async (params: GetDoctorsParams = {}): Promise<PaginatedResponse<Doctor>> => {
    const { page = 0, size = 10, ...filters } = params;
    const { data } = await api.get<PaginatedResponse<Doctor>>('/doctors', {
        params: { page, size, sort: 'id,desc', ...filters }
    });
    return data;
};

const getDoctorById = async (id: string): Promise<Doctor> => {
    const { data } = await api.get<Doctor>(`/doctors/${id}`);
    return data;
};

const createDoctor = async (doctor: Omit<Doctor, 'id'>): Promise<Doctor> => {
    const { data } = await api.post<Doctor>('/doctors', doctor);
    return data;
};

const updateDoctor = async (id: string, doctor: DoctorUpdateData): Promise<Doctor> => {
    const { data } = await api.put<Doctor>(`/doctors/${id}`, doctor);
    return data;
};

const deleteDoctor = async (id: string): Promise<void> => {
    await api.delete(`/doctors/${id}`);
};

export const doctorService = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
};