"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Send, ShoppingBag, Plus, Filter, ChevronDown, Search } from "lucide-react";

interface LockerSlotInfo {
  id: number;
  parcel_locker: number;
  slot_number: string;
  size: 'small' | 'medium' | 'large';
  is_occupied: boolean;
  last_updated: string;
}

interface Parcel {
  id: number;
  tracking_number: string;
  parcel_locker: number;
  parcel_locker_name: string;
  locker_slot: number;
  locker_slot_info: LockerSlotInfo;
  size: 'small' | 'medium' | 'large';
  status: 'awaiting_pickup' | 'in_transit' | 'delivered' | string;
  status_display: string;
  sender: number;
  sender_username: string;
  receiver: number;
  receiver_username: string;
  created_at: string;
}

interface ParcelLocker {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  status: boolean;
  number_of_slots: number;
  created_at: string;
}

interface User {
  id: number;
  username: string;
}

const STATUS_COLORS = {
  awaiting_pickup: 'bg-yellow-500',
  in_transit: 'bg-blue-500',
  delivered: 'bg-green-500',
} as const;

const STATUS_LABELS = {
  awaiting_pickup: 'Oczekuje na odbiór',
  in_transit: 'W transporcie',
  delivered: 'Dostarczona',
} as const;

const SIZE_ICONS = {
  small: <div className="w-4 h-4 bg-gray-300 rounded-full"></div>,
  medium: <div className="w-5 h-5 bg-gray-400 rounded-full"></div>,
  large: <div className="w-6 h-6 bg-gray-500 rounded-full"></div>
};

const SIZE_LABELS = {
  small: "Mały",
  medium: "Średni",
  large: "Duży"
};

