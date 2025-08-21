"use client";

import { Button } from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { Person} from "@/core/domain/person";
import { Phone } from "@/core/domain/phone";
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
import AddPhoneForm from "./PhoneForm";
import AddAddressForm from "./AddressForm";


//página principal
export default function PeoplePage() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const [allPersons, setAllPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAuthStore((state) => state.token);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [lastSelectedPersonId, setLastSelectedPersonId] = useState<string | null>(null);
  const [isPhoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneModalMode, setPhoneModalMode] = useState<'create' | 'edit'>('create');
  const [phoneToEdit, setPhoneToEdit] = useState<Phone | null>(null);
  const [phoneFormKey, setPhoneFormKey] = useState(0);
  const [personFormKey, setPersonFormKey] = useState(Date.now());
   
  // Estado para el modal de direcciones
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState<'create' | 'edit'>('create');
  const [addressToEdit, setAddressToEdit] = useState<any>(null);
  const [addressFormKey, setAddressFormKey] = useState(0);


  const handleRowClick = (person: Person) => {
    if (selectedPerson?.id === person.id) {
      // Si la persona clickeada ya está seleccionada, la deseleccionamos.
      setSelectedPerson(null);
    } else {
      // De lo contrario, la seleccionamos y guardamos su ID.
      setSelectedPerson(person);
      setLastSelectedPersonId(person.id);
    }
  };

  //carga de datos
  
  const fetchPersons = useCallback(async (query: string | null = null): Promise<Person[]> => {
    if (!token) {
      setError('No estás autenticado.');
      setLoading(false);
      return [];
    }
    try {
      setLoading(true);
      setError(null);
      const fetchedPersons = await getPersons(token, query);
      setAllPersons(fetchedPersons);
      return fetchedPersons;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
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
  };

  const handleFormSuccess = async () => {
    handleCloseModal();
    if (modalMode === 'edit' && lastSelectedPersonId) {
      const updatedPersons = await fetchPersons();
      const personToReselect = updatedPersons.find(p => p.id === lastSelectedPersonId);
      setSelectedPerson(personToReselect || null);
    } else {
      await fetchPersons(); // Recarga la lista
      setSelectedPerson(null); // Limpia la selección para que el panel de detalles se actualice
    }
  };

  const handleSearch = () => {
    fetchPersons(searchQuery);
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedPerson(null); // Limpiar la selección al crear uno nuevo
    setPersonFormKey(Date.now()); // Actualiza la key para forzar el reinicio del formulario
    setModalOpen(true);
  };

  const handleOpenEditModal = (person: Person) => {
    setModalMode('edit');
    setSelectedPerson(person); // Asegurarse de que la persona a editar esté seleccionada
    setModalOpen(true);
  };

  const handleOpenAddPhoneModal = () => {
    if (selectedPerson) {
      setPhoneModalMode('create');
      setPhoneToEdit(null);
      setPhoneFormKey(prevKey => prevKey + 1); // Reset form
      setPhoneModalOpen(true);
    }
  };

  const handleClosePhoneModal = () => {
    setPhoneModalOpen(false);
    setPhoneToEdit(null);
  };

  const handleOpenEditPhoneModal = (phone: Phone) => {
    if (selectedPerson) {
      setPhoneModalMode('edit');
      setPhoneToEdit(phone);
      setPhoneModalOpen(true);
    }
  }

  const handlePhoneFormSuccess = (phoneData: Phone) => {
    handleClosePhoneModal();
    if (selectedPerson) {
      let updatedPhones: Phone[];

      if (phoneModalMode === 'create') {
        // Add new phone
        updatedPhones = [...(selectedPerson.phones || []), phoneData];
      } else {
        // Update existing phone
        updatedPhones = (selectedPerson.phones || []).map(p => 
          p.id === phoneData.id ? phoneData : p
        );
      }

      // Optimistic update for selectedPerson
      const updatedPerson = { ...selectedPerson, phones: updatedPhones };
      setSelectedPerson(updatedPerson);

      // Optimistic update for allPersons list
      setAllPersons(prevPersons => 
        prevPersons.map(p => p.id === selectedPerson.id ? updatedPerson : p)
      );
    }
  };

  // Funciones para manejar direcciones
  const handleOpenAddAddressModal = () => {
    if (selectedPerson) {
      setAddressModalMode('create');
      setAddressToEdit(null);
      setAddressFormKey(prevKey => prevKey + 1); // Reset form
      setAddressModalOpen(true);
    }
  };

  const handleOpenEditAddressModal = (address: any) => {
    if (selectedPerson) {
      setAddressModalMode('edit');
      setAddressToEdit(address);
      setAddressModalOpen(true);
    }
  };

  const handleCloseAddressModal = () => {
    setAddressModalOpen(false);
    setAddressToEdit(null);
  };

  const handleAddressFormSuccess = (addressData: any) => {
    handleCloseAddressModal();
    if (selectedPerson) {
      let updatedAddresses: any[];

      if (addressModalMode === 'create') {
        // Add new address
        updatedAddresses = [...(selectedPerson.addresses || []), addressData];
      } else {
        // Update existing address
        updatedAddresses = (selectedPerson.addresses || []).map(a => 
          a.id === addressData.id ? addressData : a
        );
      }

      // Optimistic update for selectedPerson
      const updatedPerson = { ...selectedPerson, addresses: updatedAddresses };
      setSelectedPerson(updatedPerson);

      // Optimistic update for allPersons list
      setAllPersons(prevPersons => 
        prevPersons.map(p => p.id === selectedPerson.id ? updatedPerson : p)
      );
    }
  };

  const TabConfig: Tab[]=[
    {
      label: 'Datos Personales',
      content: <TabPersonData 
        person={selectedPerson} 
        onEditClick={handleOpenEditModal} 
        onAddPhoneClick={handleOpenAddPhoneModal} 
        onEditPhoneClick={handleOpenEditPhoneModal}
        onAddAddressClick={handleOpenAddAddressModal}
        onEditAddressClick={handleOpenEditAddressModal}
      />
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
      <div className="mt-2 h-[30vh] overflow-y-auto rounded-lg bg-gray-50 p-1 dark:border dark:border-gray-700 dark:bg-gray-800">
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
          key={modalMode === 'edit' && selectedPerson ? selectedPerson.id : personFormKey}
          onFormSubmit={handleFormSuccess}
          personToEdit={modalMode === 'edit' ? selectedPerson : null}
        />
      </Modal>

      {selectedPerson && (
        <Modal
          isOpen={isPhoneModalOpen}
          onClose={handleClosePhoneModal}
          title={phoneModalMode === 'edit' ? `Editar Teléfono de ${selectedPerson.name}` : `Añadir Teléfono a ${selectedPerson.name}`}
        >
          <AddPhoneForm
            key={phoneFormKey}
            personId={selectedPerson.id}
            onFormSubmit={handlePhoneFormSuccess}
            phoneToEdit={phoneToEdit}
          />
        </Modal>
      )}

      {selectedPerson && (
        <Modal
          isOpen={isAddressModalOpen}
          onClose={handleCloseAddressModal}
          title={addressModalMode === 'edit' ? `Editar Dirección de ${selectedPerson.name}` : `Añadir Dirección a ${selectedPerson.name}`}
        >
          <AddAddressForm
            key={addressFormKey}
            personId={selectedPerson.id}
            onFormSubmit={handleAddressFormSuccess}
            addressToEdit={addressToEdit}
          />
        </Modal>
      )}
    </div>
  );
}
