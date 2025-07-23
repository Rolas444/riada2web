'use client';

import { useAuthStore } from '../store/authStore';
import { loginWithCredentials } from '../api/authApi';
import { useRouter } from 'next/navigation';
import useStore from '@/core/hooks/useStore';

export function useAuth() {
  const router = useRouter();
  const { login, logout } = useAuthStore();

  // Usa el hook seguro para la hidratación para obtener el estado de autenticación
  const isUserAuthenticated = useStore(
    useAuthStore,
    (state) => state.isAuthenticated,
  );

  const handleLogin = async (email: string, password: string, recaptchaToken: string) => {
    try {
      const { token, user } = await loginWithCredentials(email, password, recaptchaToken);
      
      // Guarda el token y el usuario en el store de autenticación
      login(token, user);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      throw error; // Propagamos el error para que el componente lo maneje
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return {
    login: handleLogin,
    logout: handleLogout,
    isAuthenticated: isUserAuthenticated,
  };
}
