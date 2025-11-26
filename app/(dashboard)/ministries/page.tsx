'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useMinistry } from '@/features/ministry';
import { Ministry, MinistryMember } from '@/core/domain/ministry';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { CreateMinistryForm } from '@/features/ministry/components/CreateMinistryForm';
import { CreateMinistryMemberForm } from '@/features/ministry/components/CreateMinistryMemberForm';
import { toast } from 'sonner';
import { Row } from '@tanstack/react-table';

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [selectedMinistryMembers, setSelectedMinistryMembers] = useState<MinistryMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [activeTab, setActiveTab] = useState<'ministries' | 'members'>('ministries');
  
  const { 
    getAllMinistries, 
    getMinistryMembersByMinistry,
    loading, 
    error 
  } = useMinistry();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ministriesData = await getAllMinistries();
        console.log('ministriesData:', ministriesData);
        setMinistries(ministriesData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos';
        toast.error(errorMessage);
      }
    };

    fetchData();
  }, [getAllMinistries]);

  const filteredMinistries = useMemo(() => {
    if (!searchQuery) return ministries;
    const lowercasedQuery = searchQuery.toLowerCase();
    return ministries.filter(ministry => 
      Object.values(ministry).some(value => 
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [searchQuery, ministries]);

  const filteredMembers = useMemo(() => {
    if (!searchQuery) return selectedMinistryMembers;
    const lowercasedQuery = searchQuery.toLowerCase();
    return selectedMinistryMembers.filter(member => 
      Object.values(member).some(value => 
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [searchQuery, selectedMinistryMembers]);

  const handleSearch = () => {
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    getAllMinistries().then(setMinistries).catch(console.error);
  };

  const refreshSelectedMinistryMembers = useCallback(async () => {
    if (!selectedMinistry?.id) return;
    try {
      const members = await getMinistryMembersByMinistry(String(selectedMinistry.id));
      setSelectedMinistryMembers(members);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar miembros del ministerio';
      toast.error(errorMessage);
    }
  }, [getMinistryMembersByMinistry, selectedMinistry]);

  const handleAddMemberSuccess = () => {
    setIsAddMemberModalOpen(false);
    refreshSelectedMinistryMembers();
  };

  const handleViewMembers = async (ministry: Ministry) => {
    console.log("handleViewMembers ministry", ministry);
    setSelectedMinistry(ministry);
    setActiveTab('members');
    try {
      const fetchedMembers = await getMinistryMembersByMinistry(String(ministry.id));
      setSelectedMinistryMembers(fetchedMembers);
    } catch {
      toast.error('Error al cargar miembros del ministerio');
    }
  };

  const ministryColumns = [
    {
      header: 'ID',
      accessorKey: 'id',
      size: 80,
      cell: ({ row }: { row: Row<Ministry> }) => (
        <span className="whitespace-nowrap">{row.original.id}</span>
      ),
    },
    {
      header: 'Nombre',
      accessorKey: 'name',
      size: 200,
      cell: ({ row }: { row: Row<Ministry> }) => (
        <span className="break-words">{row.original.name}</span>
      ),
    },
    {
      header: 'Descripción',
      accessorKey: 'description',
      size: 300,
      cell: ({ row }: { row: Row<Ministry> }) => (
        <span className="break-words text-gray-700 dark:text-gray-300">
          {row.original.description || '-'}
        </span>
      ),
    },
    {
      header: 'Misión',
      accessorKey: 'mission',
      size: 300,
      cell: ({ row }: { row: Row<Ministry> }) => (
        <span className="break-words text-gray-700 dark:text-gray-300">
          {row.original.mission || '-'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      size: 100,
      cell: ({ row }: { row: Row<Ministry> }) => (
        <span className={`whitespace-nowrap ${row.original.status === 'A' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {row.original.status === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      size: 150,
      cell: ({ row }: { row: Row<Ministry> }) => (
        <div className="flex space-x-2 whitespace-nowrap">
          <Button
            onClick={() => handleViewMembers(row.original)}
            className="text-xs px-2 py-1"
          >
            Ver Miembros
          </Button>
        </div>
      ),
    },
  ];

  const memberColumns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Ministerio',
      accessorKey: 'ministry.name',
    },
    {
      header: 'Persona',
      accessorKey: 'person.name',
      cell: ({ row }: { row: Row<MinistryMember> }) => {
        const { person } = row.original as MinistryMember & {
          person?: {
            name?: string;
            middleName?: string;
            lastName?: string;
          };
        };
        const fullName = [
          person?.name?.trim(),
          person?.middleName?.trim(),
          person?.lastName?.trim(),
        ]
          .filter(Boolean)
          .join(' ');

        return <span>{fullName || '-'}</span>;
      },
    },
    {
      header: 'Rol',
      accessorKey: 'role',
      cell: ({ row }: { row: Row<MinistryMember> }) => (
        <span className="truncate max-w-xs">
          {row.original.role || '-'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }: { row: Row<MinistryMember> }) => (
        <span className={row.original.status === 'A' ? 'text-green-600' : 'text-red-600'}>
          {row.original.status === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full max-w-full min-w-0">
      {/* Header con título y botón - responsivo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Ministerios
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra los ministerios y sus miembros del sistema.
          </p>
        </div>
        <div className="flex-shrink-0">
          {activeTab === 'ministries' ? (
            <Button onClick={() => setIsCreateModalOpen(true)} className="w-full sm:w-auto">
              Nuevo
            </Button>
          ) : (
            <Button onClick={() => setIsAddMemberModalOpen(true)} className="w-full sm:w-auto">
              Nuevo
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ministries')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'ministries'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Ministerios
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'members'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Miembros
            </button>
          </nav>
        </div>
      </div>

      {/* Búsqueda - responsivo */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 py-4">
        <Input
          placeholder={
            activeTab === 'ministries'
              ? "Buscar por nombre, descripción, misión o ID..."
              : "Buscar por ID de persona, rol o ID de ministerio..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-0"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button onClick={handleSearch} className="w-full sm:w-auto sm:flex-shrink-0">
          Buscar
        </Button>
      </div>

      <div className="mt-4 w-full min-w-0">
        {error && (
          <p className="text-center text-red-500 dark:text-red-400 mb-4">
            Error: {error}
          </p>
        )}
        {activeTab === 'ministries' ? (
          <div className="w-full min-w-0">
            <DataTable
              data={filteredMinistries}
              columns={ministryColumns}
              loading={loading}
            />
          </div>
        ) : (
          <>
            {selectedMinistry ? (
              <>
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Mostrando miembros del ministerio <span className="font-semibold">{selectedMinistry.name}</span>
                </p>
                <div className="w-full min-w-0">
                  <DataTable
                    data={filteredMembers}
                    columns={memberColumns}
                    loading={loading}
                  />
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                Selecciona un ministerio para ver sus miembros.
              </p>
            )}
          </>
        )}
      </div>

      {/* Modal para crear ministerio */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Ministerio"
      >
        <CreateMinistryForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      {/* Modal para agregar miembro */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Agregar Miembro al Ministerio"
      >
        <CreateMinistryMemberForm
          onSuccess={handleAddMemberSuccess}
          onCancel={() => setIsAddMemberModalOpen(false)}
        />
      </Modal>
    </div>
  );
}