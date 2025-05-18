"use client"

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { useMapEvents } from 'react-leaflet';

// Dynamically import react-leaflet components
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

// Component to handle map clicks and update position
type LocationMarkerProps = {
  position: [number, number] | null;
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
};
function LocationMarker({ position, setPosition, setAddress }: LocationMarkerProps) {
  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      
      // Reverse geocode the clicked position to get address
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.display_name) {
            setAddress(data.display_name);
          }
        })
        .catch((error) => console.error('Error during reverse geocoding:', error));
      
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position ? <Marker position={position as LatLngExpression} /> : null;
}

export default function CreateParcelLocker() {
  const [mapReady, setMapReady] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [smallSlots, setSmallSlots] = useState('');
  const [mediumSlots, setMediumSlots] = useState('');
  const [largeSlots, setLargeSlots] = useState('');
  const [status, setStatus] = useState(false);
  
  // Ref for form validation
  const formRef = useRef<HTMLFormElement | null>(null);

  // Fix for Leaflet icons - only run on client side
  useEffect(() => {
    let leaflet;
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

  // Function to handle address input and geocode to get coordinates
  const handleAddressChange = (value: string) => {
    setAddress(value);
    
    // Only geocode if we have at least 5 characters in the address
    if (value.length > 5) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const { lat, lon } = data[0];
            setPosition([parseFloat(lat), parseFloat(lon)]);
          }
        })
        .catch((error) => console.error('Error during geocoding:', error));
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!formRef.current || !formRef.current.checkValidity()) {
      formRef.current?.reportValidity();
      return;
    }
    
    if (!position) {
      setError('Proszę wybrać lokalizację na mapie lub wpisać poprawny adres');
      return;
    }

    const parcelLockerData = {
      name,
      location: address,
      latitude: position[0].toString(),
      longitude: position[1].toString(),
      status,
      small_slots: parseInt(smallSlots) || 0,
      medium_slots: parseInt(mediumSlots) || 0,
      large_slots: parseInt(largeSlots) || 0
    };

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/parcel_lockers/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(parcelLockerData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // const data = await response.json();
      setSuccess(true);
      
      // Reset form after successful submission
      setName('');
      setAddress('');
      setPosition(null);
      setSmallSlots('');
      setMediumSlots('');
      setLargeSlots('');
      setStatus(false);
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      const error = err as Error;
      setError(`Błąd podczas tworzenia paczkomatu: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dodaj Nowy Paczkomat</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Wypełnij formularz poniżej, aby utworzyć nowy paczkomat. Możesz podać adres ręcznie lub wybrać lokalizację na mapie.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 pt-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-200 rounded-lg text-green-700">
              <p className="font-medium">Sukces! Paczkomat został utworzony pomyślnie.</p>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-700">
              <p className="font-medium">{error}</p>
              <button 
                className="mt-2 text-sm underline" 
                onClick={() => setError(null)}
              >
                Zamknij
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nazwa paczkomatu *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="np. PAC-Warszawa-01"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adres *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="np. ul. Marszałkowska 10, 00-001 Warszawa"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Wpisz adres lub wybierz lokalizację bezpośrednio na mapie.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="small_slots" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Małe skrytki
                    </label>
                    <input
                      type="number"
                      id="small_slots"
                      name="small_slots"
                      value={smallSlots}
                      onChange={(e) => setSmallSlots(e.target.value)}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="medium_slots" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Średnie skrytki
                    </label>
                    <input
                      type="number"
                      id="medium_slots"
                      name="medium_slots"
                      value={mediumSlots}
                      onChange={(e) => setMediumSlots(e.target.value)}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="large_slots" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Duże skrytki
                    </label>
                    <input
                      type="number"
                      id="large_slots"
                      name="large_slots"
                      value={largeSlots}
                      onChange={(e) => setLargeSlots(e.target.value)}
                      min="0"
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="status"
                    name="status"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="status" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Paczkomat aktywny
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      loading ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Tworzenie...
                      </>
                    ) : (
                      'Dodaj paczkomat'
                    )}
                  </button>
                </div>
              </form>

              {position && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-1">Wybrana lokalizacja:</h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    Szerokość geograficzna: {position[0].toFixed(6)}<br />
                    Długość geograficzna: {position[1].toFixed(6)}
                  </p>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="h-96 lg:h-auto rounded-lg overflow-hidden shadow border border-gray-200 dark:border-gray-700">
              {mapReady ? (
                <MapContainer
                  center={position || [52.2297, 21.0122]} // Default: Warsaw
                  zoom={position ? 13 : 6}
                  style={{ height: '100%', width: '100%', minHeight: '400px' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker 
                    position={position}
                    setPosition={setPosition}
                    setAddress={setAddress}
                  />
                </MapContainer>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Ładowanie mapy...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}