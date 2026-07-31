import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Navbar Header */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">ILoveStudy</h1>
        <nav className="space-x-4">
          <Link href="/login" className="bg-white text-blue-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Body Content */}
      <main className="max-w-4xl mx-auto flex-grow flex flex-col items-center justify-center text-center px-4 py-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Welcome to Your Ultimate Exam Portal
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl">
          Prepare, practice, and excel in your exams with real-time analytics, mock environments, and seamless scheduling.
        </p>
        <Link href="/login" className="bg-blue-600 text-white text-lg px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-blue-700 transition transform hover:scale-105">
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} ILoveStudy. All rights reserved.
      </footer>
    </div>
  );
}