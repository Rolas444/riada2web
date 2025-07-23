'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { toast, Toaster } from 'sonner';
import CreateUserForm from './CreateUserForm';
import { useAuthStore } from '@/features/auth/store/authStore';
import { User } from '@/features/users/types/userTypes';
import { getUsers } from '@/features/users/api/usersApi';
import UsersTable from './UsersTable';

export default function UsersPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore(state => state.token);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError('No estás autenticado.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await getUsers(token);
      setUsers(fetchedUsers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserCreated = () => {
    setModalOpen(false);
    // Refrescar la lista de usuarios después de una creación exitosa.
    // La notificación de éxito ya la maneja el formulario.
    fetchUsers();
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

       <div className="mt-8">
        {loading && <p className="text-center">Cargando usuarios...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && <UsersTable users={users} />}
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
