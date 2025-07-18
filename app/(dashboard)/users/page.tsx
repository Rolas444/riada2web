'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { Toaster } from 'sonner';
import CreateUserForm from './CreateUserForm';

export default function UsersPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleUserCreated = () => {
    setModalOpen(false);
    // Aquí podrías añadir lógica para refrescar la lista de usuarios
  };

  return (
    <div>
      <Toaster richColors />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Aquí puedes administrar los usuarios de la aplicación.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Crear Usuario</Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Crear Nuevo Usuario"
      >
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Completa los campos para registrar un nuevo usuario en el sistema.
        </p>
        <CreateUserForm onFormSubmit={handleUserCreated} />
      </Modal>

      {/* Aquí irá el contenido de la página de usuarios, como una tabla de usuarios, etc. */}
    </div>
  );
}
