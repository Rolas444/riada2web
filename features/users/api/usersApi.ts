import { NewUserPayload, CreateUserResponse, User } from '../types/userTypes';

/**
 * Registra un nuevo usuario en el sistema.
 * Requiere un token de administrador para la autorización.
 * @param userData - Los datos del nuevo usuario (username, password).
 * @param token - El token JWT del administrador autenticado.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const createUser = async (
  userData: NewUserPayload,
  token: string
): Promise<CreateUserResponse> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';

  const response = await fetch(`${apiUrl}/protected/admin/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Ocurrió un error al crear el usuario.');
  }

  return result;
};

/**
 * Obtiene la lista de todos los usuarios del sistema.
 * Requiere un token de administrador para la autorización.
 * @param token - El token JWT del administrador autenticado.
 * @returns Una promesa que se resuelve con un array de usuarios.
 */
export const getUsers = async (token: string): Promise<User[]> => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001/api/v1';

  const response = await fetch(`${apiUrl}/protected/admin/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Ocurrió un error al obtener los usuarios.');
  }

  return result;
};