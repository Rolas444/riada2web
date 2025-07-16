'use client';

import { LoginForm } from '@/features/auth/components/LoginForm';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function LoginPage() {
  const reCaptchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_V3_SITE_KEY;

  if (!reCaptchaKey) {
    console.error(
      'La clave de reCAPTCHA no está configurada. El formulario podría no funcionar.',
    );

  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={reCaptchaKey!}>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <LoginForm />
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
}