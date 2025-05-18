"use client"
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import EnhancedMap from '@/components/Map'
import { 
  Package, 
  Search, 
  Map, 
  Award, 
  Clock, 
  Shield, 
  CheckCircle, 
  User, 
  Star, 
  ArrowRight, 
  Phone, 
  Truck,
  PlusCircle,
  MinusCircle
} from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import confetti from 'canvas-confetti'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [packageCount, setPackageCount] = useState(0)
  const [packomatCount, setPackomatCount] = useState(0)
  const [deliveryRate, setDeliveryRate] = useState(0)
  const [statsVisible, setStatsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [showNotification, setShowNotification] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [showTrackingResult, setShowTrackingResult] = useState(false)
  const [trackingStatus, setTrackingStatus] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [faqExpanded, setFaqExpanded] = useState({})
  const [packageSize, setPackageSize] = useState('medium')
  const [packageWeight, setPackageWeight] = useState(1)
  const [estimatedPrice, setEstimatedPrice] = useState(15.99)
  const [showPriceCalculator, setShowPriceCalculator] = useState(false)
  const [confettiTriggered, setConfettiTriggered] = useState(false)

  // Refs for scroll animations
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const trackingRef = useRef(null)
  const priceCalculatorRef = useRef(null)
  const testimonialRef = useRef(null)
  const appDemoRef = useRef(null)

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])

  // FAQ items
  const faqItems = [
    {
      question: "Jak długo trwa dostawa?",
      answer: "Standardowy czas dostawy wynosi 24-48 godzin od momentu nadania paczki. W przypadku przesyłek ekspresowych, dostawa może być zrealizowana nawet tego samego dnia."
    },
    {
      question: "Jak mogę śledzić moją paczkę?",
      answer: "Możesz śledzić swoją paczkę poprzez wprowadzenie numeru śledzenia na naszej stronie głównej lub w aplikacji mobilnej. Otrzymasz również powiadomienia SMS lub e-mail o statusie Twojej przesyłki."
    },
    {
      question: "Co się dzieje, jeśli nie odbiorę paczki w ciągu 48 godzin?",
      answer: "Paczka będzie dostępna do odbioru przez 72 godziny. Po tym czasie otrzymasz powiadomienie o przedłużeniu czasu odbioru o kolejne 24 godziny. Jeśli nadal nie odbierzesz paczki, zostanie ona zwrócona do nadawcy."
    },
    {
      question: "Jakie są wymiary maksymalne paczki?",
      answer: "Maksymalne wymiary paczki to 60x50x40 cm. Maksymalna waga to 25 kg. Dostępne są również specjalne paczkomaty dla większych przesyłek w wybranych lokalizacjach."
    },
    {
      question: "Czy mogę nadać paczkę za granicę?",
      answer: "Tak, oferujemy przesyłki międzynarodowe do większości krajów Unii Europejskiej. Czas dostawy wynosi od 3 do 7 dni roboczych, w zależności od kraju docelowego."
    }
  ]

  // Testimonials data
  const testimonials = [
    {
      name: "Anna Kowalska",
      role: "Właściciel sklepu internetowego",
      content: "PackSmart całkowicie zrewolucjonizował sposób, w jaki wysyłam produkty do moich klientów. System jest intuicyjny, a dostawy zawsze na czas!",
      rating: 5
    },
    {
      name: "Marcin Nowak",
      role: "Freelancer",
      content: "Korzystam z PackSmart do wysyłania dokumentów moim klientom. Niezawodność i szybkość tej usługi jest nieoceniona w mojej pracy.",
      rating: 5
    },
    {
      name: "Karolina Wiśniewska",
      role: "Manager e-commerce",
      content: "Po przejściu na PackSmart liczba reklamacji związanych z dostawą spadła o 95%. Nasi klienci są bardzo zadowoleni z możliwości odbioru paczek 24/7.",
      rating: 4
    },
    {
      name: "Piotr Dąbrowski",
      role: "Student",
      content: "Uwielbiam jak łatwo mogę odbierać i wysyłać paczki. Aplikacja jest prosta w obsłudze, a paczkomaty są dosłownie wszędzie!",
      rating: 5
    }
  ]

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

  // Price calculator
  useEffect(() => {
    // Base prices
    const basePrices = {
      small: 12.99,
      medium: 15.99,
      large: 19.99
    }
    
    // Weight calculation (additional cost per kg above 1kg)
    const weightCost = packageWeight > 1 ? (packageWeight - 1) * 2 : 0
    
    // Calculate estimated price
    const newPrice = basePrices[packageSize] + weightCost
    setEstimatedPrice(newPrice.toFixed(2))
  }, [packageSize, packageWeight])

  // Tracking system
  const handleTrackPackage = () => {
    if (!trackingNumber || trackingNumber.length < 5) {
      setShowTooltip(true)
      setTimeout(() => setShowTooltip(false), 3000)
      return
    }
    
    // Simulate tracking API call
    setShowTrackingResult(true)
    
    // Mock tracking data based on input
    // In real app, this would be a fetch to backend
    setTimeout(() => {
      const lastChar = trackingNumber.charAt(trackingNumber.length - 1)
      const statusOptions = [
        { 
          status: "delivered", 
          message: "Przesyłka dostarczona", 
          details: "Paczka została odebrana z paczkomatu przy ul. Warszawskiej 15",
          date: "17.05.2025, 14:23"
        },
        { 
          status: "in-transit", 
          message: "W trakcie dostawy", 
          details: "Przesyłka jest w drodze do paczkomatu przy ul. Warszawskiej 15",
          date: "17.05.2025, 09:17"
        },
        { 
          status: "pending", 
          message: "Paczka przygotowana do wysyłki", 
          details: "Przesyłka została zarejestrowana w systemie",
          date: "16.05.2025, 16:42"
        }
      ]
      
      // Choose status based on last character of tracking number
      const statusIndex = parseInt(lastChar, 10) % 3
      setTrackingStatus(statusOptions[statusIndex])
      
      // Trigger confetti animation if delivered
      if (statusOptions[statusIndex].status === "delivered" && !confettiTriggered) {
        runConfetti()
        setConfettiTriggered(true)
      }
    }, 1500)
  }
  
  // Confetti animation for successful delivery
  const runConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration
    
    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#ffffff']
    
    ;(function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })
      
      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
  }

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

  // Toggle FAQ items
  const toggleFaq = (index) => {
    setFaqExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
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
                repeatType: "reverse",
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

      {/* Track Package Section - NEW */}
      <section 
        ref={trackingRef}
        className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 md:p-8">
              <motion.div 
                className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Search size={24} />
                <h2 className="text-2xl font-bold">Śledź swoją paczkę</h2>
              </motion.div>
              
              <div className="relative">
                <div className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Wprowadź numer przesyłki..."
                    className="flex-1 dark:bg-gray-800 dark:border-gray-700"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                  />
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleTrackPackage}
                    >
                      Sprawdź
                    </Button>
                  </motion.div>
                </div>
                
                {showTooltip && (
                  <motion.div
                    className="absolute top-12 left-0 right-0 bg-red-500 text-white p-2 rounded text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    Wprowadź poprawny numer przesyłki
                  </motion.div>
                )}
                
                {/* Tracking Result */}
                <AnimatePresence>
                  {showTrackingResult && trackingStatus && (
                    <motion.div
                      className="mt-6 border dark:border-gray-700 rounded-lg overflow-hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className={`px-4 py-3 flex items-center justify-between ${
                        trackingStatus.status === 'delivered' ? 'bg-green-500 text-white' :
                        trackingStatus.status === 'in-transit' ? 'bg-blue-500 text-white' :
                        'bg-yellow-500 text-white'
                      }`}>
                        <div className="flex items-center space-x-2">
                          {trackingStatus.status === 'delivered' ? <CheckCircle size={20} /> :
                           trackingStatus.status === 'in-transit' ? <Truck size={20} /> :
                           <Clock size={20} />}
                          <span className="font-medium">{trackingStatus.message}</span>
                        </div>
                        <span className="text-sm">{trackingStatus.date}</span>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-800">
                        <p className="text-gray-600 dark:text-gray-300">{trackingStatus.details}</p>
                        <div className="mt-3 flex gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Numer przesyłki: <span className="font-medium">{trackingNumber}</span>
                          </div>
                          <div>
                            {trackingStatus.status === 'delivered' && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-100">
                                Dostarczona
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Price Calculator - NEW */}
      <section 
        ref={priceCalculatorRef} 
        className="py-16 bg-gray-50 dark:bg-gray-800"
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 dark:text-white">Oblicz koszt wysyłki</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Sprawdź, ile będzie kosztować wysłanie Twojej paczki
            </p>
          </motion.div>
          
          <motion.div 
            className="max-w-3xl mx-auto bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6 md:p-8">
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
                variants={staggerChildren}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUp} className="space-y-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Rozmiar paczki</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button 
                        className={`p-3 rounded-md border transition-all ${
                          packageSize === 'small' 
                            ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:border-blue-400 dark:text-blue-300' 
                            : 'border-gray-300 hover:border-blue-300 dark:border-gray-600 dark:hover: