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

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [ministryMembers, setMinistryMembers] = useState<MinistryMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
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
    setSelectedMinistry(ministry);
    setActiveTab('members');
    try {
      const members = await getMinistryMembersByMinistry(ministry.id!);
      // Filtrar solo los miembros de este ministerio específico
      const filteredMembers = ministryMembers.filter(member => member.ministryId === ministry.id);
      setMinistryMembers(filteredMembers);
    } catch (err) {
      toast.error('Error al cargar miembros del ministerio');
    }
  };

  const ministryColumns = [
    {
      header: 'ID',
      accessorKey: 'ID',
    },
    {
      header: 'Nombre',
      accessorKey: 'Name',
    },
    
    {
      header: 'Descripción',
      accessorKey: 'Description',
      cell: ({ row }: any) => (
        <span className="truncate max-w-xs">
          {row.original.Description || '-'}
        </span>
      ),
    },
    
    {
      header: 'Misión',
      accessorKey: 'Mission',
      cell: ({ row }: any) => (
        <span className="truncate max-w-xs">
          {row.original.Mission || '-'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }: any) => (
        <span className={row.original.Status === 'A' ? 'text-green-600' : 'text-red-600'}>
          {row.original.Status === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessorKey: 'actions',
      cell: ({ row }: any) => (
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
      cell: ({ row }: any) => (
        <span className="truncate max-w-xs">
          {row.original.role || '-'}
        </span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }: any) => (
        <span className={row.original.status === 'A' ? 'text-green-600' : 'text-red-600'}>
          {row.original.status === 'A' ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Ministerios
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Administra los ministerios y sus miembros del sistema.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
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

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-3">
          {activeTab === 'ministries' && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
            >
              Crear Ministerio
            </Button>
          )}
          {activeTab === 'members' && (
            <Button
              onClick={() => setIsAddMemberModalOpen(true)}
            >
              Agregar Miembro
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="mt-4">
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