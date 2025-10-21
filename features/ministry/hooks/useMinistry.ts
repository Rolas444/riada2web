'use client';

import { useState, useCallback } from 'react';
import { Ministry, MinistryMember } from '@/core/domain/ministry';
import { 
  CreateMinistryRequest, 
  CreateMinistryMemberRequest,
  UpdateMinistryMemberRequest 
} from '../types/ministryTypes';
import {
  createMinistry,
  updateMinistry,
  getMinistryById,
  getAllMinistries,
  deleteMinistry,
  createMinistryMember,
  updateMinistryMember,
  getMinistryMembersByMinistry,
  getAllMinistryMembers,
  deleteMinistryMember,
} from '../api/ministryApi';
import { useAuthStore } from '@/features/auth/store/authStore';
import useStore from '@/core/hooks/useStore';

export function useMinistry() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Usa el hook seguro para la hidratación para obtener el token
  const token = useStore(useAuthStore, (state) => state.token);

  const handleError = useCallback((error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error desconocido.';
    setError(errorMessage);
    return errorMessage;
  }, []);

  // ===== MINISTRY FUNCTIONS =====

  const createNewMinistry = useCallback(async (
    ministryData: CreateMinistryRequest
  ): Promise<Ministry | null> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await createMinistry(ministryData, token);
      return response.data;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const updateExistingMinistry = useCallback(async (
    ministryId: string,
    ministryData: Partial<CreateMinistryRequest>
  ): Promise<Ministry | null> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await updateMinistry(ministryId, ministryData, token);
      return response.data;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const fetchMinistryById = useCallback(async (
    ministryId: string
  ): Promise<Ministry | null> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const ministry = await getMinistryById(ministryId, token);
      return ministry;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const fetchAllMinistries = useCallback(async (): Promise<Ministry[]> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const ministries = await getAllMinistries(token);
      return ministries;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const removeMinistry = useCallback(async (
    ministryId: string
  ): Promise<boolean> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await deleteMinistry(ministryId, token);
      return response.success;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  // ===== MINISTRY MEMBER FUNCTIONS =====

  const createNewMinistryMember = useCallback(async (
    memberData: CreateMinistryMemberRequest
  ): Promise<MinistryMember | null> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await createMinistryMember(memberData, token);
      return response.data;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const updateExistingMinistryMember = useCallback(async (
    memberData: UpdateMinistryMemberRequest
  ): Promise<MinistryMember | null> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await updateMinistryMember(memberData, token);
      return response.data;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const fetchMinistryMembersByMinistry = useCallback(async (
    ministryId: string
  ): Promise<MinistryMember[]> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const members = await getMinistryMembersByMinistry(ministryId, token);
      return members;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const fetchAllMinistryMembers = useCallback(async (): Promise<MinistryMember[]> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      const members = await getAllMinistryMembers(token);
      return members;
    } catch (err) {
      const errorMessage = handleError(err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, handleError]);

  const removeMinistryMember = useCallback(async (
    ministryId: string,
    personId: string
  ): Promise<boolean> => {
    if (!token) {
      const errorMessage = 'No estás autenticado.';
      setError(errorMessage);
      return false;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await deleteMinistryMember(ministryId, personId, token);
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
    // Ministry functions
    createMinistry: createNewMinistry,
    updateMinistry: updateExistingMinistry,
    getMinistryById: fetchMinistryById,
    getAllMinistries: fetchAllMinistries,
    deleteMinistry: removeMinistry,
    // Ministry member functions
    createMinistryMember: createNewMinistryMember,
    updateMinistryMember: updateExistingMinistryMember,
    getMinistryMembersByMinistry: fetchMinistryMembersByMinistry,
    getAllMinistryMembers: fetchAllMinistryMembers,
    deleteMinistryMember: removeMinistryMember,
    clearError,
  };
}
