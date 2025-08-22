import { Membership } from "@/core/domain/membership";
import {
  CreateMembershipRequest,
  UpdateMembershipRequest,
  MembershipResponse,
  MembershipsResponse,
  PersonMembershipResponse,
} from "../types/membershipTypes";

/**
 * Crea un nuevo registro de membership en el sistema.
 * Requiere un token de autenticación para la autorización.
 * @param membershipData - Los datos del nuevo membership.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const createMembership = async (
  membershipData: CreateMembershipRequest,
  token: string
): Promise<MembershipResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/membership`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(membershipData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Ocurrió un error al crear el membership.");
  }

  return result;
};

/**
 * Actualiza un registro de membership existente en el sistema.
 * Requiere un token de autenticación para la autorización.
 * @param membershipId - El ID del membership a actualizar.
 * @param membershipData - Los datos actualizados del membership.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const updateMembership = async (
  membershipId: string,
  membershipData: Partial<CreateMembershipRequest>,
  token: string
): Promise<MembershipResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/membership`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ id: membershipId, ...membershipData }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al actualizar el membership."
    );
  }

  return result;
};

/**
 * Obtiene un membership específico por su ID.
 * Requiere un token de autenticación para la autorización.
 * @param membershipId - El ID del membership a obtener.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con el membership.
 */
export const getMembershipById = async (
  membershipId: string,
  token: string
): Promise<Membership> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/membership/${membershipId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al obtener el membership."
    );
  }

  return result;
};

/**
 * Obtiene todos los memberships del sistema.
 * Requiere un token de autenticación para la autorización.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con un array de memberships.
 */
export const getAllMemberships = async (
  token: string
): Promise<Membership[]> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/membership`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al obtener los memberships."
    );
  }

  return result;
};

/**
 * Obtiene el membership de una persona específica (relación 1:1).
 * Requiere un token de autenticación para la autorización.
 * @param personId - El ID de la persona.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con el membership o null si no existe.
 */
export const getMembershipByPersonId = async (
  personId: string,
  token: string
): Promise<Membership | null> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/membership/person/${personId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al obtener el membership de la persona."
    );
  }

  // Para relación 1:1, retornamos el membership o null si no existe
  return result.data || null;
};

/**
 * Elimina un membership del sistema.
 * Requiere un token de autenticación para la autorización.
 * @param membershipId - El ID del membership a eliminar.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const deleteMembership = async (
  membershipId: string,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/membership/${membershipId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al eliminar el membership."
    );
  }

  return result;
};
