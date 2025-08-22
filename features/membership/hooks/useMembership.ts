'use client';

import { useState, useCallback } from 'react';
import { Membership } from '@/core/domain/membership';
import { CreateMembershipRequest } from '../types/membershipTypes';
import {
  createMembership,
  updateMembership,
  getMembershipById,
  getAllMemberships,
  deleteMembership,
} from '../api/membershipApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import useStore from '@/core/hooks/useStore';

export function useMembership() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usa el hook seguro para la hidratación para obtener el token
  const token = useStore(useAuthStore, (state) => state.token);

  const handleError = useCallback((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
    setError(errorMessage);
    return errorMessage;
  }, []);

  const createNewMembership = useCallback(async (
    membershipData: CreateMembershipRequest
  ): Promise<Membership | null> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await createMembership(membershipData, token);
      return response.data;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const updateExistingMembership = useCallback(async (
    membershipId: string,
    membershipData: Partial<CreateMembershipRequest>
  ): Promise<Membership | null> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await updateMembership(membershipId, membershipData, token);
      return response.data;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const fetchMembershipById = useCallback(async (
    membershipId: string
  ): Promise<Membership | null> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const membership = await getMembershipById(membershipId, token);
      return membership;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const fetchAllMemberships = useCallback(async (): Promise<Membership[]> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const memberships = await getAllMemberships(token);
      return memberships;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const removeMembership = useCallback(async (
    membershipId: string
  ): Promise<boolean> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await deleteMembership(membershipId, token);
      return response.success;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    createMembership: createNewMembership,
    updateMembership: updateExistingMembership,
    getMembershipById: fetchMembershipById,
    getAllMemberships: fetchAllMemberships,
    deleteMembership: removeMembership,
    clearError,
  };
}
