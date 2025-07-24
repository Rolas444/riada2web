'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, PanelLeft, PanelRight } from 'lucide-react';
import clsx from 'clsx';

/**
 * Define el tipo para un elemento de navegación.
 * @param label - El texto que se mostrará.
 * @param href - La ruta a la que enlazará.
 * @param icon - Un componente de ícono (por ejemplo, de lucide-react).
 */
export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactElement<{ className?: string }>;
};

/**
 * Define las propiedades para el perfil de usuario a mostrar en el sidebar.
 */
export type UserProfile = {
  name: string;
  email: string;
  avatarUrl: string;
};

interface SidebarProps {
  navItems: NavItem[];
  user?: UserProfile;
  onLogout: () => void;
  isCollapsed: boolean; // Para el estado en desktop
  setIsCollapsed: (isCollapsed: boolean) => void; // Para desktop
  isMobileOpen: boolean; // Para el estado en móvil
  onCloseMobile: () => void; // Para cerrar en móvil
}

/**
 * Un componente de barra lateral (sidebar) reutilizable y responsive para un dashboard.
 * Es controlable desde su componente padre a través de las props `isCollapsed` y `setIsCollapsed`.
 */
export const Sidebar: React.FC<SidebarProps> = 
({navItems, user, onLogout, isCollapsed, setIsCollapsed, isMobileOpen, onCloseMobile 
}) => {
  const pathname = usePathname();

    // Cierra el sidebar móvil al cambiar de ruta
  useEffect(() => {
    if (isMobileOpen) {
      onCloseMobile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleLinkClick = () => {
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const handleLogoutClick = () => {
    onLogout();
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  return (
    <aside
      className={clsx(
        // 'relative flex h-screen flex-col bg-gray-50 text-gray-800 transition-all duration-300 ease-in-out dark:bg-gray-900 dark:text-gray-200 dark:border-r dark:border-gray-800',
        'fixed inset-y-0 left-0 z-50 flex h-full flex-col bg-gray-50 text-gray-800 transition-transform duration-300 ease-in-out dark:border-r dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 lg:relative lg:translate-x-0',
        { 
          'w-64': !isCollapsed, // Ancho normal en desktop
          'w-20': isCollapsed, // Ancho colapsado en desktop
          'translate-x-0': isMobileOpen, // Abierto en móvil
          '-translate-x-full': !isMobileOpen, // Cerrado en móvil
         },
      )}
      aria-label="Barra lateral principal"
    >
      {/* Botón para colapsar/expandir en escritorio */}
      <div className="absolute -right-3 top-8 z-10 hidden lg:block">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full border bg-gray-100 p-1 text-gray-600 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          aria-label={isCollapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {isCollapsed ? <PanelRight size={20} /> : <PanelLeft size={20} />}
        </button>
      </div>

      <div className="flex h-full flex-col">
        {/* Encabezado del Sidebar (Logo) */}
        <div
          className={clsx('flex items-center border-b p-4 dark:border-gray-800', {
            'justify-center': isCollapsed,
            'justify-start': !isCollapsed,
          })}
        >
          {isCollapsed && <span className="text-xl font-bold text-blue-600 dark:text-blue-300">R</span>}
          {!isCollapsed && <span className="ml-2 text-lg font-bold text-blue-600 dark:text-blue-300">Riada</span>}
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 space-y-2 px-2 py-4">
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href} onClick={handleLinkClick}
                    className={clsx(
                      'flex items-center rounded-lg p-2 text-base font-normal',
                      'transition-colors hover:bg-gray-200 dark:hover:bg-gray-700',
                      {
                        'bg-blue-100 text-blue-600 dark:text-blue-300 dark:bg-gray-700': isActive,
                        'justify-center': isCollapsed,
                      },
                    )}
                    title={isCollapsed ? item.label : ''}
                  >
                    {React.cloneElement(item.icon, {
                      className: clsx('h-6 w-6', {
                        'text-blue-600 dark:text-blue-300': isActive,
                      }),
                    })}
                    {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Pie de Sidebar (Usuario y Logout) */}
        <div className="mt-auto border-t p-2 dark:border-gray-800">
          {user && (
            <div className="mb-2 flex items-center p-2">
              <Image
                src={user.avatarUrl}
                alt={`Avatar de ${user.name}`}
                className="rounded-full"
                width={32}
                height={32}
              />
              {!isCollapsed && (
                <div className="ml-3 overflow-hidden">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          )}
          <button
            // onClick={onLogout}
            onClick={handleLogoutClick}
            className={clsx(
              'flex w-full items-center rounded-lg p-2 text-base font-normal',
              'transition-colors hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-800/50 dark:hover:text-red-400',
              { 'justify-center': isCollapsed },
            )}
            title={isCollapsed ? 'Cerrar Sesión' : ''}
          >
            <LogOut className="h-6 w-6" />
            {!isCollapsed && <span className="ml-3">Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
