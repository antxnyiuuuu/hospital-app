import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    // Estado para animaciones de entrada/salida
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            // Pequeño delay para permitir que el DOM se monte antes de la transición de opacidad
            setTimeout(() => setIsVisible(true), 10);
        } else {
            setIsVisible(false);
            // Esperar a que termine la animación de salida antes de desmontar
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Backdrop con Blur intenso y oscuro para contraste */}
            <div
                className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Container Flotante "Levitando" */}
            <div
                className={`
                    relative w-full max-w-lg bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] 
                    border border-white/40 ring-1 ring-black/5
                    transform transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
                    ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-90 translate-y-12 opacity-0'}
                    overflow-hidden
                `}
            >
                {/* Decoración superior con gradiente vibrante */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>

                {/* Header Elegante */}
                <div className="px-8 py-6 border-b border-gray-100/80 flex justify-between items-center bg-gradient-to-b from-white to-gray-50/50">
                    <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600 tracking-tight">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="group p-2 rounded-full bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 hover:bg-red-50 transition-all duration-300"
                    >
                        <X className="w-5 h-5 text-gray-400 group-hover:text-red-500 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                {/* Content con padding generoso */}
                <div className="p-8 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    {children}
                </div>

                {/* Pie decorativo para cerrar el diseño */}
                <div className="h-3 bg-gray-50/80 border-t border-gray-100"></div>
            </div>
        </div>
    );
}
