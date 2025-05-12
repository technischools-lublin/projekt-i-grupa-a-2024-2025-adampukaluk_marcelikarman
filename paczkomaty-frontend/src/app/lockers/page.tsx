'use client'

import LockerMap from '@/components/features/lockers/locker-map'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LockersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Sieć paczkomatów
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
            Znajdź najbliższy paczkomat i wyślij swoją paczkę
          </p>
        </div>

        <div className="card">
          <LockerMap />
        </div>
      </div>
    </div>
  )
}
