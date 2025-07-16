'use client';

export function Providers({ children }: { children: React.ReactNode }) {
  // Este componente ya no es necesario para proveedores globales,
  // ya que se han movido a layouts/páginas específicas.
  return <>{children}</>;
}
