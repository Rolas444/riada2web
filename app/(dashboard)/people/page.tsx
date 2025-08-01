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
import Tabs, { Tab } from "@/components/ui/Tabs";
import { TabPersonData } from "./TabPersonData";
import { TabMembershipData } from "./TabMembershipData";


//página principal
export default function PeoplePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [formKey, setFormKey] = useState(Date.now());

  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);


  const handleRowClick = (person: Person) => {
    // Si la persona clickeada ya está seleccionada, la deseleccionamos (poniendo el estado a null).
    // Si no, la seleccionamos.
    setSelectedPerson(prevSelected => (prevSelected && prevSelected.id === person.id) ? null : person);
  };

  //carga de datos
  
  const fetchPersons = useCallback(async (query: string | null = null) => {
    if (!token) {
      setError('No estás autenticado.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const fetchedPersons = await getPersons(token, query);
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
    fetchPersons(); // Carga inicial
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

  const handleFormSuccess = () => {
    handleCloseModal();
    // Refrescar la lista de usuarios después de una creación exitosa.
    // La notificación de éxito ya la maneja el formulario. 
    fetchPersons(); // Recarga la lista
    setSelectedPerson(null); // Limpia la selección para que el panel de detalles se actualice
  }

  const handleSearch = () => {
    fetchPersons(searchQuery);
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedPerson(null); // Limpiar la selección al crear uno nuevo
    setModalOpen(true);
  };

  const handleOpenEditModal = (person: Person) => {
    setModalMode('edit');
    setSelectedPerson(person); // Asegurarse de que la persona a editar esté seleccionada
    setModalOpen(true);
  };

  const TabConfig: Tab[]=[
    {
      label: 'Datos Personales',
      content: <TabPersonData person={selectedPerson} onEditClick={handleOpenEditModal} />
    },
    {
      label: 'Membresía',
      content: <TabMembershipData person={selectedPerson} />
    }
  ]

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
        <Button onClick={handleOpenCreateModal}>Nuevo</Button>
      </div>

      {/* Panel de detalles con pestañas */}
      <div className="mt-6 h-[40vh] overflow-y-auto rounded-lg bg-gray-50 p-1 dark:border dark:border-gray-700 dark:bg-gray-800">
        <Tabs tabs={TabConfig} />
      </div>

      <div className="flex items-center py-4 space-x-2">
        <Input
          placeholder="Buscar por nombre, documento o email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>

      <div className="mt-4">
        {loading && <p className="text-center text-gray-500 dark:text-gray-400">Cargando personas...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && <PeopleTable 
          persons={filteredPersons} 
          onRowClick={handleRowClick}
          selectedPersonId={selectedPerson?.id}
        />}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalMode === 'edit' ? 'Editar Persona' : 'Nuevo Registo de Persona'}
      >
        <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          {modalMode === 'edit' 
            ? 'Modifica los datos de la persona seleccionada.'
            : 'Completa los campos para registrar una Persona en el sistema.'
          }
        </p>
        <CreatePersonForm 
          key={formKey} 
          onFormSubmit={handleFormSuccess}
          personToEdit={modalMode === 'edit' ? selectedPerson : null}
        />
      </Modal>
    </div>
  );
}
