'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ThemeProvider } from '@/features/theme/components/ThemeProvider';
import {
  LayoutDashboard,
  Settings,
  Users,
  Contact,
  Group,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore'; 
import { Sidebar, NavItem } from '@/components/dashboard/Sidebar';
import DashboardContent from '@/components/dashboard/DashboardContent';


const navAdminItems: NavItem[] = [
  {
    label: 'Usuarios',
    href: '/users',
    icon: <Users />,
  },
]

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard />,
  },
  {
    label: 'Personas',
    href: '/people',
    icon: <Contact />,
  },
  
  {
    label: 'Miembros',
    href: '/members',
    icon: <Group />,
  },
  
  
  {
    label: 'Configuración',
    href: '/settings',
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
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isAdmin = user?.role === 'admin'; // Verifica si el usuario es admin
  const navItemsToUse = isAdmin ? [...navItems, ...navAdminItems] : navItems;

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
      <div className="relative flex h-screen bg-gray-100 dark:bg-gray-950">
        {/* Fondo oscuro para el menú móvil */}
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
        )}
        <Sidebar
          navItems={navItemsToUse}
          user={
            user
              ? {
                  name: user.email || 'Usuario',
                  email: user.email || '',
                  // Usamos encodeURIComponent para manejar nombres con espacios/caracteres especiales
                  avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.email || 'U' // Fallback a una letra si el nombre es nulo
                  )}&background=0D8ABC&color=fff`,
                }
              : undefined
          }
          onLogout={logout}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <DashboardContent onToggleMobileSidebar={() => setMobileSidebarOpen(true)}>
          {children}
        </DashboardContent>
      </div>
    </ThemeProvider>
    
  );
}

export default DashboardLayout;
