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
  const [packageCount, setPackageCount] = useState(0);
  const [packomatCount, setPackomatCount] = useState(0);
  const [deliveryRate, setDeliveryRate] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isBusinessPricing, setIsBusinessPricing] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<null | number>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Refs for scroll animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  // Parallax effect
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  // Features carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    if (!isLoading && statsVisible) {
      // Number animation for paczkomats from 1 to 5000+
      const packomatInterval = setInterval(() => {
        setPackomatCount((prev) => {
          if (prev < 5000) return prev + 50;
          clearInterval(packomatInterval);
          return 5000;
        });
      }, 15);

      // Number animation for packages from 1 to 1M+
      const packageInterval = setInterval(() => {
        setPackageCount((prev) => {
          if (prev < 1000000) return prev + 10000;
          clearInterval(packageInterval);
          return 1000000;
        });
      }, 10);

      // Percentage animation from 0 to 99.8%
      const deliveryInterval = setInterval(() => {
        setDeliveryRate((prev) => {
          if (prev < 99.8) return parseFloat((prev + 1).toFixed(1));
          clearInterval(deliveryInterval);
          return 99.8;
        });
      }, 30);

      return () => {
        clearInterval(packomatInterval);
        clearInterval(packageInterval);
        clearInterval(deliveryInterval);
      };
    }
  }, [isLoading, statsVisible]);

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
              className={`bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative ${
                activeFeature === 0 ? "ring-2 ring-blue-500" : ""
              }`}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center dark:text-white">
                Szybka wysyłka
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Wysyłaj paczki w dowolnym momencie, 24/7. Dostarczamy w ciągu 48
                godzin na terenie całego kraju.
              </p>
              <motion.div className="w-full h-1 bg-gray-200 dark:bg-gray-600 mt-4 rounded-full overflow-hidden">
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
              className={`bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative ${
                activeFeature === 1 ? "ring-2 ring-blue-500" : ""
              }`}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center dark:text-white">
                Śledzenie przesyłek
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Monitoruj status swojej przesyłki w czasie rzeczywistym.
                Otrzymuj powiadomienia SMS lub e-mail.
              </p>
              <motion.div className="w-full h-1 bg-gray-200 dark:bg-gray-600 mt-4 rounded-full overflow-hidden">
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
              className={`bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative ${
                activeFeature === 2 ? "ring-2 ring-blue-500" : ""
              }`}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center dark:text-white">
                Sieć paczkomatów
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Dostęp do szerokiej sieci paczkomatów w całym kraju. Zawsze
                znajdziesz paczkomat blisko Ciebie.
              </p>
              <motion.div className="w-full h-1 bg-gray-200 dark:bg-gray-600 mt-4 rounded-full overflow-hidden">
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

      {/* Interactive Map Demo */}
      <section className="py-16 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <EnhancedMap />
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
                Rozpocznij korzystanie z naszego systemu paczkomatów i ciesz się
                szybką, bezpieczną dostawą.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Link href="/register">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
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
                  setStatsVisible(true);
                  observer.disconnect();
                }
              },
              { threshold: 0.1 }
            );
            observer.observe(el);
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
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Paczkomatów w Polsce
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {(packageCount / 1000000).toFixed(1)} mln+
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Przesyłek miesięcznie
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {deliveryRate.toFixed(1)}%
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Dostarczonych na czas
              </p>
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
