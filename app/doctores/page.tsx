'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { doctoresApi, especialidadesApi } from '@/lib/api';
import type { Doctor, Especialidad, DoctorFormData } from '@/types';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useForm } from 'react-hook-form';

export default function DoctoresPage() {
    const [doctores, setDoctores] = useState<Doctor[]>([]);
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<DoctorFormData>();

    // Cargar doctores y especialidades
    useEffect(() => {
        fetchDoctores();
        fetchEspecialidades();
    }, []);

    // Consumir la API y mostrar los doctores en una tabla
    const fetchDoctores = async () => {
        try {
            setLoading(true);
            const data = await doctoresApi.getAll();
            setDoctores(data);
        } catch (error) {
            console.error('Error al cargar doctores:', error);
            alert('Error al cargar la lista de doctores');
        } finally {
            setLoading(false);
        }
    };

    const fetchEspecialidades = async () => {
        try {
            const data = await especialidadesApi.getAll();
            setEspecialidades(data);
        } catch (error) {
            console.error('Error al cargar especialidades:', error);
            alert('Error al cargar especialidades');
        }
    };

    const handleOpenModal = (doctor?: Doctor) => {
        if (doctor) {
            setEditingDoctor(doctor);
            reset({
                nombre: doctor.nombre,
                apellido: doctor.apellido,
                telefono: doctor.telefono,
                especialidad: {
                    id_especialidad: doctor.especialidad.id_especialidad,
                },
            });
        } else {
            setEditingDoctor(null);
            reset({
                nombre: '',
                apellido: '',
                telefono: '',
                especialidad: { id_especialidad: 0 },
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingDoctor(null);
        reset();
    };

    const onSubmit = async (data: DoctorFormData) => {
        try {
            setSubmitting(true);

            if (editingDoctor) {
                // Actualizar doctor existente
                await doctoresApi.update(editingDoctor.id_doctor, data);
                alert('Doctor actualizado exitosamente');
            } else {
                // Crear nuevo doctor
                await doctoresApi.create(data);
                alert('Doctor creado exitosamente');
            }

            handleCloseModal();
            fetchDoctores();
        } catch (error) {
            console.error('Error al guardar doctor:', error);
            alert('Error al guardar el doctor');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este doctor?')) return;

        try {
            await doctoresApi.delete(id);
            alert('Doctor eliminado exitosamente');
            fetchDoctores();
        } catch (error) {
            console.error('Error al eliminar doctor:', error);
            alert('Error al eliminar el doctor');
        }
    };

    if (loading) {
        return <LoadingSpinner text="Cargando doctores..." />;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Doctores</h1>
                    <p className="text-gray-600 mt-1">Gestión de doctores del hospital</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-5 h-5 mr-2" />
                    Nuevo Doctor
                </Button>
            </div>

            {/* Tabla de Doctores */}
            {doctores.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No hay doctores registrados</p>
                </div>
            ) : (
                <Table headers={['ID', 'Nombre', 'Apellido', 'Teléfono', 'Especialidad', 'Acciones']}>
                    {doctores.map((doctor) => (
                        <tr key={doctor.id_doctor} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {doctor.id_doctor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {doctor.nombre}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {doctor.apellido}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {doctor.telefono}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {doctor.especialidad.nombre}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(doctor)}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(doctor.id_doctor)}
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

            {/* Modal de Crear/Editar Doctor */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingDoctor ? 'Editar Doctor' : 'Nuevo Doctor'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            {...register('nombre', { required: 'El nombre es requerido' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.nombre && (
                            <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
                        )}
                    </div>

                    {/* Apellido */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Apellido
                        </label>
                        <input
                            type="text"
                            {...register('apellido', { required: 'El apellido es requerido' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.apellido && (
                            <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            {...register('telefono', { required: 'El teléfono es requerido' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.telefono && (
                            <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
                        )}
                    </div>

                    {/* Especialidad */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Especialidad
                        </label>
                        <select
                            {...register('especialidad.id_especialidad', {
                                required: 'La especialidad es requerida',
                                valueAsNumber: true,
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione una especialidad</option>
                            {especialidades.map((esp) => (
                                <option key={esp.id_especialidad} value={esp.id_especialidad}>
                                    {esp.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.especialidad?.id_especialidad && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.especialidad.id_especialidad.message}
                            </p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={submitting} className="flex-1">
                            {submitting ? 'Guardando...' : editingDoctor ? 'Actualizar' : 'Crear'}
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
