import axios from 'axios';
import type {
    Doctor,
    DoctorFormData,
    Paciente,
    PacienteFormData,
    Consulta,
    ConsultaFormData,
    Especialidad,
    Historial,
    Receta
} from '@/types';

// Base URL del backend Spring Boot
const API_BASE_URL = 'http://localhost:8080/api';

// Configuración de axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==================== ESPECIALIDADES ====================
export const especialidadesApi = {
    getAll: async (): Promise<Especialidad[]> => {
        const response = await api.get<Especialidad[]>('/especialidades');
        return response.data;
    },

    getById: async (id: number): Promise<Especialidad> => {
        const response = await api.get<Especialidad>(`/especialidades/${id}`);
        return response.data;
    },
};

// ==================== DOCTORES ====================
export const doctoresApi = {
    getAll: async (): Promise<Doctor[]> => {
        const response = await api.get<Doctor[]>('/doctores');
        return response.data;
    },

    getById: async (id: number): Promise<Doctor> => {
        const response = await api.get<Doctor>(`/doctores/${id}`);
        return response.data;
    },

    create: async (doctor: DoctorFormData): Promise<Doctor> => {
        const response = await api.post<Doctor>('/doctores', doctor);
        return response.data;
    },

    update: async (id: number, doctor: DoctorFormData): Promise<Doctor> => {
        const response = await api.put<Doctor>(`/doctores/${id}`, doctor);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/doctores/${id}`);
    },
};

// ==================== PACIENTES ====================
export const pacientesApi = {
    getAll: async (): Promise<Paciente[]> => {
        const response = await api.get<Paciente[]>('/pacientes');
        return response.data;
    },

    getById: async (id: number): Promise<Paciente> => {
        const response = await api.get<Paciente>(`/pacientes/${id}`);
        return response.data;
    },

    create: async (paciente: PacienteFormData): Promise<Paciente> => {
        const response = await api.post<Paciente>('/pacientes', paciente);
        return response.data;
    },

    update: async (id: number, paciente: PacienteFormData): Promise<Paciente> => {
        const response = await api.put<Paciente>(`/pacientes/${id}`, paciente);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/pacientes/${id}`);
    },
};

// ==================== CONSULTAS ====================
export const consultasApi = {
    getAll: async (): Promise<Consulta[]> => {
        const response = await api.get<Consulta[]>('/consultas');
        return response.data;
    },

    getById: async (id: number): Promise<Consulta> => {
        const response = await api.get<Consulta>(`/consultas/${id}`);
        return response.data;
    },

    create: async (consulta: ConsultaFormData): Promise<Consulta> => {
        const response = await api.post<Consulta>('/consultas', consulta);
        return response.data;
    },

    update: async (id: number, consulta: ConsultaFormData): Promise<Consulta> => {
        const response = await api.put<Consulta>(`/consultas/${id}`, consulta);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/consultas/${id}`);
    },
};

// ==================== HISTORIALES ====================
export const historialesApi = {
    getAll: async (): Promise<Historial[]> => {
        const response = await api.get<Historial[]>('/historiales');
        return response.data;
    },

    getByPacienteId: async (pacienteId: number): Promise<Historial[]> => {
        const response = await api.get<Historial[]>(`/historiales/paciente/${pacienteId}`);
        return response.data;
    },

    getById: async (id: number): Promise<Historial> => {
        const response = await api.get<Historial>(`/historiales/${id}`);
        return response.data;
    },
};

// ==================== RECETAS ====================
export const recetasApi = {
    getAll: async (): Promise<Receta[]> => {
        const response = await api.get<Receta[]>('/recetas');
        return response.data;
    },

    getByConsultaId: async (consultaId: number): Promise<Receta[]> => {
        const response = await api.get<Receta[]>(`/recetas/consulta/${consultaId}`);
        return response.data;
    },

    getById: async (id: number): Promise<Receta> => {
        const response = await api.get<Receta>(`/recetas/${id}`);
        return response.data;
    },
};

export default api;
