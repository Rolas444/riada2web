"use client";

import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Person } from "@/core/domain/person";
import { useAuthStore } from "@/features/auth/store/authStore";
import { getPersons } from "@/features/persons/api/personApi";
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { CreatePersonForm } from "./CreatePersonForm";
import PeopleTable from "./PeopleTable";
import { Input } from '@/components/ui/Input';

export default function PeoplePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());

  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPersons = useCallback(async () => {
    if (!token) {
      setError('No estás autenticado.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const fetchedPersons = await getPersons(token, null); // Obtenemos todos, el filtro es local
      setAllPersons(fetchedPersons);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPersons();
  }, [fetchPersons]);

  const filteredPersons = useMemo(() => {
    if (!searchQuery) {
      return allPersons;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return allPersons.filter(person => {
      const fullName = `${person.name} ${person.middleName || ''} ${person.lastName}`.toLowerCase();
      const doc = `${person.typeDoc || ''}${person.docNumber || ''}`.toLowerCase().replace(/\s+/g, '');
      const email = (person.email || '').toLowerCase();
      
      return fullName.includes(lowercasedQuery) || 
             doc.includes(lowercasedQuery) || 
             email.includes(lowercasedQuery);
    });
  }, [searchQuery, allPersons]);

  const handleCloseModal = () => {
    setModalOpen(false);
    // Al cerrar el modal, cambiamos la key para forzar el re-renderizado del formulario, limpiándolo.
    setFormKey(Date.now());
  };

  const handlePersonCreated = () => {
    handleCloseModal();
    // Refrescar la lista de usuarios después de una creación exitosa.
    // La notificación de éxito ya la maneja el formulario. 
    fetchPersons();
    }

  return (
    <div>
      <Toaster richColors />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Personas
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Aquí puedes administrar las personas registradas en el sistema.
        </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Nuevo Registro</Button>
      </div>

      <div className="flex items-center py-4">
        <Input
          placeholder="Buscar por nombre, documento o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="mt-4">
        {loading && <p className="text-center text-gray-500 dark:text-gray-400">Cargando personas...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && <PeopleTable users={filteredPersons} />}
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Nuevo Registo de Persona"
      >
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Completa los campos para registrar una Persona en el sistema.
        </p>
        <CreatePersonForm key={formKey} onFormSubmit={handlePersonCreated} />
      </Modal>
    </div>
  );
}
