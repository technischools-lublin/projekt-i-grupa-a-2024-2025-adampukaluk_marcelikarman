import Link from 'next/link'
import RegisterForm from '@/components/features/auth/register-form'
import { ThemeToggle } from '@/components/theme-toggle'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Utwórz nowe konto
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Lub{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              zaloguj się, jeśli masz już konto
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
