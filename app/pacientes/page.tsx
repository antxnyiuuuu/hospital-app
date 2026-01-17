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

    const inputClasses = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";

    if (loading) {
        return <LoadingSpinner text="Cargando pacientes..." />;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pacientes</h1>
                    <p className="text-gray-500 mt-1 text-lg">Administración de expedientes y datos personales</p>
                </div>
                <div className="flex-shrink-0">
                    <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-shadow">
                        <Plus className="w-5 h-5 mr-2" />
                        Nuevo Paciente
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">Directorio de Pacientes</h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-wide">
                        {pacientes.length} Registros
                    </span>
                </div>

                {pacientes.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay pacientes</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Registra nuevos pacientes para comenzar a gestionar sus historiales y citas.</p>
                        <Button variant="secondary" onClick={() => handleOpenModal()}>
                            Registrar primero
                        </Button>
                    </div>
                ) : (
                    <div className="p-0">
                        <Table headers={['ID', 'Nombre', 'Apellido', 'Cédula', 'Fecha Nac.', 'Teléfono', 'Acciones']}>
                            {pacientes.map((paciente) => (
                                <tr key={paciente.id_paciente} className="group hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{paciente.id_paciente}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        {paciente.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        {paciente.apellido}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {paciente.cedula}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(paciente.fecha_nacimiento).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {paciente.telefono}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => handleOpenHistorial(paciente)}
                                                className="p-1 rounded-md text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                                                title="Ver historial"
                                            >
                                                <FileText className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleOpenModal(paciente)}
                                                className="p-1 rounded-md text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(paciente.id_paciente)}
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

            {/* Modal de Crear/Editar Paciente */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingPaciente ? 'Editar Paciente' : 'Nuevo Paciente'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Nombre</label>
                            <input
                                type="text"
                                {...register('nombre', { required: 'Requerido' })}
                                className={inputClasses}
                                placeholder="Ej. Ana"
                            />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1 font-medium">{errors.nombre.message}</p>}
                        </div>

                        <div>
                            <label className={labelClasses}>Apellido</label>
                            <input
                                type="text"
                                {...register('apellido', { required: 'Requerido' })}
                                className={inputClasses}
                                placeholder="Ej. López"
                            />
                            {errors.apellido && <p className="text-red-500 text-xs mt-1 font-medium">{errors.apellido.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClasses}>Cédula</label>
                            <input
                                type="text"
                                {...register('cedula', { required: 'Requerida' })}
                                className={inputClasses}
                                placeholder="10 dígitos"
                            />
                            {errors.cedula && <p className="text-red-500 text-xs mt-1 font-medium">{errors.cedula.message}</p>}
                        </div>
                        <div>
                            <label className={labelClasses}>Teléfono</label>
                            <input
                                type="tel"
                                {...register('telefono', { required: 'Requerido' })}
                                className={inputClasses}
                                placeholder="09..."
                            />
                            {errors.telefono && <p className="text-red-500 text-xs mt-1 font-medium">{errors.telefono.message}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelClasses}>Fecha de Nacimiento</label>
                        <input
                            type="date"
                            {...register('fecha_nacimiento', { required: 'Requerida' })}
                            className={inputClasses}
                        />
                        {errors.fecha_nacimiento && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fecha_nacimiento.message}</p>}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                        <Button type="button" variant="secondary" onClick={handleCloseModal} className="flex-1">
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting} className="flex-1">
                            {submitting ? 'Guardando...' : editingPaciente ? 'Guardar Cambios' : 'Crear Paciente'}
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
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-100 border-dashed">
                        <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 font-medium">Sin registros médicos previos</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {historiales.map((historial) => (
                            <div key={historial.id_historial} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">REGISTRO #{historial.id_historial}</span>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium">Activo</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed text-sm">{historial.descripcion}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}
