'use client';

import React, { useState, useEffect } from 'react';
import { useMembership } from '@/features/membership';
import { Membership } from '@/core/domain/membership';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import  Modal  from '@/components/ui/Modal';
import { CreateMembershipForm } from '@/features/membership/components/CreateMembershipForm';
import { toast } from 'sonner';
import { Row } from '@tanstack/react-table';

export default function MembersPage() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { getAllMemberships, loading, error } = useMembership();

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const data = await getAllMemberships();
        setMemberships(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar memberships';
        toast.error(errorMessage);
      }
    };

    fetchMemberships();
  }, [getAllMemberships]);

  const filteredMemberships = memberships.filter(membership => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      (membership.personId && membership.personId.toLowerCase().includes(query)) || 
      (membership.state && membership.state.toLowerCase().includes(query)) ||
      (membership.id && membership.id.toLowerCase().includes(query))
    );
  });

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Recargar la lista de memberships
    getAllMemberships().then(setMemberships).catch(console.error);
  };

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Persona ID',
      accessorKey: 'personId',
    },
    {
      header: 'Estado',
      accessorKey: 'state',
    },
    {
      header: 'Status',
      accessorKey: 'status',
    },
    {
      header: 'Firmado',
      accessorKey: 'membershipSigned',
      cell: ({ row }: { row: Row<Membership> }) => (
        <span className={row.original.membershipSigned ? 'text-green-600' : 'text-red-600'}>
          {row.original.membershipSigned ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      header: 'Transferido',
      accessorKey: 'transferred',
      cell: ({ row }: { row: Row<Membership> }) => (
        <span className={row.original.transferred ? 'text-green-600' : 'text-red-600'}>
          {row.original.transferred ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      header: 'Bautizado',
      accessorKey: 'baptized',
      cell: ({ row }: { row: Row<Membership> }) => (
        <span className={row.original.baptized ? 'text-green-600' : 'text-red-600'}>
          {row.original.baptized ? 'Sí' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Membresía
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Administra los registros de membresía del sistema.
        </p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={() => setIsCreateModalOpen(true)}
        >
          Crear Membership
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <DataTable
          data={filteredMemberships}
          columns={columns}
          loading={loading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterPlaceholder="Buscar por ID de persona, estado o status..."
        />
      </div>

      {/* Modal para crear membership */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Crear Nuevo Membership"
      >
        <CreateMembershipForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

