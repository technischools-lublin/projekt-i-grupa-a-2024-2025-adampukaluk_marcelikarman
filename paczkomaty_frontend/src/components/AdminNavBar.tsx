'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Menu, X, Package, MapPin, LayoutDashboard, LogOut } from 'lucide-react'

export default function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Fetch user data with SWR for better caching and revalidation
  // const { data: user, mutate } = useSWR(API_ENDPOINTS.user, fetcher, {
  //   revalidateOnFocus: false,
  //   onError: (error) => {
  //     console.error('Failed to fetch user:', error)
  //     // If unauthorized, redirect to login
  //     if (error.message.includes('401')) {
  //       router.push('/login')
  //     }
  //   }
  // })

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/logout', {
        method: 'GET',
        credentials: 'include',
      })
     
      if (response.ok) {
        // Update the SWR cache to reflect logged out state
        // await mutate(null, false)
        router.push('/')
        router.refresh()
      } else {
        console.error('Logout failed:', await response.text())
      }
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navLinks = [
    { href: '/tracking', label: 'Śledź paczkę', icon: <Package size={18} /> },
    { href: '/admin/locations', label: 'Lokalizacje', icon: <MapPin size={18} /> },
    { href: '/admin', label: 'Panel', icon: <LayoutDashboard size={18} /> },
  ]

  const isLinkActive = (path: string) => pathname === path

  return (
    <nav className="bg-blue-800 dark:bg-blue-950 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Navigation */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link href="/" className="text-2xl font-bold text-white flex items-center">
              <span className="bg-white text-blue-800 px-2 py-1 rounded mr-2">P</span>
              Admin Dashboard
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-blue-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>

          {/* Desktop menu items */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={`flex items-center space-x-1 transition-all duration-200 ${
                  isLinkActive(link.href) 
                    ? "text-white font-semibold border-b-2 border-white" 
                    : "text-gray-100 hover:text-white"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="secondary"
                className="bg-white text-blue-800 hover:bg-gray-100 flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                Wyloguj się
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4"
          >
            <div className="flex flex-col space-y-3 pt-2 pb-3 border-t border-blue-700">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`flex items-center space-x-3 p-2 rounded ${
                    isLinkActive(link.href) 
                      ? "bg-blue-700 text-white font-medium" 
                      : "text-gray-100 hover:bg-blue-700"
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="flex items-center justify-between pt-2">
                <ThemeToggle />
                <Button
                  variant="secondary"
                  className="bg-white text-blue-800 hover:bg-gray-100 flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Wyloguj się
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}