'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    UserCog,
    Users,
    Calendar,
    Activity
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
        <aside className="w-64 bg-blue-900 text-white min-h-screen p-4">
            {/* Logo/Header */}
            <div className="flex items-center gap-2 mb-8 p-2">
                <Activity className="w-8 h-8" />
                <h1 className="text-xl font-bold">Hospital System</h1>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${isActive
                                    ? 'bg-blue-700 text-white'
                                    : 'text-blue-100 hover:bg-blue-800'
                                }
              `}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
