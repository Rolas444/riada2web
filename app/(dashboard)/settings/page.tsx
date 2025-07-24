'use client';

import React from 'react';
import { useThemeStore } from '@/features/theme/store/themeStore';
import Tabs, { Tab } from '@/components/ui/Tabs';
import { useTheme } from 'next-themes';

const AppearanceSettings = () => {
  const { toggleTheme, theme } = useThemeStore();
  const {setTheme} = useTheme();
  const handleThemeChange = () => {
    toggleTheme();
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <div className="rounded-lg border-0 dark:border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Apariencia
      </h2>
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-700 dark:text-gray-300">Tema de la aplicación</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tema actual: <span className="font-semibold capitalize">{theme}</span>
          </p>
        </div>
        <button
          onClick={handleThemeChange}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cambiar Tema
        </button>
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Perfil de Usuario
      </h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400">
        Aquí podrás editar la información de tu perfil.
      </p>
      {/* Aquí irá el formulario para editar el perfil */}
    </div>
  );
};

export default function SettingsPage() {
  const tabs: Tab[] = [
    {
      label: 'Apariencia',
      content: <AppearanceSettings />,
    },
    {
      label: 'Perfil',
      content: <ProfileSettings />,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuración
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Ajusta las preferencias de la aplicación y tu perfil.
        </p>
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}
