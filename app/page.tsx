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
      gradient: 'from-blue-500 to-cyan-400',
      shadow: 'shadow-blue-200',
      text: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Pacientes',
      subtitle: 'Historiales registrados',
      value: stats.totalPacientes,
      icon: Users,
      gradient: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-emerald-200',
      text: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Consultas',
      subtitle: 'Citas programadas',
      value: stats.totalConsultas,
      icon: Calendar,
      gradient: 'from-violet-600 to-purple-500',
      shadow: 'shadow-violet-200',
      text: 'text-violet-600',
      bg: 'bg-violet-50'
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Dashboard General</h1>
          <p className="text-gray-500 mt-2 text-lg">Resumen de operaciones y métricas clave.</p>
        </div>
        <div className="text-sm font-medium text-gray-400 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className={`relative overflow-hidden bg-white rounded-3xl p-8 border border-gray-100 shadow-xl ${card.shadow} hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group`}
            >
              {/* Background Decoration */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className={`inline-flex p-3 rounded-2xl ${card.bg} ${card.text} mb-4`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-gray-500 font-semibold mb-1">{card.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-gray-900 tracking-tight">{card.value}</span>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2 font-medium">{card.subtitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upgrade / Welcome Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 shadow-2xl p-10 text-white">
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
            <Activity className="w-12 h-12 text-blue-300" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">Bienvenido al Sistema Hospitalario</h2>
            <p className="text-blue-100 max-w-2xl leading-relaxed">
              Gestiona doctores, pacientes y consultas de manera eficiente. Utiliza la barra lateral para acceder a todos los módulos y mantener el control total de las operaciones.
            </p>
          </div>
          <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold shadow-lg hover:bg-blue-50 hover:scale-105 transition-all active:scale-95">
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  );
}
