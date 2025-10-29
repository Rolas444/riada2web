import { Ministry, MinistryMember } from "@/core/domain/ministry";
import {
  CreateMinistryRequest,
  UpdateMinistryRequest,
  MinistryResponse,
  MinistriesResponse,
  CreateMinistryMemberRequest,
  UpdateMinistryMemberRequest,
  MinistryMemberResponse,
  MinistryMembersResponse,
  MinistryMembersByMinistryResponse,
} from "../types/ministryTypes";

// ===== MINISTRY API FUNCTIONS =====

/**
 * Crea un nuevo ministerio en el sistema.
 * Requiere un token de autenticación para la autorización.
 * @param ministryData - Los datos del nuevo ministerio.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const createMinistry = async (
  ministryData: CreateMinistryRequest,
  token: string
): Promise<MinistryResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";
  
  const requestBody = {
    name: ministryData.name,
    description: ministryData.description || null,
    mission: ministryData.mission || null,
    status: ministryData.status,
  };
  
  const response = await fetch(`${apiUrl}/protected/ministry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log("createMinistry result", result);
  if (!response.ok) {
    throw new Error(result.error || "Ocurrió un error al crear el ministerio.");
  }

  return result;
};

/**
 * Actualiza un ministerio existente en el sistema.
 * Requiere un token de autenticación para la autorización.
 * @param ministryId - El ID del ministerio a actualizar.
 * @param ministryData - Los datos actualizados del ministerio.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const updateMinistry = async (
  ministryId: string,
  ministryData: Partial<CreateMinistryRequest>,
  token: string
): Promise<MinistryResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  console.log("updateMinistry ministryData", ministryData);
  console.log("updateMinistry ministryId", ministryId);
  
  const requestBody = {
    id: Number(ministryId),
    name: ministryData.name,
    description: ministryData.description || null,
    mission: ministryData.mission || null,
    status: ministryData.status,
  };
  
  const response = await fetch(`${apiUrl}/protected/ministry`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al actualizar el ministerio."
    );
  }

  return result;
};

/**
 * Obtiene un ministerio específico por su ID.
 * Requiere un token de autenticación para la autorización.
 * @param ministryId - El ID del ministerio a obtener.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con el ministerio.
 */
export const getMinistryById = async (
  ministryId: string,
  token: string
): Promise<Ministry> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/ministry/${ministryId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al obtener el ministerio."
    );
  }

  return result;
};

/**
 * Obtiene todos los ministerios del sistema.
 * Requiere un token de autenticación para la autorización.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con un array de ministerios.
 */
export const getAllMinistries = async (
  token: string
): Promise<Ministry[]> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/ministry`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al obtener los ministerios."
    );
  }

  return result;
};

/**
 * Elimina un ministerio del sistema.
 * Requiere un token de autenticación para la autorización.
 * @param ministryId - El ID del ministerio a eliminar.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const deleteMinistry = async (
  ministryId: string,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/ministry/${ministryId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al eliminar el ministerio."
    );
  }

  return result;
};

// ===== MINISTRY MEMBER API FUNCTIONS =====

/**
 * Crea un nuevo miembro de ministerio en el sistema.
 * Requiere un token de autenticación para la autorización.
 * @param memberData - Los datos del nuevo miembro de ministerio.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const createMinistryMember = async (
  memberData: CreateMinistryMemberRequest,
  token: string
): Promise<MinistryMemberResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";
  
  const requestBody = {
    ministryID: Number(memberData.ministryId),
    personID: Number(memberData.personId),
    role: memberData.role || null,
    status: memberData.status,
  };
  
  const response = await fetch(`${apiUrl}/protected/ministry-member`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log("createMinistryMember result", result);
  if (!response.ok) {
    throw new Error(result.error || "Ocurrió un error al crear el miembro del ministerio.");
  }

  return result;
};

/**
 * Actualiza un miembro de ministerio existente en el sistema.
 * Requiere un token de autenticación para la autorización.
 * @param memberData - Los datos actualizados del miembro de ministerio.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const updateMinistryMember = async (
  memberData: UpdateMinistryMemberRequest,
  token: string
): Promise<MinistryMemberResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  console.log("updateMinistryMember memberData", memberData);
  
  const requestBody = {
    ministryID: Number(memberData.ministryId),
    personID: Number(memberData.personId),
    role: memberData.role || null,
    status: memberData.status,
  };
  
  const response = await fetch(`${apiUrl}/protected/ministry/member`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al actualizar el miembro del ministerio."
    );
  }

  return result;
};

/**
 * Obtiene todos los miembros de un ministerio específico.
 * Requiere un token de autenticación para la autorización.
 * @param ministryId - El ID del ministerio.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con un array de miembros del ministerio.
 */
export const getMinistryMembersByMinistry = async (
  ministryId: string,
  token: string
): Promise<MinistryMember[]> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/ministry/member/${ministryId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al obtener los miembros del ministerio."
    );
  }

  return result;
};

/**
 * Obtiene todos los miembros de ministerios del sistema.
 * Requiere un token de autenticación para la autorización.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con un array de miembros de ministerios.
 */
export const getAllMinistryMembers = async (
  token: string
): Promise<MinistryMember[]> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/ministry/member`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al obtener los miembros de ministerios."
    );
  }

  return result;
};

/**
 * Elimina un miembro de ministerio del sistema.
 * Requiere un token de autenticación para la autorización.
 * @param ministryId - El ID del ministerio.
 * @param personId - El ID de la persona.
 * @param token - El token JWT del usuario autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const deleteMinistryMember = async (
  ministryId: string,
  personId: string,
  token: string
): Promise<{ success: boolean; message: string }> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3001/api/v1";

  const response = await fetch(`${apiUrl}/protected/member/${ministryId}/${personId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.error || "Ocurrió un error al eliminar el miembro del ministerio."
    );
  }

  return result;
};
