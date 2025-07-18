'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ThemeProvider } from '@/features/theme/components/ThemeProvider';
import {
  LayoutDashboard,
  Settings,
  Users,
  LineChart,
  Briefcase,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';

import {
  Sidebar,
  NavItem,
} from '@/components/dashboard/Sidebar';

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard />,
  },
  {
    label: 'Usuarios',
    href: '/dashboard/users',
    icon: <Users />,
  },
  {
    label: 'Proyectos',
    href: '/dashboard/projects',
    icon: <Briefcase />,
  },
  {
    label: 'Analíticas',
    href: '/dashboard/analytics',
    icon: <LineChart />,
  },
  {
    label: 'Configuración',
    href: '/dashboard/settings',
    icon: <Settings />,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}
const  DashboardLayout: React.FC<DashboardLayoutProps>=({children})=> {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const user = useAuthStore((state) => state.user);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // isAuthenticated puede ser `undefined` durante el render inicial en el cliente
    // antes de que zustand se hidrate. Esperamos a que sea un booleano.
    if (isAuthenticated === false) {
      // router.replace('/login');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Muestra un estado de carga mientras se verifica la autenticación
  // if (isAuthenticated === undefined || isAuthenticated === false) {
  if (typeof isAuthenticated === 'undefined' || !isAuthenticated) {
    return <div className='flex h-screen items-center justify-center'>Cargando...</div>; // O un skeleton/loader adecuado
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
        <Sidebar
          navItems={navItems}
          user={
            user
              ? {
                  name: user.name || 'Usuario',
                  email: user.email || 'mail', // Usamos el username como email
                  // Usamos encodeURIComponent para manejar nombres con espacios/caracteres especiales
                  avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || 'U' // Fallback a una letra si el nombre es nulo
                  )}&background=0D8ABC&color=fff`,
                }
              : undefined
          }
          onLogout={logout}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </ThemeProvider>
    
  );
}

export default DashboardLayout;
