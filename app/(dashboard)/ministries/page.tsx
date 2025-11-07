'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
  const [ministryMembers, setMinistryMembers] = useState<MinistryMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [, setSelectedMinistry] = useState<Ministry | null>(null);
  const [activeTab, setActiveTab] = useState<'ministries' | 'members'>('ministries');
  
  const { 
    getAllMinistries, 
    getAllMinistryMembers, 
    getMinistryMembersByMinistry,
    loading, 
    error 
  } = useMinistry();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ministriesData, membersData] = await Promise.all([
          getAllMinistries(),
          getAllMinistryMembers()
        ]);
        console.log('ministriesData:', ministriesData);
        console.log('membersData:', membersData);
        setMinistries(ministriesData);
        setMinistryMembers(membersData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos';
        toast.error(errorMessage);
      }
    };

    fetchData();
  }, [getAllMinistries, getAllMinistryMembers]);

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
    if (!searchQuery) return ministryMembers;
    const lowercasedQuery = searchQuery.toLowerCase();
    return ministryMembers.filter(member => 
      Object.values(member).some(value => 
        String(value).toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [searchQuery, ministryMembers]);

  const handleSearch = () => {
  };

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    getAllMinistries().then(setMinistries).catch(console.error);
  };

  const handleAddMemberSuccess = () => {
    setIsAddMemberModalOpen(false);
    getAllMinistryMembers().then(setMinistryMembers).catch(console.error);
  };

  const handleViewMembers = async (ministry: Ministry) => {
    console.log("handleViewMembers ministry", ministry);
    setSelectedMinistry(ministry);
    setActiveTab('members');
    try {
      const fetchedMembers = await getMinistryMembersByMinistry(ministry.id!);
      // Filtrar solo los miembros de este ministerio específico
      const filteredMembers = fetchedMembers.filter(member => member.ministryId === ministry.id);
      setMinistryMembers(filteredMembers);
    } catch {
      toast.error('Error al cargar miembros del ministerio');
    }
  };

  const ministryColumns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Nombre',
      accessorKey: 'name',
    },
    
    {
      header: 'Descripción',
      accessorKey: 'description',
      cell: ({ row }: { row: Row<Ministry> }) => (
        <span className="truncate max-w-xs">
          {row.original.description || '-'}
        </span>
      ),
    },
    
    {
      header: 'Misión',
      accessorKey: 'Mission',
      cell: ({ row }: { row: Row<Ministry> }) => (
        <span className="truncate max-w-xs">
          {row.original.mission || '-'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }: { row: Row<Ministry> }) => (
        <span className={row.original.status === 'A' ? 'text-green-600' : 'text-red-600'}>
          {row.original.status === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      cell: ({ row }: { row: Row<Ministry> }) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => handleViewMembers(row.original)}
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
      header: 'Ministerio ID',
      accessorKey: 'ministryId',
    },
    {
      header: 'Persona ID',
      accessorKey: 'personId',
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
    <div>
      {/* Header con título y botón - igual que people */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Ministerios
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Administra los ministerios y sus miembros del sistema.
          </p>
        </div>
        {activeTab === 'ministries' ? (
          <Button onClick={() => setIsCreateModalOpen(true)}>Nuevo</Button>
        ) : (
          <Button onClick={() => setIsAddMemberModalOpen(true)}>Nuevo</Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-6 mb-4">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('ministries')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ministries'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Ministerios
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
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

      {/* Búsqueda - igual que people */}
      <div className="flex items-center py-4 space-x-2">
        <Input
          placeholder={
            activeTab === 'ministries'
              ? "Buscar por nombre, descripción, misión o ID..."
              : "Buscar por ID de persona, rol o ID de ministerio..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSearch();
          }}
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>

      <div className="mt-4">
        {error && (
          <p className="text-center text-red-500 dark:text-red-400 mb-4">
            Error: {error}
          </p>
        )}
        {activeTab === 'ministries' ? (
          <DataTable
            data={filteredMinistries}
            columns={ministryColumns}
            loading={loading}
          />
        ) : (
          <DataTable
            data={filteredMembers}
            columns={memberColumns}
            loading={loading}
          />
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