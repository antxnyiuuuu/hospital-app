// Tipos basados en las entidades del backend Spring Boot

export interface Especialidad {
    id_especialidad: number;
    nombre: string;
}

export interface Doctor {
    id_doctor: number;
    nombre: string;
    apellido: string;
    telefono: string;
    especialidad: Especialidad;
}

export interface Paciente {
    id_paciente: number;
    nombre: string;
    apellido: string;
    cedula: string;
    fecha_nacimiento: string;
    telefono: string;
}

export interface Historial {
    id_historial: number;
    descripcion: string;
    pacienteId: number;
}

export interface Consulta {
    id_consulta: number;
    fecha: string;
    motivo: string;
    pacienteId: number;
    doctorId: number;
}

export interface Receta {
    id: number;
    medicamento: string;
    dosis: string;
    id_consulta: number;
}

// ... existing types ...

export interface RecetaFormData {
    medicamento: string;
    dosis: string;
    id_consulta: number;
}

// Tipos para formularios (sin IDs para creación)
export interface DoctorFormData {
    nombre: string;
    apellido: string;
    telefono: string;
    especialidad: {
        id_especialidad: number;
    };
}

export interface PacienteFormData {
    nombre: string;
    apellido: string;
    cedula: string;
    fecha_nacimiento: string;
    telefono: string;
}

export interface ConsultaFormData {
    fecha: string;
    motivo: string;
    pacienteId: number;
    doctorId: number;
}
