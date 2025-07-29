'use client';

import React from 'react';
import { useThemeStore } from '@/features/theme/store/themeStore';
import { Button } from '@/components/ui/Button';
import Tabs, { Tab } from '@/components/ui/Tabs';
const AppearanceSettings = () => {
  const { toggleTheme, theme } = useThemeStore();

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
        <Button onClick={toggleTheme} className="ml-4">
          Cambiar Tema
        </Button>
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
