export interface User {
  id: string;
  email: string;
  role?: 'admin' | 'user'; // Define los roles según tu aplicación
}

export interface AuthResponse {
  token: string;
  user: User;
}

