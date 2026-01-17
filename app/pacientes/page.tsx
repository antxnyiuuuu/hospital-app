'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { pacientesApi, historialesApi } from '@/lib/api';
import type { Paciente, PacienteFormData, Historial } from '@/types';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useForm } from 'react-hook-form';

export default function PacientesPage() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistorialModalOpen, setIsHistorialModalOpen] = useState(false);
    const [editingPaciente, setEditingPaciente] = useState<Paciente | null>(null);
    const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
    const [historiales, setHistoriales] = useState<Historial[]>([]);
    const [loadingHistorial, setLoadingHistorial] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<PacienteFormData>();

    useEffect(() => {
        fetchPacientes();
    }, []);

    const fetchPacientes = async () => {
        try {
            setLoading(true);
            const data = await pacientesApi.getAll();
            setPacientes(data);
        } catch (error) {
            console.error('Error al cargar pacientes:', error);
            alert('Error al cargar la lista de pacientes');
        } finally {
            setLoading(false);
        }
    };

    const fetchHistorial = async (pacienteId: number) => {
        try {
            setLoadingHistorial(true);
            const data = await historialesApi.getByPacienteId(pacienteId);
            setHistoriales(data);
        } catch (error) {
            console.error('Error al cargar historial:', error);
            alert('Error al cargar el historial médico');
        } finally {
            setLoadingHistorial(false);
        }
    };

    const handleOpenModal = (paciente?: Paciente) => {
        if (paciente) {
            setEditingPaciente(paciente);
            reset({
                nombre: paciente.nombre,
                apellido: paciente.apellido,
                cedula: paciente.cedula,
                fecha_nacimiento: paciente.fecha_nacimiento,
                telefono: paciente.telefono,
            });
        } else {
            setEditingPaciente(null);
            reset({
                nombre: '',
                apellido: '',
                cedula: '',
                fecha_nacimiento: '',
                telefono: '',
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPaciente(null);
        reset();
    };

    const handleOpenHistorial = async (paciente: Paciente) => {
        setSelectedPaciente(paciente);
        setIsHistorialModalOpen(true);
        await fetchHistorial(paciente.id_paciente);
    };

    const handleCloseHistorial = () => {
        setIsHistorialModalOpen(false);
        setSelectedPaciente(null);
        setHistoriales([]);
    };

    const onSubmit = async (data: PacienteFormData) => {
        try {
            setSubmitting(true);

            if (editingPaciente) {
                await pacientesApi.update(editingPaciente.id_paciente, data);
                alert('Paciente actualizado exitosamente');
            } else {
                await pacientesApi.create(data);
                alert('Paciente creado exitosamente');
            }

            handleCloseModal();
            fetchPacientes();
        } catch (error) {
            console.error('Error al guardar paciente:', error);
            alert('Error al guardar el paciente');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este paciente?')) return;

        try {
            await pacientesApi.delete(id);
            alert('Paciente eliminado exitosamente');
            fetchPacientes();
        } catch (error) {
            console.error('Error al eliminar paciente:', error);
            alert('Error al eliminar el paciente');
        }
    };

    if (loading) {
        return <LoadingSpinner text="Cargando pacientes..." />;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
                    <p className="text-gray-600 mt-1">Gestión de pacientes del hospital</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Paciente
                </Button>
            </div>

            {/* Tabla de Pacientes */}
            {pacientes.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No hay pacientes registrados</p>
                </div>
            ) : (
                <Table headers={['ID', 'Nombre', 'Apellido', 'Cédula', 'Fecha Nac.', 'Teléfono', 'Acciones']}>
                    {pacientes.map((paciente) => (
                        <tr key={paciente.id_paciente} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {paciente.id_paciente}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {paciente.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {paciente.apellido}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {paciente.cedula}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(paciente.fecha_nacimiento).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {paciente.telefono}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenHistorial(paciente)}
                                        className="text-green-600 hover:text-green-800"
                                        title="Ver historial"
                                    >
                                        <FileText className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(paciente)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Editar"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(paciente.id_paciente)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            )}

            {/* Modal de Crear/Editar Paciente */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingPaciente ? 'Editar Paciente' : 'Nuevo Paciente'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            {...register('nombre', { required: 'El nombre es requerido' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                        <input
                            type="text"
                            {...register('apellido', { required: 'El apellido es requerido' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
                        <input
                            type="text"
                            {...register('cedula', { required: 'La cédula es requerida' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.cedula && <p className="text-red-500 text-sm mt-1">{errors.cedula.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            {...register('fecha_nacimiento', { required: 'La fecha de nacimiento es requerida' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.fecha_nacimiento && <p className="text-red-500 text-sm mt-1">{errors.fecha_nacimiento.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="tel"
                            {...register('telefono', { required: 'El teléfono es requerido' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={submitting} className="flex-1">
                            {submitting ? 'Guardando...' : editingPaciente ? 'Actualizar' : 'Crear'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Historial Médico */}
            <Modal
                isOpen={isHistorialModalOpen}
                onClose={handleCloseHistorial}
                title={`Historial Médico - ${selectedPaciente?.nombre} ${selectedPaciente?.apellido}`}
            >
                {loadingHistorial ? (
                    <LoadingSpinner text="Cargando historial..." />
                ) : historiales.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No hay registros en el historial médico</p>
                ) : (
                    <div className="space-y-4">
                        {historiales.map((historial) => (
                            <div key={historial.id_historial} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm font-medium text-gray-500">ID: {historial.id_historial}</span>
                                </div>
                                <p className="text-gray-700">{historial.descripcion}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}
