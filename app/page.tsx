'use client';

import { useEffect, useState } from 'react';
import { UserCog, Users, Calendar, Activity } from 'lucide-react';
import { doctoresApi, pacientesApi, consultasApi } from '@/lib/api';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Stats {
  totalDoctores: number;
  totalPacientes: number;
  totalConsultas: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalDoctores: 0,
    totalPacientes: 0,
    totalConsultas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [doctores, pacientes, consultas] = await Promise.all([
          doctoresApi.getAll(),
          pacientesApi.getAll(),
          consultasApi.getAll(),
        ]);

        setStats({
          totalDoctores: doctores.length,
          totalPacientes: pacientes.length,
          totalConsultas: consultas.length,
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Cargando estadísticas..." />;
  }

  const cards = [
    {
      title: 'Personal Médico',
      subtitle: 'Especialistas activos',
      value: stats.totalDoctores,
      icon: UserCog,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Pacientes',
      subtitle: 'Historiales registrados',
      value: stats.totalPacientes,
      icon: Users,
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
    },
    {
      title: 'Consultas',
      subtitle: 'Citas programadas',
      value: stats.totalConsultas,
      icon: Calendar,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard General</h1>
          <p className="text-gray-500 mt-1">Resumen de operaciones y métricas clave.</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
          Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards Grid - Plano */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className={`inline-flex p-3 rounded-lg ${card.iconBg} ${card.iconColor} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-gray-500 font-medium mb-1">{card.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">{card.value}</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Total</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{card.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Welcome Section - Simple */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-3 bg-blue-50 rounded-full">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Bienvenido al Sistema Hospitalario</h2>
            <p className="text-gray-600 max-w-2xl">
              Gestiona doctores, pacientes y consultas de manera eficiente. Utiliza la barra lateral para acceder a todos los módulos.
            </p>
          </div>
          <button className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  );
}
