'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User } from '@/lib/types'
import { fetchWithAuth } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

export default function DashboardLayout({
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
        setUser(userData)
      } catch (error) {
        console.log('Authentication error:', error)
        setUser({
          id: 1,
          username: 'temp_user',
          email: 'temp@example.com',
          first_name: 'Temporary',
          last_name: 'User',
          is_staff: false
        })
      }
    }

    checkAuth()
  }, [router])

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 dark:text-white">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel użytkownika</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 dark:text-gray-100 font-medium">
                {user.first_name} {user.last_name}
              </span>
              <ThemeToggle />
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  router.push('/login')
                }}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 font-medium rounded-md border border-red-300 transition-colors duration-200"
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
            <nav className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-gray-800/50 border border-gray-200 dark:border-gray-700">
              <Link
                href="/dashboard"
                className="block px-4 py-3 mb-2 rounded-md font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Strona główna
              </Link>
              <Link
                href="/dashboard/parcels"
                className="block px-4 py-3 mb-2 rounded-md font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Moje przesyłki
              </Link>
              <Link
                href="/dashboard/send"
                className="block px-4 py-3 mb-2 rounded-md font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Wyślij paczkę
              </Link>
              <Link
                href="/dashboard/history"
                className="block px-4 py-3 mb-2 rounded-md font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Historia
              </Link>
              {user.is_staff && (
                <Link
                  href="/admin"
                  className="block px-4 py-3 mb-2 rounded-md font-medium text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Panel administracyjny
                </Link>
              )}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-800/50 rounded-lg p-6 dark:text-white border border-gray-200 dark:border-gray-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
