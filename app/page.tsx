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
      title: 'Total Doctores',
      value: stats.totalDoctores,
      icon: UserCog,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Pacientes',
      value: stats.totalPacientes,
      icon: Users,
      color: 'bg-green-500',
    },
    {
      title: 'Total Consultas',
      value: stats.totalConsultas,
      icon: Calendar,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen del sistema hospitalario</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Bienvenido al Sistema</h2>
        </div>
        <p className="text-gray-600">
          Este es el sistema de gestión hospitalaria. Utiliza el menú lateral para navegar entre las diferentes secciones.
        </p>
      </div>
    </div>
  );
}
