/**
 * Define la estructura de un objeto de usuario.
 */
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

/**
 * Define la estructura de datos para crear un nuevo usuario.
 */
export interface NewUserPayload {
  username: string;
  password?: string;
}

/**
 * Define la estructura de la respuesta de la API al crear un usuario.
 */
export interface CreateUserResponse {
  message: string;
}