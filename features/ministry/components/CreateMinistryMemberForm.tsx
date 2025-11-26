'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useMinistry } from '../hooks/useMinistry';
import { CreateMinistryMemberRequest, UpdateMinistryMemberRequest } from '../types/ministryTypes';
import { MinistryMember, MinistryStatus, Ministry } from '@/core/domain/ministry';
import { Person } from '@/core/domain/person';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Combobox, ComboboxOption } from '@/components/ui/Combobox';
import { getPersons } from '@/features/persons/api/personApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import useStore from '@/core/hooks/useStore';
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
  const { createMinistryMember, updateMinistryMember, getAllMinistries, getMinistryById, loading, error } = useMinistry();
  const token = useStore(useAuthStore, (state) => state.token);
  const isEditMode = !!memberToEdit;
  
  const [formData, setFormData] = useState<CreateMinistryMemberRequest>({
    ministryId: ministryId || memberToEdit?.ministryId || '',
    personId: memberToEdit?.personId || '',
    role: memberToEdit?.role || null,
    status: (memberToEdit?.status as MinistryStatus) || 'A',
  });

  // Efecto para cargar datos existentes cuando se edita
  useEffect(() => {
    if (isEditMode && memberToEdit) {
      setFormData({
        ministryId: memberToEdit.ministryId,
        personId: memberToEdit.personId,
        role: memberToEdit.role || null,
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
      if (isEditMode && memberToEdit) {
        const updateData: UpdateMinistryMemberRequest = {
          ministryId: formData.ministryId,
          personId: formData.personId,
          role: formData.role || null,
          status: formData.status,
        };
        const result = await updateMinistryMember(updateData);
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

  // Función para cargar todas las personas inicialmente
  const loadAllPersons = useCallback(async (): Promise<ComboboxOption<Person>[]> => {
    if (!token) {
      return [];
    }
    
    try {
      const persons = await getPersons(token, null);
      return persons.map((person) => {
        const fullName = [
          person.name?.trim(),
          person.middleName?.trim(),
          person.lastName?.trim(),
        ]
          .filter(Boolean)
          .join(' ');
        
        return {
          value: person.id,
          label: fullName || `ID: ${person.id}`,
          data: person,
        };
      });
    } catch (err) {
      console.error('Error loading persons:', err);
      return [];
    }
  }, [token]);

  // Función para filtrar personas (búsqueda en nombre completo y ID)
  const filterPersons = useCallback((option: ComboboxOption<Person>, query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    const matchesLabel = option.label.toLowerCase().includes(lowerQuery);
    const matchesId = String(option.value).toLowerCase().includes(lowerQuery);
    return matchesLabel || matchesId;
  }, []);

  // Función para cargar todos los ministerios inicialmente
  const loadAllMinistries = useCallback(async (): Promise<ComboboxOption<Ministry>[]> => {
    if (!token) {
      return [];
    }
    
    try {
      const ministries = await getAllMinistries();
      return ministries.map((ministry) => ({
        value: String(ministry.id),
        label: `${ministry.name} (ID: ${ministry.id})`,
        data: ministry,
      }));
    } catch (err) {
      console.error('Error loading ministries:', err);
      return [];
    }
  }, [getAllMinistries, token]);

  // Función para filtrar ministerios (búsqueda en nombre e ID)
  const filterMinistries = useCallback((option: ComboboxOption<Ministry>, query: string): boolean => {
    const lowerQuery = query.toLowerCase();
    return option.label.toLowerCase().includes(lowerQuery);
  }, []);

  const ministryStatusOptions = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        {/* Campo ministryId oculto si viene del contexto */}
        {!ministryId && (
          <Combobox<Ministry>
            label="Ministerio *"
            placeholder="Buscar ministerio por nombre o ID..."
            value={formData.ministryId}
            onChange={(value) => handleInputChange('ministryId', String(value))}
            loadInitialData={loadAllMinistries}
            filterFn={filterMinistries}
            required
            minSearchLength={0}
          />
        )}

        <Combobox<Person>
          label="Persona *"
          placeholder="Buscar persona por nombre o ID..."
          value={formData.personId}
          onChange={(value) => handleInputChange('personId', String(value))}
          loadInitialData={loadAllPersons}
          filterFn={filterPersons}
          required
          minSearchLength={0}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Rol
          </label>
          <Input
            type="text"
            value={formData.role || ''}
            onChange={(e) => handleInputChange('role', e.target.value || null)}
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
