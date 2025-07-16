import { AuthResponse } from '@/core/domain/user';

// Esto es un mock. Reemplázalo con tu llamada a la API real.
export async function loginWithCredentials(
  email: string,
  password: string,
  recaptchaToken: string,
): Promise<AuthResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: email, password, recaptchaToken }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al iniciar sesión');
  }

  return response.json();
}
