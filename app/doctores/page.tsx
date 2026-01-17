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

    const inputClasses = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all";
    const labelClasses = "block text-sm font-semibold text-gray-700 mb-1.5";

    if (loading) {
        return <LoadingSpinner text="Cargando doctores..." />;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Doctores
                    </h1>
                    <p className="text-gray-500 mt-1 text-lg">
                        Gestiona el personal médico y sus especialidades
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Button onClick={() => handleOpenModal()} className="shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-shadow">
                        <Plus className="w-5 h-5 mr-2" />
                        Nuevo Doctor
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                {/* Table Header/Toolbar (Optional placeholder for search) */}
                <div className="p-6 border-b border-gray-100 bg-white flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                        Listado de Personal
                    </h3>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-wide">
                        {doctores.length} Registros
                    </span>
                </div>

                {/* Table Content */}
                {doctores.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay doctores</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Comienza agregando el primer doctor al sistema para gestionar sus consultas.</p>
                        <Button variant="secondary" onClick={() => handleOpenModal()}>
                            Agregar el primero
                        </Button>
                    </div>
                ) : (
                    <div className="p-0">
                        <Table headers={['ID', 'Nombre', 'Apellido', 'Teléfono', 'Especialidad', 'Acciones']}>
                            {doctores.map((doctor, index) => (
                                <tr key={`${doctor.id_doctor}-${index}`} className="group hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{doctor.id_doctor}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        {doctor.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                        {doctor.apellido}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doctor.telefono}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                            {doctor.especialidad.nombre}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <div className="flex gap-2 text-gray-500">
                                            <button
                                                onClick={() => handleOpenModal(doctor)}
                                                className="p-1 rounded-md hover:bg-blue-100 hover:text-blue-600 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(doctor.id_doctor)}
                                                className="p-1 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors"
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

            {/* Modal de Crear/Editar Doctor */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingDoctor ? 'Editar Doctor' : 'Nuevo Doctor'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div className="col-span-1">
                            <label className={labelClasses}>Nombre</label>
                            <input
                                type="text"
                                {...register('nombre', { required: 'Requerido' })}
                                className={inputClasses}
                                placeholder="Ej. Juan"
                            />
                            {errors.nombre && (
                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.nombre.message}</p>
                            )}
                        </div>

                        {/* Apellido */}
                        <div className="col-span-1">
                            <label className={labelClasses}>Apellido</label>
                            <input
                                type="text"
                                {...register('apellido', { required: 'Requerido' })}
                                className={inputClasses}
                                placeholder="Ej. Pérez"
                            />
                            {errors.apellido && (
                                <p className="text-red-500 text-xs mt-1 font-medium">{errors.apellido.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label className={labelClasses}>Teléfono</label>
                        <input
                            type="tel"
                            {...register('telefono', { required: 'Requerido' })}
                            className={inputClasses}
                            placeholder="Ej. 0999999999"
                        />
                        {errors.telefono && (
                            <p className="text-red-500 text-xs mt-1 font-medium">{errors.telefono.message}</p>
                        )}
                    </div>

                    {/* Especialidad */}
                    <div>
                        <label className={labelClasses}>Especialidad</label>
                        <select
                            {...register('especialidad.id_especialidad', {
                                required: 'Requerido',
                                valueAsNumber: true,
                            })}
                            className={inputClasses}
                        >
                            <option value="">Seleccione especialidad...</option>
                            {especialidades.map((esp) => (
                                <option key={esp.id_especialidad} value={esp.id_especialidad}>
                                    {esp.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.especialidad?.id_especialidad && (
                            <p className="text-red-500 text-xs mt-1 font-medium">
                                {errors.especialidad.id_especialidad.message}
                            </p>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCloseModal}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting} className="flex-1">
                            {submitting ? 'Guardando...' : editingDoctor ? 'Guardar Cambios' : 'Crear Doctor'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
