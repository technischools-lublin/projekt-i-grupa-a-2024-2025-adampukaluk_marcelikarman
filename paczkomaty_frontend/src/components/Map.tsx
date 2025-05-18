import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Typ dla lokalizacji paczkomatu
interface LockerLocation {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
}

export default function EnhancedMap() {
  const [locations, setLocations] = useState<LockerLocation[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeLocation, setActiveLocation] = useState<LockerLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fix dla ikon Leaflet w Next.js - wykonujemy tylko po stronie klienta
  useEffect(() => {
    // Customowe ikony dla markerów
    const customIcon = new L.Icon({
      iconUrl: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.2/svgs/solid/location-dot.svg',
      iconRetinaUrl: 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.2/svgs/solid/location-dot.svg',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      shadowUrl: undefined,
      shadowSize: undefined,
    });
    L.Marker.prototype.options.icon = customIcon;
    setMapLoaded(true);
  }, []);

  // Pobierz lokalizacje paczkomatów z backendu
  useEffect(() => {
    async function fetchLocations() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:8000/api/public_parcel_lockers/');
        if (!res.ok) throw new Error('Błąd pobierania lokalizacji');
        const data = await res.json();
        setLocations(data);
      } catch (e) {
        setError('Nie udało się pobrać lokalizacji paczkomatów');
      } finally {
        setLoading(false);
      }
    }
    fetchLocations();
  }, []);

  // Ustawia aktywną lokalizację po kliknięciu w element listy
  const handleLocationClick = (location: LockerLocation) => {
    setActiveLocation(location);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900">
      {/* Panel boczny z listą lokalizacji */}
      <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 overflow-y-auto shadow-lg border-r border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">Mapa Naszych Paczkomatów</h1>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Dostępne lokalizacje:</h2>
        {loading ? (
          <div className="text-gray-500 dark:text-gray-300">Ładowanie lokalizacji...</div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400">{error}</div>
        ) : (
          <div className="space-y-3">
            {locations.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-300">Brak dostępnych paczkomatów</div>
            ) : (
              locations.map((location) => (
                <div
                  key={location.id}
                  className={`p-3 rounded-lg cursor-pointer transition-all border-l-4 ${
                    activeLocation?.id === location.id
                      ? 'bg-blue-100 dark:bg-blue-900 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => handleLocationClick(location)}
                >
                  <h3 className="font-medium text-blue-800 dark:text-blue-300">{location.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{location.location}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="w-full md:w-3/4 h-3/4 md:h-full bg-white dark:bg-gray-800">
        {typeof window !== 'undefined' && mapLoaded && !loading && locations.length > 0 && (
          <MapContainer 
            center={[52.0697, 19.4800]} // Centrum Polski
            zoom={6} 
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {locations.map((location) => (
              <Marker 
                key={location.id} 
                position={[location.latitude, location.longitude] as [number, number]}
              >
                <Popup className="custom-popup">
                  <div className="p-1">
                    <h3 className="font-bold text-lg mb-1 text-blue-700 dark:text-blue-300">{location.name}</h3>
                    <p className="text-gray-700 dark:text-gray-200">{location.location}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}