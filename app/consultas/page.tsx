'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { mockPacientes } from '@/lib/mockData';
import { consultasApi, doctoresApi } from '@/lib/api';
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
        fetchDoctores();
        setPacientes(mockPacientes);
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

    const inputClasses = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";

    if (loading) {
        return <LoadingSpinner text="Cargando consultas..." />;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Consultas</h1>
                    <p className="text-gray-500 mt-1 text-lg">Programación y gestión de citas médicas</p>
                </div>
                <div className="flex-shrink-0">
                    <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-shadow">
                        <Plus className="w-5 h-5 mr-2" />
                        Nueva Consulta
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 to-purple-500"></div>
                <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">Agenda de Consultas</h3>
                    <span className="text-xs font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100 uppercase tracking-wide">
                        {consultas.length} Registros
                    </span>
                </div>

                {consultas.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay consultas</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Programa las consultas médicas seleccionando un paciente y un doctor.</p>
                        <Button variant="secondary" onClick={() => handleOpenModal()}>
                            Agendar primera cita
                        </Button>
                    </div>
                ) : (
                    <div className="p-0">
                        <Table headers={['ID', 'Fecha', 'Paciente', 'Doctor', 'Motivo', 'Acciones']}>
                            {consultas.map((consulta) => (
                                <tr key={consulta.id_consulta} className="group hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{consulta.id_consulta}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        {new Date(consulta.fecha).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {getPacienteNombre(consulta.pacienteId)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {getDoctorNombre(consulta.doctorId)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <div className="max-w-xs truncate" title={consulta.motivo}>
                                            {consulta.motivo}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => handleOpenModal(consulta)}
                                                className="p-1 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(consulta.id_consulta)}
                                                className="p-1 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </Table>
                    </div>
                )}
            </div>

            {/* Modal de Crear/Editar Consulta */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingConsulta ? 'Editar Consulta' : 'Nueva Consulta'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div>
                        <label className={labelClasses}>Fecha y Hora</label>
                        <input
                            type="datetime-local"
                            {...register('fecha', { required: 'La fecha es requerida' })}
                            className={inputClasses}
                        />
                        {errors.fecha && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.fecha.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Paciente</label>
                            <select
                                {...register('pacienteId', {
                                    required: 'Requerido',
                                    valueAsNumber: true,
                                })}
                                className={inputClasses}
                            >
                                <option value="">Seleccione...</option>
                                {pacientes.map((paciente) => (
                                    <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                        {paciente.nombre} {paciente.apellido}
                                    </option>
                                ))}
                            </select>
                            {errors.pacienteId && (
                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.pacienteId.message}</p>
                            )}
                        </div>

                        <div>
                            <label className={labelClasses}>Doctor</label>
                            <select
                                {...register('doctorId', {
                                    required: 'Requerido',
                                    valueAsNumber: true,
                                })}
                                className={inputClasses}
                            >
                                <option value="">Seleccione...</option>
                                {doctores.map((doctor) => (
                                    <option key={doctor.id_doctor} value={doctor.id_doctor}>
                                        Dr. {doctor.nombre} {doctor.apellido}
                                    </option>
                                ))}
                            </select>
                            {errors.doctorId && (
                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.doctorId.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Motivo de Consulta</label>
                        <textarea
                            {...register('motivo', { required: 'Requerido' })}
                            rows={3}
                            className={inputClasses}
                            placeholder="Describa el motivo..."
                        />
                        {errors.motivo && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.motivo.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                        <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting} className="flex-1">
                            {submitting ? 'Guardando...' : editingConsulta ? 'Guardar Cambios' : 'Agendar Cita'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
