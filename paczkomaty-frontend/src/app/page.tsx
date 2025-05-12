import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-20">
        <div className="container mx-auto px-4 relative">
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              System Paczkomatów
            </h1>
            <p className="text-xl mb-8">
              Szybkie i bezpieczne wysyłanie paczek przez sieć paczkomatów
            </p>
            <div className="space-x-4">
              <Link href="/login" className="btn-primary">
                Zaloguj się
              </Link>
              <Link href="/register" className="btn-secondary">
                Zarejestruj się
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Nasze usługi</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Szybka wysyłka</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Wysyłaj paczki w dowolnym momencie, 24/7
              </p>
            </div>
            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Śledzenie przesyłek</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitoruj status swojej przesyłki w czasie rzeczywistym
              </p>
            </div>
            <div className="card text-center">
              <h3 className="text-xl font-semibold mb-4 dark:text-white">Sieć paczkomatów</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Dostęp do szerokiej sieci paczkomatów w całym kraju
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
