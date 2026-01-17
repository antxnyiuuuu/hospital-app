'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
    LayoutDashboard,
    UserCog,
    Users,
    Calendar
} from 'lucide-react';

const menuItems = [
    {
        name: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
    },
    {
        name: 'Doctores',
        href: '/doctores',
        icon: UserCog,
    },
    {
        name: 'Pacientes',
        href: '/pacientes',
        icon: Users,
    },
    {
        name: 'Consultas',
        href: '/consultas',
        icon: Calendar,
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-56 bg-white border-r border-gray-200 min-h-screen">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                            src="/images/logog.jpg"
                            alt="Hospital Logo"
                            width={40}
                            height={40}
                            className="rounded-lg object-cover"
                        />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">Hospital</h1>
                        <p className="text-xs text-gray-500">Sistema de Gestión</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-3 py-2.5 rounded-md transition-all
                ${isActive
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }
              `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 w-56 p-4 border-t border-gray-200">
                <div className="text-xs text-gray-400 text-center">

                </div>
            </div>
        </aside>
    );
}
