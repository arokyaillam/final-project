import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <main className="container mx-auto p-4 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Next.js App</h1>
        <p className="text-xl mb-8">A clean and minimal Next.js application with MongoDB, Axios, React Query, Redux, and shadcn/ui.</p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
