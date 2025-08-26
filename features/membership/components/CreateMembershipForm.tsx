'use client';

import React, { useState, useEffect } from 'react';
import { useMembership } from '../hooks/useMembership';
import { CreateMembershipRequest } from '../types/membershipTypes';
import { Membership, MembershipState } from '@/core/domain/membership';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { toast } from 'sonner';

interface CreateMembershipFormProps {
  personId?: string;
  membershipToEdit?: Membership | null;
  onSuccess?: (membership: Membership) => void;
  onCancel?: () => void;
}

export const CreateMembershipForm: React.FC<CreateMembershipFormProps> = ({
  personId,
  membershipToEdit,
  onSuccess,
  onCancel,
}) => {
  const { createMembership, updateMembership, loading, error } = useMembership();
  const isEditMode = !!membershipToEdit;
  
  const [formData, setFormData] = useState<CreateMembershipRequest>({
    id: membershipToEdit?.id, // Incluir el ID cuando se edita
    personId: personId || '',
    startedAt: membershipToEdit?.startedAt 
      ? new Date(membershipToEdit.startedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    state: (membershipToEdit?.state as MembershipState) || 'A',
    membershipSigned: membershipToEdit?.membershipSigned || false,
    transferred: membershipToEdit?.transferred || false,
    nameLastChurch: membershipToEdit?.nameLastChurch || '',
    Baptized: membershipToEdit?.baptized ?? true, // Usar 'baptized' del dominio
    baptismDate: membershipToEdit?.baptismDate 
      ? new Date(membershipToEdit.baptismDate).toISOString().split('T')[0]
      : '',
  });

  // Efecto para manejar la lógica de nameLastChurch basada en transferred
  useEffect(() => {
    if (!formData.transferred) {
      setFormData(prev => ({
        ...prev,
        nameLastChurch: ''
      }));
    }
  }, [formData.transferred]);

  // Efecto para reiniciar el formulario cuando se crea exitosamente
  useEffect(() => {
    if (!isEditMode && !loading && !error) {
              setFormData({
          personId: personId || '',
        startedAt: new Date().toISOString().split('T')[0],
        state: 'A' as MembershipState,
        membershipSigned: false,
        transferred: false,
        nameLastChurch: '',
        Baptized: true, // Mantener true por defecto
        baptismDate: '',
      });
    }
  }, [isEditMode, loading, error, personId]);

  // Efecto para cargar datos existentes cuando se edita
  useEffect(() => {
    if (isEditMode && membershipToEdit) {
      setFormData({
        personId: personId || '', // Usar el personId de la persona seleccionada
        startedAt: membershipToEdit.startedAt 
          ? new Date(membershipToEdit.startedAt).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        state: membershipToEdit.state,
        membershipSigned: membershipToEdit.membershipSigned,
        transferred: membershipToEdit.transferred,
        nameLastChurch: membershipToEdit.nameLastChurch || '',
        Baptized: membershipToEdit.baptized ?? true, // Usar 'baptized' del dominio
        baptismDate: membershipToEdit.baptismDate 
          ? new Date(membershipToEdit.baptismDate).toISOString().split('T')[0]
          : '',
      });
    }
  }, [isEditMode, membershipToEdit, personId]);

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
      if (isEditMode && membershipToEdit?.id) {
        const result = await updateMembership(membershipToEdit.id, formData);
        if (result) {
          toast.success('Membership actualizado exitosamente');
          onSuccess?.(result);
        }
      } else {
        const result = await createMembership(formData);
        if (result) {
          toast.success('Membership creado exitosamente');
          onSuccess?.(result);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar membership';
      toast.error(errorMessage);
    }
  };

  const membershipStateOptions = [
    { value: 'A', label: 'Activo' },
    { value: 'I', label: 'Inactivo' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo personId oculto - solo se muestra si no viene del contexto */}
        {!personId && (
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
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha de Alta
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
            onChange={(e) => handleInputChange('state', e.target.value as MembershipState)}
            required
          >
            {membershipStateOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
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
            disabled={!formData.transferred}
            className={!formData.transferred ? 'bg-gray-100 cursor-not-allowed dark:bg-gray-700' : ''}
          />
          {!formData.transferred && (
            <p className="text-xs text-gray-500 mt-1">
              Este campo se habilita cuando la persona es transferida
            </p>
          )}
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
              firmó membresía
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
          {loading ? (isEditMode ? 'Actualizando...' : 'Creando...') : (isEditMode ? 'Actualizar Membership' : 'Crear Membership')}
        </Button>
      </div>
    </form>
  );
};
