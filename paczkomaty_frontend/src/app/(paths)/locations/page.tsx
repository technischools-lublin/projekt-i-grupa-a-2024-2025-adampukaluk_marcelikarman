"use client"

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamicznie importujemy komponenty react-leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

// Dodaj interfejs na górze pliku
interface ParcelLocker {
  id: number;
  name: string;
  location: string;
  latitude: string;
  longitude: string;
  status: boolean;
  available_slots_by_size: {
    small: number;
    medium: number;
    large: number;
  };
  small_slots: number;
  medium_slots: number;
  large_slots: number;
}

export default function ParcelLockersMap() {
  const [mapReady, setMapReady] = useState(false);
  const [parcelLockers, setParcelLockers] = useState<ParcelLocker[]>([]);
  const [filteredLockers, setFilteredLockers] = useState<ParcelLocker[]>([]);
  const [activeLocker, setActiveLocker] = useState<ParcelLocker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtry
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, available, unavailable
  type LockerSize = 'small' | 'medium' | 'large' | 'any';
  const [filterSize, setFilterSize] = useState<LockerSize>("any"); // any, small, medium, large

  // Pobieranie danych z API
  useEffect(() => {
    const fetchParcelLockers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/api/parcel_lockers/',{credentials: 'include'});
        console.log(response,"niggers");
        if (!response.ok) {
          throw new Error('Nie udało się pobrać danych o paczkomatach');
        }
        const data = await response.json();
        setParcelLockers(data);
        setFilteredLockers(data);
        setLoading(false);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message);
        setLoading(false);
      }
    };

    fetchParcelLockers();
  }, []);

  // Fix dla ikon Leaflet - wykonujemy tylko po stronie klienta
  useEffect(() => {
    let leaflet: typeof import('leaflet');
    if (typeof window !== 'undefined') {
      (async () => {
        leaflet = await import('leaflet');
        // @ts-expect-error: Leaflet CSS import is not typed, but needed for client-side map
        await import('leaflet/dist/leaflet.css');
        // @ts-expect-error: _getIconUrl is not in leaflet types, but is used for icon fix
        delete leaflet.Icon.Default.prototype._getIconUrl;
        leaflet.Icon.Default.mergeOptions({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        setMapReady(true);
      })();
    }
  }, []);

  // Filtrowanie paczkomatów
  useEffect(() => {
    if (parcelLockers.length === 0) return;

    let filtered = [...parcelLockers];
    
    // Filtrowanie po zapytaniu wyszukiwania (nazwa i lokalizacja)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(locker => 
        locker.name.toLowerCase().includes(query) || 
        locker.location.toLowerCase().includes(query)
      );
    }
    
    // Filtrowanie po statusie
    if (filterStatus !== "all") {
      const isAvailable = filterStatus === "available";
      filtered = filtered.filter(locker => locker.status === isAvailable);
    }
    
    // Filtrowanie po dostępnych miejscach o konkretnym rozmiarze
    if (filterSize !== "any") {
      filtered = filtered.filter(locker => 
        locker.available_slots_by_size[filterSize as Exclude<LockerSize, 'any'>] > 0
      );
    }
    
    setFilteredLockers(filtered);
  }, [searchQuery, filterStatus, filterSize, parcelLockers]);

  // Ustawia aktywny paczkomat po kliknięciu w element listy
  const handleLockerClick = (locker: ParcelLocker) => {
    setActiveLocker(locker);
  };

  // Jeśli dane są w trakcie ładowania
  if (loading) {
    return <div className="flex items-center justify-center h-screen dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        <p className="mt-4 text-gray-700">Ładowanie paczkomatów...</p>
      </div>
    </div>;
  }

  // Jeśli wystąpił błąd
  if (error) {
    return <div className="flex items-center justify-center h-screen dark:bg-gray-900">
      <div className="bg-red-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Wystąpił błąd</h2>
        <p className="text-red-600">{error}</p>
        <p className="mt-4 text-gray-700">Sprawdź, czy serwer API jest uruchomiony pod adresem: http://localhost:8000</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Nagłówek z tytułem i filtrami */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mapa Paczkomatów</h1>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              {/* Wyszukiwarka */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Szukaj po nazwie lub lokalizacji..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                />
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
                </span>
              </div>
              {/* Filtr statusu */}
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-40 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              >
                <option value="all" className="font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900">Wszystkie</option>
                <option value="available" className="font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900">Dostępne</option>
                <option value="unavailable" className="font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900">Niedostępne</option>
              </select>
              {/* Filtr rozmiaru */}
              <select
                id="size"
                value={filterSize}
                onChange={(e) => setFilterSize(e.target.value as LockerSize)}
                className="w-full md:w-40 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              >
                <option value="any" className="font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900">Dowolny rozmiar</option>
                <option value="small" className="font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900">Małe</option>
                <option value="medium" className="font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900">Średnie</option>
                <option value="large" className="font-sans text-gray-900 dark:text-white bg-white dark:bg-gray-900">Duże</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-6 flex flex-col md:flex-row gap-6">
        {/* Panel boczny z listą paczkomatów */}
        <div className="w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow p-4 max-h-[70vh] overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Paczkomaty ({filteredLockers.length})
          </h2>
          {filteredLockers.length === 0 ? (
            <p className="text-gray-500 italic text-center py-6">Brak paczkomatów spełniających kryteria</p>
          ) : (
            <div className="space-y-3">
              {filteredLockers.map((locker) => (
                <div
                  key={locker.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all border border-transparent ${
                    activeLocker?.id === locker.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  onClick={() => handleLockerClick(locker)}
                >
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">{locker.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{locker.location}</p>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className={`px-2 py-1 rounded ${locker.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {locker.status ? 'Dostępny' : 'Niedostępny'}
                    </div>
                    <div className="flex space-x-2">
                      <span title="Małe skrytki" className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        S: {locker.available_slots_by_size.small}/{locker.small_slots}
                      </span>
                      <span title="Średnie skrytki" className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        M: {locker.available_slots_by_size.medium}/{locker.medium_slots}
                      </span>
                      <span title="Duże skrytki" className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        L: {locker.available_slots_by_size.large}/{locker.large_slots}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mapa */}
        <div className="w-full md:w-2/3 lg:w-3/4 min-h-[600px] flex-grow rounded-lg overflow-hidden shadow bg-white dark:bg-gray-800">
          {mapReady && (
            <MapContainer
              center={[52.0697, 19.4800]}
              zoom={6}
              style={{ height: '600px', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredLockers.map((locker) => (
                <Marker
                  key={locker.id}
                  position={[parseFloat(locker.latitude), parseFloat(locker.longitude)]}
                >
                  <Popup className="custom-popup">
                    <div className="p-2">
                      <h3 className="font-bold text-lg mb-1">{locker.name}</h3>
                      <p className="text-gray-700 dark:text-gray-200 mb-2">{locker.location}</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                          <span className="block font-semibold">Małe</span>
                          <span>{locker.available_slots_by_size.small}/{locker.small_slots}</span>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                          <span className="block font-semibold">Średnie</span>
                          <span>{locker.available_slots_by_size.medium}/{locker.medium_slots}</span>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded text-center">
                          <span className="block font-semibold">Duże</span>
                          <span>{locker.available_slots_by_size.large}/{locker.large_slots}</span>
                        </div>
                      </div>
                      <div className={`mt-2 text-center py-1 rounded ${locker.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {locker.status ? 'Paczkomat aktywny' : 'Paczkomat nieaktywny'}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}