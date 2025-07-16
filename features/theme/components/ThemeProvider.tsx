'use client';

import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import useStore from '@/core/hooks/useStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore(useThemeStore, (state) => state.theme);

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
}

