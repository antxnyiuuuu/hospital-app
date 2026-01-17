'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { consultasApi, pacientesApi, doctoresApi } from '@/lib/api';
import type { Consulta, ConsultaFormData, Paciente, Doctor } from '@/types';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useForm } from 'react-hook-form';

export default function ConsultasPage() {
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [doctores, setDoctores] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingConsulta, setEditingConsulta] = useState<Consulta | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ConsultaFormData>();

    useEffect(() => {
        fetchConsultas();
        fetchPacientes();
        fetchDoctores();
    }, []);

    const fetchConsultas = async () => {
        try {
            setLoading(true);
            const data = await consultasApi.getAll();
            setConsultas(data);
        } catch (error) {
            console.error('Error al cargar consultas:', error);
            alert('Error al cargar la lista de consultas');
        } finally {
            setLoading(false);
        }
    };

    const fetchPacientes = async () => {
        try {
            const data = await pacientesApi.getAll();
            setPacientes(data);
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
        }
    };

    const fetchDoctores = async () => {
        try {
            const data = await doctoresApi.getAll();
            setDoctores(data);
        } catch (error) {
            console.error('Error al cargar doctores:', error);
        }
    };

    const handleOpenModal = (consulta?: Consulta) => {
        if (consulta) {
            setEditingConsulta(consulta);
            reset({
                fecha: consulta.fecha,
                motivo: consulta.motivo,
                pacienteId: consulta.pacienteId,
                doctorId: consulta.doctorId,
            });
        } else {
            setEditingConsulta(null);
            reset({
                fecha: '',
                motivo: '',
                pacienteId: 0,
                doctorId: 0,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingConsulta(null);
        reset();
    };

    const onSubmit = async (data: ConsultaFormData) => {
        try {
            setSubmitting(true);

            if (editingConsulta) {
                await consultasApi.update(editingConsulta.id_consulta, data);
                alert('Consulta actualizada exitosamente');
            } else {
                await consultasApi.create(data);
                alert('Consulta creada exitosamente');
            }

            handleCloseModal();
            fetchConsultas();
        } catch (error) {
            console.error('Error al guardar consulta:', error);
            alert('Error al guardar la consulta');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta consulta?')) return;

        try {
            await consultasApi.delete(id);
            alert('Consulta eliminada exitosamente');
            fetchConsultas();
        } catch (error) {
            console.error('Error al eliminar consulta:', error);
            alert('Error al eliminar la consulta');
        }
    };

    const getPacienteNombre = (id: number) => {
        const paciente = pacientes.find(p => p.id_paciente === id);
        return paciente ? `${paciente.nombre} ${paciente.apellido}` : 'N/A';
    };

    const getDoctorNombre = (id: number) => {
        const doctor = doctores.find(d => d.id_doctor === id);
        return doctor ? `Dr. ${doctor.nombre} ${doctor.apellido}` : 'N/A';
    };

    if (loading) {
        return <LoadingSpinner text="Cargando consultas..." />;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Consultas</h1>
                    <p className="text-gray-600 mt-1">Gestión de consultas médicas</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-5 h-5 mr-2" />
                    Nueva Consulta
                </Button>
            </div>

            {/* Tabla de Consultas */}
            {consultas.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No hay consultas registradas</p>
                </div>
            ) : (
                <Table headers={['ID', 'Fecha', 'Paciente', 'Doctor', 'Motivo', 'Acciones']}>
                    {consultas.map((consulta) => (
                        <tr key={consulta.id_consulta} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {consulta.id_consulta}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(consulta.fecha).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {getPacienteNombre(consulta.pacienteId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {getDoctorNombre(consulta.doctorId)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <div className="max-w-xs truncate" title={consulta.motivo}>
                                    {consulta.motivo}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(consulta)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(consulta.id_consulta)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}

            {/* Modal de Crear/Editar Consulta */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingConsulta ? 'Editar Consulta' : 'Nueva Consulta'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha y Hora
                        </label>
                        <input
                            type="datetime-local"
                            {...register('fecha', { required: 'La fecha es requerida' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.fecha && (
                            <p className="text-red-500 text-sm mt-1">{errors.fecha.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Paciente
                        </label>
                        <select
                            {...register('pacienteId', {
                                required: 'El paciente es requerido',
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un paciente</option>
                            {pacientes.map((paciente) => (
                                <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                    {paciente.nombre} {paciente.apellido} - {paciente.cedula}
                                </option>
                            ))}
                        </select>
                        {errors.pacienteId && (
                            <p className="text-red-500 text-sm mt-1">{errors.pacienteId.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Doctor
                        </label>
                        <select
                            {...register('doctorId', {
                                required: 'El doctor es requerido',
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione un doctor</option>
                            {doctores.map((doctor) => (
                                <option key={doctor.id_doctor} value={doctor.id_doctor}>
                                    Dr. {doctor.nombre} {doctor.apellido} - {doctor.especialidad.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.doctorId && (
                            <p className="text-red-500 text-sm mt-1">{errors.doctorId.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Motivo de Consulta
                        </label>
                        <textarea
                            {...register('motivo', { required: 'El motivo es requerido' })}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Describa el motivo de la consulta..."
                        />
                        {errors.motivo && (
                            <p className="text-red-500 text-sm mt-1">{errors.motivo.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={submitting} className="flex-1">
                            {submitting ? 'Guardando...' : editingConsulta ? 'Actualizar' : 'Crear'}
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCloseModal}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
