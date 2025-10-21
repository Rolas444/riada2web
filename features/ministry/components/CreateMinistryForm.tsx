'use client';

import React, { useState, useEffect } from 'react';
import { useMinistry } from '../hooks/useMinistry';
import { CreateMinistryRequest } from '../types/ministryTypes';
import { Ministry, MinistryStatus } from '@/core/domain/ministry';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'sonner';

interface CreateMinistryFormProps {
  ministryToEdit?: Ministry | null;
  onSuccess?: (ministry: Ministry) => void;
  onCancel?: () => void;
}

export const CreateMinistryForm: React.FC<CreateMinistryFormProps> = ({
  ministryToEdit,
  onSuccess,
  onCancel,
}) => {
  const { createMinistry, updateMinistry, loading, error } = useMinistry();
  const isEditMode = !!ministryToEdit;
  
  const [formData, setFormData] = useState<CreateMinistryRequest>({
    id: ministryToEdit?.id,
    name: ministryToEdit?.name || '',
    description: ministryToEdit?.description || '',
    mission: ministryToEdit?.mission || '',
    status: (ministryToEdit?.status as MinistryStatus) || 'A',
  });

  // Efecto para cargar datos existentes cuando se edita
  useEffect(() => {
    if (isEditMode && ministryToEdit) {
      setFormData({
        id: ministryToEdit.id,
        name: ministryToEdit.name,
        description: ministryToEdit.description || '',
        mission: ministryToEdit.mission || '',
        status: ministryToEdit.status,
      });
    }
  }, [isEditMode, ministryToEdit]);

  const handleInputChange = (field: keyof CreateMinistryRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('El nombre del ministerio es requerido');
      return;
    }

    try {
      if (isEditMode && ministryToEdit?.id) {
        const result = await updateMinistry(ministryToEdit.id, formData);
        if (result) {
          toast.success('Ministerio actualizado exitosamente');
          onSuccess?.(result);
        }
      } else {
        const result = await createMinistry(formData);
        if (result) {
          toast.success('Ministerio creado exitosamente');
          onSuccess?.(result);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar ministerio';
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
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre del Ministerio *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Ingrese el nombre del ministerio"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Descripción del ministerio"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Misión
          </label>
          <textarea
            value={formData.mission}
            onChange={(e) => handleInputChange('mission', e.target.value)}
            placeholder="Misión del ministerio"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
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
          {loading ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Actualizar Ministerio' : 'Crear Ministerio')}
        </Button>
      </div>
    </form>
  );
};