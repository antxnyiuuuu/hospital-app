import { api } from "@/app/lib/api";

export interface Doctor {
  id: number;
  apellido: string;
  nombre: string;
  telefono: string;
  especialidad: number;
}

export const getDoctor = async (): Promise<Doctor[]> => {
  const response = await api.get<Doctor[]>("/doctor");
  return response.data;
};
