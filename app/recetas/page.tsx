'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { recetasApi, consultasApi } from '@/lib/api';
import type { Receta, RecetaFormData, Consulta } from '@/types';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useForm } from 'react-hook-form';

export default function RecetasPage() {
    const [recetas, setRecetas] = useState<Receta[]>([]);
    const [consultas, setConsultas] = useState<Consulta[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReceta, setEditingReceta] = useState<Receta | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<RecetaFormData>();

    useEffect(() => {
        fetchRecetas();
        fetchConsultas();
    }, []);

    const fetchRecetas = async () => {
        try {
            setLoading(true);
            const data = await recetasApi.getAll();
            setRecetas(data);
        } catch (error) {
            console.error('Error al cargar recetas:', error);
            // alert('Error al cargar recetas'); // Opcional, dependiendo de la UX deseada
        } finally {
            setLoading(false);
        }
    };

    const fetchConsultas = async () => {
        try {
            const data = await consultasApi.getAll();
            setConsultas(data);
        } catch (error) {
            console.error('Error al cargar consultas:', error);
        }
    };

    const handleOpenModal = (receta?: Receta) => {
        if (receta) {
            setEditingReceta(receta);
            reset({
                medicamento: receta.medicamento,
                dosis: receta.dosis,
                id_consulta: receta.id_consulta,
            });
        } else {
            setEditingReceta(null);
            reset({
                medicamento: '',
                dosis: '',
                id_consulta: 0,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingReceta(null);
        reset();
    };

    const onSubmit = async (data: RecetaFormData) => {
        try {
            setSubmitting(true);

            if (editingReceta) {
                await recetasApi.update(editingReceta.id, data);
                alert('Receta actualizada exitosamente');
            } else {
                await recetasApi.create(data);
                alert('Receta creada exitosamente');
            }

            handleCloseModal();
            fetchRecetas();
        } catch (error) {
            console.error('Error al guardar receta:', error);
            alert('Error al guardar la receta');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar esta receta?')) return;

        try {
            await recetasApi.delete(id);
            alert('Receta eliminada exitosamente');
            fetchRecetas();
        } catch (error) {
            console.error('Error al eliminar receta:', error);
            alert('Error al eliminar la receta');
        }
    };

    const inputClasses = "w-full px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
    const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

    if (loading) {
        return <LoadingSpinner text="Cargando recetas..." />;
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Recetas
                    </h1>
                    <p className="text-gray-500">
                        Gestión de recetas médicas y prescripciones
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <Button onClick={() => handleOpenModal()} className="shadow-none">
                        <Plus className="w-5 h-5 mr-2" />
                        Nueva Receta
                    </Button>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Listado de Recetas</h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2.5 py-0.5 rounded-full border border-gray-300">
                        {recetas.length} Registros
                    </span>
                </div>

                {recetas.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Plus className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No hay recetas</h3>
                        <p className="text-gray-500 mb-6 max-w-sm mx-auto">Registra la primera receta médica asociada a una consulta.</p>
                        <Button variant="secondary" onClick={() => handleOpenModal()} className="shadow-none border border-gray-300">
                            Crear receta
                        </Button>
                    </div>
                ) : (
                    <div className="p-0">
                        <Table headers={['ID', 'Medicamento', 'Dosis', 'ID Consulta', 'Acciones']}>
                            {recetas.map((receta, index) => (
                                <tr key={`${receta.id}-${index}`} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        #{receta.id}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <span className="font-medium">{receta.medicamento}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {receta.dosis}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Consulta #{receta.id_consulta}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => handleOpenModal(receta)}
                                                className="p-1.5 rounded-md hover:bg-gray-100 text-blue-600 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(receta.id)}
                                                className="p-1.5 rounded-md hover:bg-gray-100 text-red-600 transition-colors"
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

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingReceta ? 'Editar Receta' : 'Nueva Receta'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className={labelClasses}>Medicamento</label>
                        <input
                            type="text"
                            {...register('medicamento', { required: 'El medicamento es requerido' })}
                            className={inputClasses}
                            placeholder="Ej. Paracetamol 500mg"
                        />
                        {errors.medicamento && (
                            <p className="text-red-500 text-xs mt-1">{errors.medicamento.message}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClasses}>Dosis / Indicaciones</label>
                        <textarea
                            {...register('dosis', { required: 'La dosis es requerida' })}
                            rows={3}
                            className={inputClasses}
                            placeholder="Ej. Tomar 1 tableta cada 8 horas por 3 días..."
                        />
                        {errors.dosis && (
                            <p className="text-red-500 text-xs mt-1">{errors.dosis.message}</p>
                        )}
                    </div>

                    <div>
                        <label className={labelClasses}>Consulta Asociada</label>
                        <select
                            {...register('id_consulta', {
                                required: 'Debe seleccionar una consulta',
                                valueAsNumber: true,
                            })}
                            className={inputClasses}
                        >
                            <option value="">Seleccione una consulta...</option>
                            {consultas.map((consulta) => (
                                <option key={consulta.id_consulta} value={consulta.id_consulta}>
                                    Consulta #{consulta.id_consulta} - {new Date(consulta.fecha).toLocaleDateString()}
                                </option>
                            ))}
                        </select>
                        {errors.id_consulta && (
                            <p className="text-red-500 text-xs mt-1">{errors.id_consulta.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleCloseModal}
                            className="flex-1 shadow-none border border-gray-300"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={submitting} className="flex-1 shadow-none">
                            {submitting ? 'Guardando...' : editingReceta ? 'Guardar Cambios' : 'Crear Receta'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
