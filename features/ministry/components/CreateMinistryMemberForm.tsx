'use client';

import React, { useState, useEffect } from 'react';
import { useMinistry } from '../hooks/useMinistry';
import { CreateMinistryMemberRequest } from '../types/ministryTypes';
import { MinistryMember, MinistryStatus } from '@/core/domain/ministry';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'sonner';

interface CreateMinistryMemberFormProps {
  ministryId?: string;
  memberToEdit?: MinistryMember | null;
  onSuccess?: (member: MinistryMember) => void;
  onCancel?: () => void;
}

export const CreateMinistryMemberForm: React.FC<CreateMinistryMemberFormProps> = ({
  ministryId,
  memberToEdit,
  onSuccess,
  onCancel,
}) => {
  const { createMinistryMember, updateMinistryMember, loading, error } = useMinistry();
  const isEditMode = !!memberToEdit;
  
  const [formData, setFormData] = useState<CreateMinistryMemberRequest>({
    id: memberToEdit?.id,
    ministryId: ministryId || memberToEdit?.ministryId || '',
    personId: memberToEdit?.personId || '',
    role: memberToEdit?.role || '',
    status: (memberToEdit?.status as MinistryStatus) || 'A',
  });

  // Efecto para cargar datos existentes cuando se edita
  useEffect(() => {
    if (isEditMode && memberToEdit) {
      setFormData({
        id: memberToEdit.id,
        ministryId: memberToEdit.ministryId,
        personId: memberToEdit.personId,
        role: memberToEdit.role || '',
        status: memberToEdit.status,
      });
    }
  }, [isEditMode, memberToEdit]);

  const handleInputChange = (field: keyof CreateMinistryMemberRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.ministryId) {
      toast.error('El ID del ministerio es requerido');
      return;
    }

    if (!formData.personId) {
      toast.error('El ID de la persona es requerido');
      return;
    }

    try {
      if (isEditMode && memberToEdit?.id) {
        const result = await updateMinistryMember(formData);
        if (result) {
          toast.success('Miembro del ministerio actualizado exitosamente');
          onSuccess?.(result);
        }
      } else {
        const result = await createMinistryMember(formData);
        if (result) {
          toast.success('Miembro del ministerio creado exitosamente');
          onSuccess?.(result);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar miembro del ministerio';
      toast.error(errorMessage);
    }
  };

  const ministryStatusOptions = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Campo ministryId oculto si viene del contexto */}
        {!ministryId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              ID del Ministerio *
            </label>
            <Input
              type="text"
              value={formData.ministryId}
              onChange={(e) => handleInputChange('ministryId', e.target.value)}
              placeholder="Ingrese el ID del ministerio"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ID de la Persona *
          </label>
          <Input
            type="text"
            value={formData.personId}
            onChange={(e) => handleInputChange('personId', e.target.value)}
            placeholder="Ingrese el ID de la persona"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rol
          </label>
          <Input
            type="text"
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            placeholder="Rol en el ministerio (ej: Líder, Miembro, etc.)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Estado *
          </label>
          <Select
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value as MinistryStatus)}
            required
          >
            {ministryStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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
          {loading ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Actualizar Miembro' : 'Agregar Miembro')}
        </Button>
      </div>
    </form>
  );
};
