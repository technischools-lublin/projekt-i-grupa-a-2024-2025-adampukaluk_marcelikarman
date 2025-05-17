// /components/features/auth/auth-header.tsx
import Link from 'next/link';

export function AuthHeader({ title, subtitle, linkText, linkHref }) {
  return (
    <div className="text-center space-y-2">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h1>
      {subtitle && linkText && linkHref && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {subtitle}{' '}
          <Link 
            href={linkHref} 
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {linkText}
          </Link>
        </p>
      )}
    </div>
  );
}
