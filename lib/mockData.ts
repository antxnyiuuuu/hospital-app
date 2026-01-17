import type { Especialidad, Doctor, Paciente, Consulta } from '@/types';


export const mockEspecialidades: Especialidad[] = [
  {
    id_especialidad: 1,
    nombre: 'Cardiología',
  },
  {
    id_especialidad: 2,
    nombre: 'Pediatría',
  },
  {
    id_especialidad: 3,
    nombre: 'Neurología',
  },
  {
    id_especialidad: 4,
    nombre: 'Oftalmología',
  },
  {
    id_especialidad: 5,
    nombre: 'Cirugía General',
  },
];



export const mockPacientes: Paciente[] = [
  {
    id_paciente: 1,
    nombre: 'Ana',
    apellido: 'Martínez',
    cedula: '1234567890',
    fecha_nacimiento: '1990-05-15',
    telefono: '3108888888',
  },
  {
    id_paciente: 2,
    nombre: 'Luis',
    apellido: 'Rodríguez',
    cedula: '0987654321',
    fecha_nacimiento: '1985-10-20',
    telefono: '3109999999',
  },
  {
    id_paciente: 3,
    nombre: 'Sofia',
    apellido: 'Hernández',
    cedula: '5555555555',
    fecha_nacimiento: '1992-03-08',
    telefono: '3101111111',
  },
];

export const mockConsultas: Consulta[] = [
  {
    id_consulta: 1,
    fecha: '2024-01-15',
    motivo: 'Control de presión arterial',
    pacienteId: 1,
    doctorId: 1,
  },
  {
    id_consulta: 2,
    fecha: '2024-01-16',
    motivo: 'Chequeo general',
    pacienteId: 2,
    doctorId: 2,
  },
  {
    id_consulta: 3,
    fecha: '2024-01-17',
    motivo: 'Revisión de síntomas',
    pacienteId: 3,
    doctorId: 3,
  },
];