// Komponent do wyświetlania pustego stanu dla sekcji
const EmptySectionState = ({ message }: { message: string }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
    <div className="flex justify-center mb-4">
      <Package size={40} className="text-gray-400" />
    </div>
    <p className="text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);

// Komponent karty paczki
const ParcelCard = ({ parcel }: { parcel: Parcel }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
  >
    <div className="p-5">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {parcel.status === 'in_transit' ? (
            <Send className="mr-3 text-blue-500" size={20} />
          ) : parcel.status === 'delivered' ? (
            <ShoppingBag className="mr-3 text-green-500" size={20} />
          ) : (
            <Package className="mr-3 text-yellow-500" size={20} />
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              #{parcel.tracking_number}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(parcel.created_at).toLocaleDateString('pl-PL')}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
          STATUS_COLORS[parcel.status as keyof typeof STATUS_COLORS] || 'bg-gray-500'
        }`}>
          {STATUS_LABELS[parcel.status as keyof typeof STATUS_LABELS] || parcel.status_display}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Paczkomat</p>
          <p className="text-sm font-medium">{parcel.parcel_locker_name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Skrytka</p>
          <p className="text-sm font-medium">{parcel.locker_slot_info?.slot_number || "—"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Nadawca</p>
          <p className="text-sm font-medium">{parcel.sender_username}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Odbiorca</p>
          <p className="text-sm font-medium">{parcel.receiver_username}</p>
        </div>
      </div>
      
      <div className="flex items-center pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          {SIZE_ICONS[parcel.size as keyof typeof SIZE_ICONS]}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            {SIZE_LABELS[parcel.size as keyof typeof SIZE_LABELS]}
          </span>
        </div>
        <button className="ml-auto px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors">
          Szczegóły
        </button>
      </div>
    </div>
  </motion.div>
);

// Główny komponent dashboard
export default function DashboardPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'received'>('all');
  const [isNewParcelModalOpen, setIsNewParcelModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchParcels = async () => {
      try {
        console.log('Fetching parcels data from API');
        const response = await fetch("http://localhost:8000/api/parcels", {
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          signal: controller.signal
        });

        console.log('API response status:', response.status);
        
        if (!response.ok) {
          if (response.status === 401) {
            console.error('Authentication error (401)');
            throw new Error('Brak autoryzacji. Zaloguj się ponownie.');
          }
          throw new Error('Nie udało się pobrać danych');
        }

        const data = await response.json();
        console.log('Received parcels data:', data.length, 'items');
        setParcels(data);
        setError(null);
      } catch (error: any) {
        if (error.name === 'AbortError') return;
        console.error('Error fetching parcels:', error);
        setError('Nie udało się załadować danych. Spróbuj ponownie.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcels();

    return () => {
      controller.abort();
    };
  }, []);

  // Filtrowanie paczek w zależności od aktywnej zakładki
  const filteredParcels = parcels.filter(parcel => {
    // Najpierw filtrujemy po wyszukiwaniu
    const matchesSearch = searchQuery === "" || 
      parcel.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.parcel_locker_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.sender_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.receiver_username.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Następnie filtrujemy po zakładce
    switch (activeTab) {
      case 'sent':
        return parcel.status === 'awaiting_pickup' || parcel.status === 'in_transit';
      case 'received':
        return parcel.status === 'delivered';
      case 'all':
      default:
        return true;
    }
  });

  // Sortowanie paczek - najnowsze na górze
  const sortedParcels = [...filteredParcels].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Komponenty stanu
  const renderLoading = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
    </div>
  );

  const renderError = () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500 text-center">
        <p className="text-xl font-semibold mb-2">Błąd</p>
        <p>{error}</p>
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex items-center justify-center p-16">
      <div className="text-center max-w-md">
        <div className="mx-auto bg-gray-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
          <Package size={24} className="text-gray-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Brak przesyłek</h2>
        <p className="text-gray-500 mb-6">Nie masz jeszcze żadnych przesyłek. Kliknij przycisk poniżej, aby nadać pierwszą.</p>
        <button 
          onClick={() => setIsNewParcelModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center mx-auto"
        >
          <Plus size={18} className="mr-2" />
          Nadaj paczkę
        </button>
      </div>
    </div>
  );

  // Modal do dodawania nowej paczki
  const NewParcelModal = () => {
    const [parcelLockers, setParcelLockers] = useState<ParcelLocker[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [formData, setFormData] = useState({
      tracking_number: "",
      parcel_locker: "",
      size: "small",
      receiver: "",
      pickup_code: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      // Pobierz listę paczkomatów
      fetch("http://localhost:8000/api/parcel_lockers/", {
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => setParcelLockers(data))
        .catch(err => console.error("Error fetching lockers:", err));

      // Pobierz listę użytkowników
      fetch("http://localhost:8000/api/users/", {
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error("Error fetching users:", err));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await fetch("http://localhost:8000/api/parcels/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ...formData,
            parcel_locker: parseInt(formData.parcel_locker),
            receiver: parseInt(formData.receiver),
            status: "awaiting_pickup"
          }),
        });

        if (!response.ok) {
          throw new Error("Nie udało się nadać paczki");
        }

        const newParcel = await response.json();
        setParcels(prev => [newParcel, ...prev]);
        setIsNewParcelModalOpen(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-[rgba(1,1,1,0.5)] bg-opacity-50 flex items-center justify-center z-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Nadaj nową paczkę</h2>
            <button 
              onClick={() => setIsNewParcelModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Numer przesyłki
              </label>
              <input
                type="text"
                value={formData.tracking_number}
                onChange={(e) => setFormData(prev => ({ ...prev, tracking_number: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Paczkomat
              </label>
              <select
                value={formData.parcel_locker}
                onChange={(e) => setFormData(prev => ({ ...prev, parcel_locker: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Wybierz paczkomat</option>
                {parcelLockers.map(locker => (
                  <option key={locker.id} value={locker.id}>
                    {locker.name} - {locker.location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rozmiar paczki
              </label>
              <select
                value={formData.size}
                onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="small">Mały</option>
                <option value="medium">Średni</option>
                <option value="large">Duży</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Odbiorca
              </label>
              <select
                value={formData.receiver}
                onChange={(e) => setFormData(prev => ({ ...prev, receiver: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Wybierz odbiorcę</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kod odbioru
              </label>
              <input
                type="text"
                value={formData.pickup_code}
                onChange={(e) => setFormData(prev => ({ ...prev, pickup_code: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button 
                type="button"
                onClick={() => setIsNewParcelModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Anuluj
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Nadawanie..." : "Nadaj paczkę"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  if (isLoading) return renderLoading();
  if (error) return renderError();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Nagłówek z tytułem i przyciskiem dodawania */}
      <div className=" bg-white dark:bg-gray-800 shadow-sm ">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Twoje przesyłki</h1>
            <button 
              onClick={() => setIsNewParcelModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus size={18} className="mr-2" />
              Nadaj paczkę
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-6">
        {/* Filtrowanie i wyszukiwanie */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6 p-4">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Szukaj po numerze, paczkomacie, nadawcy..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <Filter size={16} />
                <span>Filtry</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Zakładki */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'all'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Wszystkie
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'sent'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            W trakcie
          </button>
          <button
            onClick={() => setActiveTab('received')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'received'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Dostarczone
          </button>
        </div>
        
        {/* Zawartość - lista paczek */}
        {sortedParcels.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sortedParcels.map(parcel => (
                <ParcelCard key={parcel.id} parcel={parcel} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Modal do dodawania nowej paczki */}
      <AnimatePresence>
        {isNewParcelModalOpen && <NewParcelModal />}
      </AnimatePresence>
    </div>
  );
}