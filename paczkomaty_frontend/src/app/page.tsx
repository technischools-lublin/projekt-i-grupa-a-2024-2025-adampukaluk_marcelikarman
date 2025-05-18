"use client";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import EnhancedMap from "@/components/Map";
import CountUp from 'react-countup'
import { Map, Package, Clock, Star, Users } from 'lucide-react'
import Image from "next/image";
import AdamPIC from "../../public/appCreators/me2.jpg";
import MarceliPIC from "../../public/appCreators/marceli.jpg"
import ChatGPT from "../../public/appCreators/ChatGPT-Logo.svg.png"
import CursorIA from "../../public/appCreators/cursor.png"
import CloudeAI from "../../public/appCreators/cloude.png"

// Rozszerzone dane opinii klientów
const testimonials = [
  {
    name: "Anna Kowalska",
    location: "Warszawa",
    role: "Właścicielka sklepu internetowego",
    text: "PackSmart całkowicie zrewolucjonizował sposób, w jaki wysyłam produkty do moich klientów. System jest intuicyjny, a dostawy zawsze na czas! Polecam każdemu, kto ceni sobie wygodę i bezpieczeństwo.",
    rating: 5,
  },
  {
    name: "Marcin Nowak",
    location: "Kraków",
    role: "Freelancer",
    text: "Korzystam z PackSmart do wysyłania dokumentów moim klientom. Niezawodność i szybkość tej usługi jest nieoceniona w mojej pracy. Obsługa klienta na najwyższym poziomie!",
    rating: 5,
  },
  {
    name: "Karolina Wiśniewska",
    location: "Gdańsk",
    role: "Manager e-commerce",
    text: "Po przejściu na PackSmart liczba reklamacji związanych z dostawą spadła o 95%. Nasi klienci są bardzo zadowoleni z możliwości odbioru paczek 24/7. To była świetna decyzja biznesowa!",
    rating: 4,
  },
  {
    name: "Piotr Dąbrowski",
    location: "Poznań",
    role: "Student",
    text: "Uwielbiam jak łatwo mogę odbierać i wysyłać paczki. Aplikacja jest prosta w obsłudze, a paczkomaty są dosłownie wszędzie!",
    rating: 5,
  },
  {
    name: "Ewa Zielińska",
    location: "Wrocław",
    role: "Przedsiębiorca",
    text: "Dzięki PackSmart mogę skupić się na rozwoju firmy, a nie na logistyce. Szybko, sprawnie, bezproblemowo.",
    rating: 5,
  },
  {
    name: "Tomasz Krawczyk",
    location: "Łódź",
    role: "Kurier",
    text: "Jako kurier doceniam intuicyjność systemu i wsparcie techniczne. Paczki zawsze trafiają do celu na czas.",
    rating: 4,
  },
]

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isBusinessPricing, setIsBusinessPricing] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<null | number>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for scroll animations
  const heroRef = useRef(null);

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Show a random notification after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNotification(true);

      // Hide notification after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);

      return () => clearTimeout(hideTimer);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Automatyczne przewijanie opinii z zatrzymaniem na hover
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [isPaused, testimonials.length])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const notificationVariants = {
    hidden: { x: 300, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 },
  };

  // Dane planów cenowych
  const pricingPlans = [
    {
      name: 'Start',
      description: 'Idealny dla osób wysyłających paczki okazjonalnie.',
      price: 19.99,
      businessPrice: 29.99,
      features: [
        '1 wysyłka miesięcznie',
        'Podstawowe wsparcie',
        'Śledzenie przesyłek',
        'Dostęp do aplikacji mobilnej',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      description: 'Najlepszy wybór dla regularnych użytkowników.',
      price: 39.99,
      businessPrice: 59.99,
      features: [
        '10 wysyłek miesięcznie',
        'Priorytetowe wsparcie',
        'Zaawansowane śledzenie',
        'Integracja z e-commerce',
        'Powiadomienia SMS',
      ],
      popular: true,
    },
    {
      name: 'Biznes',
      description: 'Dla firm i sklepów wysyłających dużo paczek.',
      price: 89.99,
      businessPrice: 129.99,
      features: [
        'Bez limitu wysyłek',
        'Dedykowany opiekun',
        'Zaawansowane raporty',
        'Integracje API',
        'Faktury VAT',
        'Personalizowane powiadomienia',
      ],
      popular: false,
    },
  ]

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
                rotateZ: [0, 180, 360],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium">Nowa przesyłka odebrana!</p>
                <p className="text-sm">
                  Anna K. właśnie odebrała paczkę z paczkomatu #2137
                </p>
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
          <Link
            href="/"
            className="text-2xl font-bold text-white flex items-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mr-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                />
              </svg>
            </motion.div>
            PackSmart
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              href="/tracking"
              className="text-gray-100 hover:text-white relative group"
            >
              Śledź paczkę
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link
              href="/locations"
              className="text-gray-100 hover:text-white relative group"
            >
              Lokalizacje
              <motion.span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <ThemeToggle />
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
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
        <motion.div className="absolute inset-0 z-10" style={{ y: heroY }}>
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
                textShadow: [
                  "0px 0px 0px rgba(255,255,255,0)",
                  "0px 0px 10px rgba(255,255,255,0.5)",
                  "0px 0px 0px rgba(255,255,255,0)",
                ],
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
              Szybkie i bezpieczne wysyłanie paczek przez sieć paczkomatów
              dostępnych 24/7
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
                ease: "easeInOut",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </motion.div>
            <div className="absolute left-0 right-0 bottom-0 h-1 bg-white/30 rounded-full" />
          </motion.div>
        </div>
      </section>


{/* Interactive Pricing Comparison Section */}
<section className="py-16 bg-white dark:bg-gray-900">
  <div className="container mx-auto px-4">
    <motion.h2 
      className="text-3xl font-bold text-center mb-2 dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      Wybierz pakiet dla siebie
    </motion.h2>
    <motion.p 
      className="text-gray-600 dark:text-gray-300 text-center max-w-2xl mx-auto mb-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      Transparentne ceny, bez ukrytych opłat
    </motion.p>
    
    {/* Toggle switch for personal/business */}
    <div className="flex justify-center items-center mb-8">
      <span className={`mr-3 ${isBusinessPricing ? 'text-gray-500 dark:text-gray-400' : 'font-semibold text-blue-600 dark:text-blue-400'}`}>
        Klient indywidualny
      </span>
      <div 
        className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer ${isBusinessPricing ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
        onClick={() => setIsBusinessPricing(!isBusinessPricing)}
      >
        <motion.div 
          className="bg-white w-5 h-5 rounded-full shadow-md"
          animate={{ x: isBusinessPricing ? 28 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>
      <span className={`ml-3 ${isBusinessPricing ? 'font-semibold text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
        Firma
      </span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {pricingPlans.map((plan, index) => (
        <motion.div
          key={index}
          className={`relative bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden ${
            hoveredPlan === index ? 'ring-2 ring-blue-500 transform scale-105' : ''
          } ${plan.popular ? 'border-t-4 border-blue-500' : ''}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onMouseEnter={() => setHoveredPlan(index)}
          onMouseLeave={() => setHoveredPlan(null)}
        >
          {plan.popular && (
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              Najczęściej wybierany
            </div>
          )}
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 dark:text-white">{plan.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 h-12">{plan.description}</p>
            <div className="mt-4 mb-6">
              <span className="text-4xl font-bold dark:text-white">{isBusinessPricing ? plan.businessPrice : plan.price} zł</span>
              <span className="text-gray-500 dark:text-gray-400">/miesiąc</span>
            </div>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                plan.popular
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-white dark:bg-gray-800 border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'
              }`}
            >
              Wybierz plan
            </motion.button>
          </div>
        </motion.div>
      ))}
    </div>
    
    <motion.p 
      className="text-center text-gray-500 dark:text-gray-400 mt-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.6 }}
    >
      Masz pytania? <Link href="/contact" className="text-blue-600 dark:text-blue-400 underline hover:no-underline">Skontaktuj się z nami</Link>
    </motion.p>
  </div>
</section>


      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-100/80 via-blue-100/80 to-white dark:from-indigo-900 dark:via-blue-900 dark:to-gray-900 overflow-hidden">
        {/* Dekoracje tła */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/3 w-60 h-60 bg-purple-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-300/20 rounded-full blur-2xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl font-bold text-center mb-2 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Nasze usługi
          </motion.h2>
          <motion.p
            className="text-blue-600 dark:text-blue-400 text-center font-semibold mb-8 tracking-wide uppercase text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Dlaczego warto wybrać PackSmart?
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Karta 1 */}
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center border-t-4 border-blue-500 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8, boxShadow: '0 8px 32px 0 rgba(59,130,246,0.15)' }}
            >
              <div className="bg-gradient-to-tr from-blue-500 to-blue-300 text-white rounded-full p-4 mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white text-center">Ekspresowa wysyłka</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-2">Wysyłaj paczki 24/7 z dowolnego miejsca. Dostawa nawet w 24h na terenie całego kraju.</p>
            </motion.div>
            {/* Karta 2 */}
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center border-t-4 border-indigo-500 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ y: -8, boxShadow: '0 8px 32px 0 rgba(99,102,241,0.15)' }}
            >
              <div className="bg-gradient-to-tr from-indigo-500 to-blue-400 text-white rounded-full p-4 mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white text-center">Zaawansowane śledzenie</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-2">Monitoruj status przesyłki w czasie rzeczywistym. Powiadomienia SMS i e-mail na każdym etapie.</p>
            </motion.div>
            {/* Karta 3 */}
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 flex flex-col items-center border-t-4 border-green-500 hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -8, boxShadow: '0 8px 32px 0 rgba(34,197,94,0.15)' }}
            >
              <div className="bg-gradient-to-tr from-green-500 to-blue-400 text-white rounded-full p-4 mb-4 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white text-center">Sieć paczkomatów</h3>
              <p className="text-gray-600 dark:text-gray-300 text-center mb-2">Ponad 5000 paczkomatów w całej Polsce. Odbieraj i nadaj paczki wygodnie, blisko domu lub pracy.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50/60 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Dekoracje tła */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-2xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl font-bold text-center mb-2 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Co mówią o nas klienci
          </motion.h2>
          <motion.p
            className="text-blue-600 dark:text-blue-400 text-center font-semibold mb-8 tracking-wide uppercase text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Zaufali nam
          </motion.p>
          <div className="flex justify-center mb-8">
            <blockquote className="max-w-2xl text-center text-xl italic text-gray-700 dark:text-gray-200">
              &quot;Twoja paczka. Twój czas. Twój wybór.&quot;
            </blockquote>
          </div>
          <div className="relative">
            {/* Left arrow */}
            <motion.button
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-700 shadow-md rounded-full p-3 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentTestimonial((prev) => prev === 0 ? testimonials.length - 1 : prev - 1)}
              aria-label="Poprzednia opinia"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </motion.button>
            {/* Testimonials slider */}
            <div className="overflow-hidden mx-16 group" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
              <motion.div
                className="flex"
                animate={{ x: currentTestimonial * -100 + "%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className="min-w-full px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: currentTestimonial === index ? 1 : 0.5 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-10 relative flex flex-col items-center max-w-xl mx-auto border border-blue-100 dark:border-gray-700">
                      {/* Avatar z inicjałami */}
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-300 mb-4 shadow">
                        {testimonial.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      {/* Gwiazdki */}
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-700 dark:text-gray-200 text-lg text-center mb-4 line-clamp-4 group-hover:line-clamp-none transition-all duration-300 cursor-pointer">
                        {testimonial.text}
                      </p>
                      <div className="flex flex-col items-center mt-2">
                        <span className="font-semibold text-blue-700 dark:text-blue-300">{testimonial.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{testimonial.role} &bull; {testimonial.location}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            {/* Right arrow */}
            <motion.button
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-gray-700 shadow-md rounded-full p-3 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-gray-600"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
              aria-label="Następna opinia"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </motion.button>
            {/* Dots navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${currentTestimonial === index ? "bg-blue-600 dark:bg-blue-400" : "bg-gray-300 dark:bg-gray-600"}`}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => setCurrentTestimonial(index)}
                  aria-label={`Pokaż opinię ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map Demo - nowoczesna sekcja */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Dekoracje tła */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-2xl" />
          <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-blue-400/40 rounded-full blur-md" />
          <div className="absolute bottom-1/4 right-1/2 w-4 h-4 bg-indigo-400/30 rounded-full blur-sm" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl font-bold text-center mb-2 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Mapa paczkomatów
          </motion.h2>
          <motion.p
            className="text-blue-600 dark:text-blue-400 text-center font-semibold mb-8 tracking-wide uppercase text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Znajdź najbliższy paczkomat w swojej okolicy
          </motion.p>
          <motion.div
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-blue-100 dark:border-gray-700 p-4 md:p-8 mb-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <EnhancedMap />
          </motion.div>
          <div className="flex justify-center">
            <Button variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg" onClick={() => {}}>
              Znajdź najbliższy paczkomat
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section - nowoczesna wersja */}
      <section className="relative py-20 bg-gradient-to-br from-blue-100 via-white to-indigo-100 dark:from-blue-900 dark:via-gray-900 dark:to-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Ilustracja/animacja */}
          <div className="flex-1 flex justify-center mb-8 md:mb-0">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-200 via-blue-400 to-indigo-300 opacity-30 blur-2xl" />
              <Users className="w-40 h-40 text-blue-500 drop-shadow-xl z-10" />
              {/* Możesz podmienić na SVG/obrazek jeśli chcesz */}
            </div>
          </div>
          {/* Tekst i przyciski */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Dołącz do nas już dziś!</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Ponad <span className="font-bold text-blue-600">1 000 000</span> paczek miesięcznie, <span className="font-bold text-blue-600">5000+</span> paczkomatów, <span className="font-bold text-blue-600">99,8%</span> dostaw na czas.<br />
              Zaufaj liderowi nowoczesnej logistyki!
            </p>
            <div className="flex gap-4 mb-6">
              <Button variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => {}}>Rozpocznij teraz</Button>
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => {}}>Kontakt</Button>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Zaufało nam:</span>
              <img src="/trusted1.svg" alt="Partner" className="h-8" />
              <img src="/trusted2.svg" alt="Partner" className="h-8" />
              <span className="ml-2 text-blue-600 font-semibold">10 000+ klientów</span>
            </div>
          </div>
        </div>
        {/* Dekoracje/confetti/animacja */}
      </section>

      {/* Statystyki - nowoczesna sekcja */}
      <section className="relative py-20 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 dark:text-white">PackSmart w liczbach</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {/* Paczkomaty */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-t-4 border-blue-500 flex flex-col items-center">
              <div className="flex justify-center mb-2">
                <Map className="h-10 w-10 text-blue-500" />
              </div>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                <CountUp end={5000} duration={2} />+
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Paczkomatów w Polsce</p>
            </motion.div>
            {/* Przesyłek */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-t-4 border-indigo-500 flex flex-col items-center">
              <div className="flex justify-center mb-2">
                <Package className="h-10 w-10 text-indigo-500" />
              </div>
              <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                <CountUp end={1000000} duration={2} />+
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Przesyłek miesięcznie</p>
            </motion.div>
            {/* Dostarczonych na czas */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-t-4 border-green-500 flex flex-col items-center">
              <div className="flex justify-center mb-2">
                <Clock className="h-10 w-10 text-green-500" />
              </div>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">
                99,8%
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Dostarczonych na czas</p>
            </motion.div>
            {/* Zadowoleni klienci */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-t-4 border-yellow-400 flex flex-col items-center">
              <div className="flex justify-center mb-2">
                <Star className="h-10 w-10 text-yellow-400" />
              </div>
              <p className="text-4xl font-bold text-yellow-500 dark:text-yellow-400">
                <CountUp end={10000} duration={2} />+
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Zadowolonych klientów</p>
            </motion.div>
          </div>
          {/* Pasek zaufania/logotypy/avatars */}
          <div className="flex justify-center mt-10 gap-6">
            <img src="/trusted1.svg" alt="Partner" className="h-8" />
            <img src="/trusted2.svg" alt="Partner" className="h-8" />
            <img src="/trusted3.svg" alt="Partner" className="h-8" />
          </div>
        </div>
        {/* Dekoracje/mapka/animacja punktów */}
      </section>

      {/* Twórcy aplikacji */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
        {/* Dekoracje tła */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 w-60 h-60 bg-indigo-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-blue-200/20 rounded-full blur-2xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Twórcy aplikacji
          </motion.h2>
          <div className="flex flex-col gap-16">
            {/* Twórca 1 */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <Image src={AdamPIC} alt="Adam Pukaluk" width={192} height={192} className="w-60 h-60 rounded-full object-cover shadow-xl border-4 border-blue-200 dark:border-blue-700" />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 dark:text-white">Adam Pukaluk</h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">Fullstack Developer</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Jeden z twórców aplikacji PackSmart. 10x developer wszystko zrobi we wszystkich językach programowania za odpowiadnią cene. <b className="font-bold text-indigo-600 dark:text-indigo-400 font-semibold">Głosujcie na Mentzena🗿</b></p>
                <div className="flex gap-4 justify-center md:justify-start">
                  <a href="https://github.com/Adam90PL" target="_blank" rel="noopener" className="text-gray-500 hover:text-blue-600"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.606-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
                  <a href="https://www.linkedin.com/in/adam-pukaluk-339058298/" target="_blank" rel="noopener" className="text-gray-500 hover:text-blue-600"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.597 2 3.597 4.59v5.606z"/></svg></a>
                </div>
              </div>
            </motion.div>
            {/* Twórca 2 */}
            <motion.div
              className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Image src={MarceliPIC} alt="Marceli Karman" width={192} height={192} className="w-60 h-60 rounded-full object-cover shadow-xl border-4 border-indigo-200 dark:border-indigo-700" />
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-2xl font-bold mb-2 dark:text-white">Marceli Karman</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">Fullstack Developer</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Jakiś noobek niewiadomo po co tu jest e what a sigma <b className="font-bold text-indigo-600 dark:text-indigo-400 font-semibold">Głosujcie na Mentzena🗿</b></p>
                <div className="flex gap-4 justify-center md:justify-end">
                  <a href="https://github.com/Karman1818/" target="_blank" rel="noopener" className="text-gray-500 hover:text-indigo-600"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.606-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.046.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/></svg></a>
                  <a href="https://www.linkedin.com/in/marceli-karman-9503632b0/" target="_blank" rel="noopener" className="text-gray-500 hover:text-indigo-600"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.597 2 3.597 4.59v5.606z"/></svg></a>
                </div>
              </div>
            </motion.div>
            {/* Twórca 3 */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <Image src={ChatGPT} alt="ChatGPT" width={192} height={192} className="w-60 h-60 rounded-full object-cover shadow-xl border-4 " />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 dark:text-white">ChatGPT</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">AI Assistant</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Twój ulubiony AI, który koduje szybciej niż Ty myślisz. Zna odpowiedź na każde pytanie, nawet jeśli nie istnieje.</p>
              </div>
            </motion.div>
            {/* Twórca 4 */}
            <motion.div
              className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <Image src={CursorIA} alt="CursorAI" width={192} height={192} className="w-60 h-60 rounded-full object-cover shadow-xl border-4" />
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-2xl font-bold mb-2 dark:text-white">CursorAI</h3>
                <p className="text-blue-600 dark:text-blue-400 font-semibold mb-2">AI Pair Programmer</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Zawsze wie, gdzie postawić średnik. Debugowanie to dla niego relaks, a refaktor robi w 3 sekundy.</p>
              </div>
            </motion.div>
            {/* Twórca 5 */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <Image src={CloudeAI} alt="CloudeAI" width={192} height={192} className="w-60 h-60 rounded-full object-cover shadow-xl border-4   " />
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 dark:text-white">CloudeAI</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2">AI Cloud Wizard</p>
                <p className="text-gray-700 dark:text-gray-300 mb-4">Chmura to jego żywioł. Deployuje szybciej niż zdążysz powiedzieć &quot;production&quot;. Zawsze w trybie serverless.</p>
              </div>
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
              <h3 className="text-xl font-semibold mb-4 text-white">
                PackSmart
              </h3>
              <p className="text-gray-400">
                Nowoczesny system paczkomatów dla szybkiej i wygodnej wysyłki.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-200">Informacje</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white"
                  >
                    O nas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white"
                  >
                    Kontakt
                  </Link>
                </li>
                <li>
                  <Link
                    href="/career"
                    className="text-gray-400 hover:text-white"
                  >
                    Kariera
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 text-gray-200">Pomoc</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/support"
                    className="text-gray-400 hover:text-white"
                  >
                    Wsparcie
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white"
                  >
                    Warunki
                  </Link>
                </li>
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
            <p>
              &copy; {new Date().getFullYear()} PackSmart. Wszelkie prawa
              zastrzeżone.
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
