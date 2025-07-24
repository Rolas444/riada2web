'use client';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useThemeStore } from '@/features/theme/store/themeStore';

export default function DashboardPage() {
  const { logout } = useAuth();
  const { toggleTheme, theme } = useThemeStore();

  return (
    <div className='text-black dark:text-white'>
      <h1>Dashboard</h1>
      <p>Bienvenido. Estás autenticado.</p>
      <p>Tema actual: {theme}</p>
      {/* <button onClick={toggleTheme}>Cambiar Tema</button>
      <button onClick={logout}>Cerrar Sesión</button> */}
    </div>
  );
}

