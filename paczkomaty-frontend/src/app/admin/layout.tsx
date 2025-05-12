'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@/lib/types'
import { fetchWithAuth } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await fetchWithAuth('/auth/me/')
        if (!userData.is_staff) {
          router.push('/dashboard')
          return
        }
        setUser(userData)
      } catch (error) {
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Panel administracyjny</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                {user.first_name} {user.last_name}
              </span>
              <ThemeToggle />
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  router.push('/login')
                }}
                className="btn-secondary"
              >
                Wyloguj
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              <Link
                href="/admin"
                className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Strona główna
              </Link>
              <Link
                href="/admin/lockers"
                className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Paczkomaty
              </Link>
              <Link
                href="/admin/users"
                className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Użytkownicy
              </Link>
              <Link
                href="/dashboard"
                className="block px-4 py-2 rounded-md hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Powrót do panelu użytkownika
              </Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 shadow dark:shadow-gray-700 rounded-lg p-6 dark:text-white">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
