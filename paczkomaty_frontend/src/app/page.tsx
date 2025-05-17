"use client"
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [packageCount, setPackageCount] = useState(0)
  const [packomatCount, setPackomatCount] = useState(0)
  const [deliveryRate, setDeliveryRate] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [showNotification, setShowNotification] = useState(false)

  // Refs for scroll animations
  const heroRef = useRef(null)
  const featuresRef = useRef(null)

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

  // Features carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  // Show a random notification after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true)
      
      // Hide notification after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowNotification(false)
      }, 5000)
      
      return () => clearTimeout(hideTimer)
    }, 10000)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isLoading && statsVisible) {
      // Number animation for paczkomats from 1 to 5000+
      const packomatInterval = setInterval(() => {
        setPackomatCount(prev => {
          if (prev < 5000) return prev + 50
          clearInterval(packomatInterval)
          return 5000
        })
      }, 15)

      // Number animation for packages from 1 to 1M+
      const packageInterval = setInterval(() => {
        setPackageCount(prev => {
          if (prev < 1000000) return prev + 10000
          clearInterval(packageInterval)
          return 1000000
        })
      }, 10)

      // Percentage animation from 0 to 99.8%
      const deliveryInterval = setInterval(() => {
        setDeliveryRate(prev => {
          if (prev < 99.8) return parseFloat((prev + 1).toFixed(1))
          clearInterval(deliveryInterval)
          return 99.8
        })
      }, 30)

      return () => {
        clearInterval(packomatInterval)
        clearInterval(packageInterval)
        clearInterval(deliveryInterval)
      }
    }
  }, [isLoading, statsVisible])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const notificationVariants = {
    hidden: { x: 300, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 }
  }

  return (
    <div className="min-h-screen dark:bg-gray-900 overflow-x-hidden">
      {/* Loading screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            className="fixed inset-0 bg-blue-600 flex items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotateZ: [0, 180, 360] 
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-20 h-20 border-8 border-white border-t-transparent rounded-full"
            />
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white font-bold text-2xl absolute mt-32"
            >
              PackSmart
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification popup */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg z-40 max-w-xs"
            variants={notificationVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="flex items-center">
              <div className="mr-3 bg-white rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Nowa przesyłka odebrana!</p>
                <p className="text-sm">Anna K. właśnie odebrała paczkę z paczkomatu #2137</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <motion.nav 
        className="bg-blue-800 dark:bg-blue-900 text-white shadow-sm sticky top-0 z-40"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white flex items-center">
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mr-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </motion.div>
            PackSmart
          </Link>
          <div className="flex items-center space-x-6">
            <Link href="/tracking" className="text-gray-100 hover:text-white relative group">
              Śledź paczkę
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link href="/locations" className="text-gray-100 hover:text-white relative group">
              Lokalizacje
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <ThemeToggle />
            <Link href="/login">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="secondary" 
                  className="ml-4 bg-white text-blue-800 hover:bg-gray-100"
                  onClick={() => {}}
                >
                  Zaloguj się
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Parallax */}
      <section 
        ref={heroRef}
        className="relative bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-800 dark:to-blue-950 text-white py-16 md:py-24 overflow-hidden"
      >
        {/* Decorative elements */}
        <motion.div 
          className="absolute inset-0 z-10"
          style={{ y: heroY }}
        >
          <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-400 opacity-10" />
          <div className="absolute top-40 right-20 w-32 h-32 rounded-full bg-blue-300 opacity-10" />
          <div className="absolute bottom-10 left-1/3 w-40 h-40 rounded-full bg-blue-500 opacity-10" />
        </motion.div>

        <div className="container mx-auto px-4 z-20 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              animate={{ 
                textShadow: ["0px 0px 0px rgba(255,255,255,0)", "0px 0px 10px rgba(255,255,255,0.5)", "0px 0px 0px rgba(255,255,255,0)"]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              System Paczkomatów
            </motion.h1>
            <motion.p 
              className="text-xl mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Szybkie i bezpieczne wysyłanie paczek przez sieć paczkomatów dostępnych 24/7
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4"
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link href="/login" className="w-full sm:w-auto block">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-white text-blue-700 hover:bg-gray-100"
                    onClick={() => {}}
                  >
                    Zaloguj się
                  </Button>
                </Link>
              </motion.div>
              <motion.div 
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Link href="/register" className="w-full sm:w-auto block">
                  <Button 
                    variant="outline" 
                    className="w-full bg-blue-500 text-white hover:bg-blue-600 border-white"
                    onClick={() => {}}
                  >
                    Zarejestruj się
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Animated parcel illustration */}
          <motion.div
            className="mt-12 relative h-32 hidden md:block max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="absolute w-16 h-16 bg-white shadow-lg rounded-md flex items-center justify-center"
              initial={{ x: "-100%" }}
              animate={{ x: "400%" }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </motion.div>
            <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/30 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-3xl font-bold text-center mb-6 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Nasze usługi
          </motion.h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Dostarczamy kompleksowe rozwiązania dla Twoich potrzeb wysyłkowych
          </motion.p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className={`bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative ${activeFeature === 0 ? 'ring-2 ring-blue-500' : ''}`}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
                animate={{ scale: activeFeature === 0 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                1
              </motion.div>
              <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                <motion.div
                  animate={{ rotateY: activeFeature === 0 ? 360 : 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center dark:text-white">Szybka wysyłka</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Wysyłaj paczki w dowolnym momencie, 24/7. Dostarczamy w ciągu 48 godzin na terenie całego kraju.
              </p>
              <motion.div
                className="w-full h-1 bg-gray-200 dark:bg-gray-600 mt-4 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className={`bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative ${activeFeature === 1 ? 'ring-2 ring-blue-500' : ''}`}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div 
                className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
                animate={{ scale: activeFeature === 1 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                2
              </motion.div>
              <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                <motion.div
                  animate={{ rotateY: activeFeature === 1 ? 360 : 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center dark:text-white">Śledzenie przesyłek</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Monitoruj status swojej przesyłki w czasie rzeczywistym. Otrzymuj powiadomienia SMS lub e-mail.
              </p>
              <motion.div
                className="w-full h-1 bg-gray-200 dark:bg-gray-600 mt-4 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.7 }}
                />
              </motion.div>
            </motion.div>
            
            <motion.div 
              className={`bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative ${activeFeature === 2 ? 'ring-2 ring-blue-500' : ''}`}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div 
                className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center"
                animate={{ scale: activeFeature === 2 ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5 }}
              >
                3
              </motion.div>
              <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                <motion.div
                  animate={{ rotateY: activeFeature === 2 ? 360 : 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center dark:text-white">Sieć paczkomatów</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Dostęp do szerokiej sieci paczkomatów w całym kraju. Zawsze znajdziesz paczkomat blisko Ciebie.
              </p>
              <motion.div
                className="w-full h-1 bg-gray-200 dark:bg-gray-600 mt-4 rounded-full overflow-hidden"
              >
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.9 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Map Demo */}
      <section className="py-16 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto relative">
            <motion.h2 
              className="text-3xl font-bold mb-8 dark:text-white text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Znajdź najbliższy paczkomat
            </motion.h2>
            
            <motion.div 
              className="relative h-64 md:h-80 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {/* Poland map placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-40 h-48">
                  {/* Basic Poland map shape */}
                  <svg viewBox="0 0 100 120" className="w-full h-full text-gray-400 dark:text-gray-500">
                    <path d="M30,10 L70,5 L95,30 L85,70 L60,100 L30,110 L5,85 L10,50 L30,10" fill="currentColor" />
                  </svg>
                  
                  {/* Animated paczkomat dots */}
                  <motion.div 
                    className="absolute top-1/4 left-1/4 w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                  <motion.div 
                    className="absolute bottom-1/4 right-1/3 w-3 h-3 bg-red-500 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  />
                </div>
              </div>
              
              {/* Map controls overlay */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <motion.button 
                  className="bg-white dark:bg-gray-800 p-2 rounded-full shadow"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </motion.button>
                <motion.button 
                  className="bg-white dark:bg-gray-800 p-2 rounded-full shadow"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </motion.button>
              </div>
              
              {/* Search overlay */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Wpisz adres lub kod pocztowy..."
                    className="bg-transparent border-none outline-none flex-1 text-gray-800 dark:text-gray-200 text-sm"
                  />
                  <motion.button 
                    className="bg-blue-600 text-white py-1 px-3 rounded text-xs"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Szukaj
                  </motion.button>
                </div>
              </div>
            </motion.div>
            
            <div className="flex justify-center mt-6">
              <Link href="/locations">
                <motion.button 
                  className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Wszystkie lokalizacje
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-8 md:p-12">
              <motion.h2 
                className="text-3xl font-bold text-center mb-6 dark:text-white"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Dołącz do nas już dziś!
              </motion.h2>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 text-center mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Rozpocznij korzystanie z naszego systemu paczkomatów i ciesz się szybką, bezpieczną dostawą.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="secondary" 
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {}}
                    >
                      Rozpocznij teraz
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/contact">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => {}}
                    >
                      Kontakt
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        className="py-16 bg-white dark:bg-gray-900"
        ref={(el) => {
          if (el && !statsVisible) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting) {
                  setStatsVisible(true)
                  observer.disconnect()
                }
              },
              { threshold: 0.1 }
            )
            observer.observe(el)
          }
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {packomatCount.toLocaleString()}+
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Paczkomatów w Polsce</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {(packageCount / 1000000).toFixed(1)} mln+
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Przesyłek miesięcznie</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {deliveryRate.toFixed(1)}%
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Dostarczonych na czas</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white">PackSmart</h3>
              <p className="text-gray-400">
                Nowoczesny system paczkomatów dla szybkiej i wygodnej wysyłki.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-200">Informacje</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-white">O nas</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white">Kontakt</Link></li>
                <li><Link href="/career" className="text-gray-400 hover:text-white">Kariera</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-200">Pomoc</h4>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Wsparcie</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Warunki</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-200">Kontakt</h4>
              <address className="not-italic text-gray-400">
                <p>ul. Kurierska 45</p>
                <p>00-001 Warszawa</p>
                <p className="mt-2">kontakt@packsmart.pl</p>
                <p>+48 123 456 789</p>
              </address>
            </div>
          </motion.div>
          <motion.div 
            className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p>&copy; {new Date().getFullYear()} PackSmart. Wszelkie prawa zastrzeżone.</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}