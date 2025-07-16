import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      Welcome
      <Link
        href="/login"
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      >
        Iniciar Sesión
      </Link>
    </div>
  );
}
