'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { ThemeProvider } from '@/features/theme/components/ThemeProvider';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // isAuthenticated puede ser `undefined` durante el render inicial en el cliente
    // antes de que zustand se hidrate. Esperamos a que sea un booleano.
    if (isAuthenticated === false) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // Muestra un estado de carga mientras se verifica la autenticación
  if (isAuthenticated === undefined || isAuthenticated === false) {
    return <div>Cargando...</div>; // O un skeleton/loader adecuado
  }

  return (
    <ThemeProvider>
      <main>{children}</main>
    </ThemeProvider>
  );
}

