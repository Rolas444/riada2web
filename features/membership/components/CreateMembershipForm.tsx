'use client';

import React, { useState } from 'react';
import { useMembership } from '../hooks/useMembership';
import { CreateMembershipRequest } from '../types/membershipTypes';
import { MembershipStatus } from '@/core/domain/membership';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'sonner';

interface CreateMembershipFormProps {
  personId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateMembershipForm: React.FC<CreateMembershipFormProps> = ({
  personId,
  onSuccess,
  onCancel,
}) => {
  const { createMembership, loading, error } = useMembership();
  const [formData, setFormData] = useState<CreateMembershipRequest>({
    personId: personId || '',
    startedAt: new Date().toISOString().split('T')[0], // Formato YYYY-MM-DD
    state: 'A' as MembershipStatus, // Activo por defecto
    membershipSigned: false,
    status: 'Activo',
    transferred: false,
    nameLastChurch: '',
    Baptized: false,
    baptismDate: '',
  });

  const handleInputChange = (field: keyof CreateMembershipRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.personId) {
      toast.error('El ID de persona es requerido');
      return;
    }

    try {
      await createMembership(formData);
      toast.success('Membership creado exitosamente');
      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear membership';
      toast.error(errorMessage);
    }
  };

  const membershipStatusOptions = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
    { value: 'O', label: 'Otro' },
    { value: 'S', label: 'Suspendido' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ID de Persona *
          </label>
          <Input
            type="text"
            value={formData.personId}
            onChange={(e) => handleInputChange('personId', e.target.value)}
            placeholder="Ingrese el ID de la persona"
            required
            disabled={!!personId}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Inicio
          </label>
          <Input
            type="date"
            value={formData.startedAt}
            onChange={(e) => handleInputChange('startedAt', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estado *
          </label>
          <Select
            value={formData.state}
            onChange={(e) => handleInputChange('state', e.target.value as MembershipStatus)}
            required
          >
            {membershipStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <Input
            type="text"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            placeholder="Ej: Activo, Pendiente, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre de la Última Iglesia
          </label>
          <Input
            type="text"
            value={formData.nameLastChurch}
            onChange={(e) => handleInputChange('nameLastChurch', e.target.value)}
            placeholder="Nombre de la iglesia anterior"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Bautismo
          </label>
          <Input
            type="date"
            value={formData.baptismDate}
            onChange={(e) => handleInputChange('baptismDate', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.membershipSigned}
              onChange={(e) => handleInputChange('membershipSigned', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Membresía Firmada
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.transferred}
              onChange={(e) => handleInputChange('transferred', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Transferido
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.Baptized}
              onChange={(e) => handleInputChange('Baptized', e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Bautizado
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:border-red-800 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            // variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Membership'}
        </Button>
      </div>
    </form>
  );
};
