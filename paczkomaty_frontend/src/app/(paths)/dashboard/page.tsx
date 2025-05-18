"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Send,
  ShoppingBag,
  Plus,
  Filter,
  ChevronDown,
  Search,
} from "lucide-react";
import { ParcelPickupModal } from "@/components/ParcelPickupModal";

interface LockerSlotInfo {
  id: number;
  parcel_locker: number;
  slot_number: string;
  size: "small" | "medium" | "large";
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
  size: "small" | "medium" | "large";
  status: "awaiting_pickup" | "in_transit" | "delivered" | "preparing" | string;
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
  available_slots_by_size: {
    small: number;
    medium: number;
    large: number;
  };
}

interface User {
  id: number;
  username: string;
}

const STATUS_COLORS = {
  awaiting_pickup: "bg-yellow-500",
  in_transit: "bg-blue-500",
  delivered: "bg-green-500",
  preparing: "bg-purple-500",
} as const;

const STATUS_LABELS = {
  awaiting_pickup: "Oczekuje na odbiór",
  in_transit: "W transporcie",
  delivered: "Dostarczona",
  preparing: "W trakcie przygotowania",
} as const;

const SIZE_ICONS = {
  small: <div className="w-4 h-4 bg-gray-300 rounded-full"></div>,
  medium: <div className="w-5 h-5 bg-gray-400 rounded-full"></div>,
  large: <div className="w-6 h-6 bg-gray-500 rounded-full"></div>,
};

const SIZE_LABELS = {
  small: "Mały",
  medium: "Średni",
  large: "Duży",
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

// Komponent modalny do odbioru paczki


// Główny komponent dashboard
export default function DashboardPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "in_transit" | "received" | "awaiting_pickup" | "preparing">(
    "all"
  );
  const [isNewParcelModalOpen, setIsNewParcelModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [pickupModalTracking, setPickupModalTracking] = useState<string | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<any | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchParcels = async () => {
      try {
        console.log("Fetching parcels data from API");
        const response = await fetch("http://localhost:8000/api/parcels", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        console.log("API response status:", response.status);

        if (!response.ok) {
          if (response.status === 401) {
            console.error("Authentication error (401)");
            throw new Error("Brak autoryzacji. Zaloguj się ponownie.");
          }
          // Parse the error response
          const errorData = await response.json();
          console.error("Error response:", errorData);
          // Check for non_field_errors specifically for the "no available slots" error
          if (
            errorData.non_field_errors &&
            Array.isArray(errorData.non_field_errors)
          ) {
            const noSlotsError = errorData.non_field_errors.find(
              (err) =>
                err.includes("No available slots of size") ||
                err.includes("in the selected locker")
            );
            if (noSlotsError) {
              throw new Error(
                `Brak dostępnych skrytek o wybranym rozmiarze w wybranym paczkomacie.`
              );
            }
          }
          throw new Error("Nie udało się pobrać danych");
        }

        const data = await response.json();
        console.log("Received parcels data:", data.length, "items");
        setParcels(data);
        setError(null);
      } catch (error: any) {
        if (error.name === "AbortError") return;
        console.error("Error fetching parcels:", error);
        setError(
          error.message || "Nie udało się załadować danych. Spróbuj ponownie."
        );
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
  const filteredParcels = parcels.filter((parcel) => {
    // Najpierw filtrujemy po wyszukiwaniu
    const matchesSearch =
      searchQuery === "" ||
      parcel.tracking_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      parcel.parcel_locker_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      parcel.sender_username
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      parcel.receiver_username
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Następnie filtrujemy po zakładce
    switch (activeTab) {
      case "in_transit":
        return parcel.status === "in_transit";
      case "preparing":
        return parcel.status === "preparing";
      case "received":
        return parcel.status === "delivered";
      case "awaiting_pickup":
        return parcel.status === "awaiting_pickup";
      case "all":
      default:
        return true;
    }
  });

  // Sortowanie paczek - najnowsze na górze
  const sortedParcels = [...filteredParcels].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
        <p className="text-gray-500 mb-6">
          Nie masz jeszcze żadnych przesyłek. Kliknij przycisk poniżej, aby
          nadać pierwszą.
        </p>
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
  const NewParcelModal = ({ setIsNewParcelModalOpen, setParcels }) => {
    const [parcelLockers, setParcelLockers] = useState<ParcelLocker[]>([]); // Add proper typing
    const [users, setUsers] = useState<User[]>([]); // Add proper typing
    const [formData, setFormData] = useState({
      tracking_number: "",
      parcel_locker: "",
      size: "small",
      receiver: "",
      pickup_code: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState("idle"); // 'idle', 'checking', 'inserting', 'success'
    const [selectedLockerInfo, setSelectedLockerInfo] =
      useState<ParcelLocker | null>(null);

    useEffect(() => {
      // Pobierz listę paczkomatów
      fetch("http://localhost:8000/api/parcel_lockers/", {
        credentials: "include"
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Raw parcel lockers data:", data);
          // 
          if (Array.isArray(data)) {
            setParcelLockers(data);
            console.log("Dostępne paczkomaty:", data);
          } else {
            // If data is not an array, check if it has results property that is an array
            if (data && Array.isArray(data.results)) {
              setParcelLockers(data.results);
              console.log("Dostępne paczkomaty (from results):", data.results);
            } else {
              console.error("Expected array but got:", typeof data, data);
              setError(
                "Błąd pobierania paczkomatów. Otrzymano nieprawidłowy format danych."
              );
              setParcelLockers([]); // Initialize as empty array to prevent map errors
            }
          }
        })
        .catch((err) => {
          console.error("Error fetching lockers:", err);
          setError("Nie udało się pobrać listy paczkomatów");
          setParcelLockers([]); // Initialize as empty array to prevent map errors
        });

      // Pobierz listę użytkowników
      fetch("http://localhost:8000/api/users/", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          // Ensure data is an array before setting it
          if (Array.isArray(data)) {
            setUsers(data);
          } else if (data && Array.isArray(data.results)) {
            setUsers(data.results);
          } else {
            console.error("Expected users array but got:", typeof data, data);
            setUsers([]); // Initialize as empty array to prevent map errors
          }
        })
        .catch((err) => {
          console.error("Error fetching users:", err);
          setUsers([]); // Initialize as empty array to prevent map errors
        });
    }, []);

    // Sprawdzaj dostępność slotów przy zmianie paczkomatu lub rozmiaru
    useEffect(() => {
      if (formData.parcel_locker) {
        const selectedLocker = parcelLockers.find(
          (locker) => locker.id === parseInt(formData.parcel_locker)
        );
        setSelectedLockerInfo(selectedLocker || null);
      }
    }, [formData.parcel_locker, parcelLockers]);

    const checkAvailability = () => {
      if (!formData.parcel_locker || !formData.size) {
        setError("Wybierz paczkomat i rozmiar paczki");
        return false;
      }

      const selectedLocker = parcelLockers.find(
        (locker) => locker.id === parseInt(formData.parcel_locker)
      );

      if (!selectedLocker) {
        setError("Nie znaleziono wybranego paczkomatu");
        return false;
      }

      // Safely check if available_slots_by_size exists and has the size property
      if (
        !selectedLocker.available_slots_by_size ||
        typeof selectedLocker.available_slots_by_size !== "object" ||
        !(formData.size in selectedLocker.available_slots_by_size)
      ) {
        setError(
          `Brak informacji o dostępnych skrytkach rozmiaru ${formData.size} w wybranym paczkomacie.`
        );
        return false;
      }

      const availableSlots =
        selectedLocker.available_slots_by_size[
          formData.size as keyof typeof selectedLocker.available_slots_by_size
        ];

      if (availableSlots <= 0) {
        setError(
          `Brak dostępnych skrytek rozmiaru ${formData.size} w wybranym paczkomacie.`
        );
        return false;
      }

      return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setStatus("checking");

      // Sprawdź dostępność
      if (!checkAvailability()) {
        setStatus("idle");
        return;
      }

      // Przejdź do animacji wkładania paczki
      setStatus("inserting");
      setIsSubmitting(true);

      // Po 5 sekundach wyślij rzeczywiste żądanie
      setTimeout(async () => {
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
              status: "awaiting_pickup",
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Error response:", errorData);

            if (
              errorData.non_field_errors &&
              Array.isArray(errorData.non_field_errors)
            ) {
              const noSlotsError = errorData.non_field_errors.find(
                (err: string) =>
                  err.includes("No available slots of size") ||
                  err.includes("in the selected locker")
              );
              if (noSlotsError) {
                throw new Error(
                  "Brak dostępnych skrytek o wybranym rozmiarze w wybranym paczkomacie."
                );
              }
            }
            throw new Error("Nie udało się nadać paczki");
          }

          const newParcel = await response.json();
          setParcels((prev: Parcel[]) => [newParcel, ...prev]);
          setStatus("success");
          setShowThankYou(true);

          // Zamknij modal po 2 sekundach od pokazania komunikatu sukcesu
          setTimeout(() => {
            setShowThankYou(false);
            setIsNewParcelModalOpen(false);
          }, 2000);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Wystąpił nieznany błąd"
          );
          setStatus("idle");
        } finally {
          setIsSubmitting(false);
        }
      }, 5000);
    };

    // Renderuj odpowiednią zawartość w zależności od statusu
    const renderContent = () => {
      if (showThankYou) {
        return (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
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
            <h3 className="text-xl font-medium text-gray-800 dark:text-white mb-2">
              Dziękujemy za nadanie paczki!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              Paczka została pomyślnie nadana i czeka na odbiór.
            </p>
          </div>
        );
      }
      switch (status) {
        case "inserting":
          return (
            <div className="flex flex-col items-center justify-center py-10">
              <motion.div
                animate={{ y: [ -10, 10, -10 ] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-24 h-24 bg-blue-500 rounded-lg shadow-lg flex items-center justify-center mb-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
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
              <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
                Umieszczanie paczki w paczkomacie...
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Proszę czekać, trwa przygotowanie paczki.
              </p>
            </div>
          );
        case "success":
          // Nie pokazuj już starego success, bo mamy showThankYou
          return null;
        default:
          return (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">
                  Numer przesyłki
                </label>
                <input
                  type="text"
                  value={formData.tracking_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tracking_number: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans text-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">
                  Paczkomat
                </label>
                <select
                  value={formData.parcel_locker}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      parcel_locker: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans text-base"
                  required
                >
                  <option
                    value=""
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans"
                  >
                    Wybierz paczkomat
                  </option>
                  {Array.isArray(parcelLockers) &&
                    parcelLockers.map((locker) => (
                      <option
                        key={locker.id}
                        value={locker.id}
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans"
                      >
                        {locker.name} - {locker.location}
                        {locker.available_slots_by_size
                          ? ` (S:${
                              locker.available_slots_by_size.small || 0
                            }, M:${
                              locker.available_slots_by_size.medium || 0
                            }, L:${locker.available_slots_by_size.large || 0})`
                          : ""}
                      </option>
                    ))}
                </select>
              </div>

              {selectedLockerInfo &&
                selectedLockerInfo.available_slots_by_size && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Dostępne sloty: Małe:{" "}
                      {selectedLockerInfo.available_slots_by_size.small || 0},
                      Średnie:{" "}
                      {selectedLockerInfo.available_slots_by_size.medium || 0},
                      Duże:{" "}
                      {selectedLockerInfo.available_slots_by_size.large || 0}
                    </p>
                  </div>
                )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">
                  Rozmiar paczki
                </label>
                <select
                  value={formData.size}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, size: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans text-base"
                  required
                >
                  <option
                    value="small"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans"
                  >
                    Mały
                  </option>
                  <option
                    value="medium"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans"
                  >
                    Średni
                  </option>
                  <option
                    value="large"
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans"
                  >
                    Duży
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">
                  Odbiorca
                </label>
                <select
                  value={formData.receiver}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      receiver: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option
                    value=""
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans"
                  >
                    Wybierz odbiorcę
                  </option>
                  {Array.isArray(users) &&
                    users.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                        className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans"
                      >
                        {user.username}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">
                  Kod odbioru
                </label>
                <input
                  type="text"
                  value={formData.pickup_code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pickup_code: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsNewParcelModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  disabled={isSubmitting}
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-sans"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Nadawanie..." : "Nadaj paczkę"}
                </button>
              </div>
            </form>
          );
      }
    };

    return (
      <div className="fixed inset-0 bg-[rgba(1,1,1,0.5)] bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 font-sans"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {status === "success" ? "Paczka nadana" : "Nadaj nową paczkę"}
            </h2>
            {status !== "inserting" && (
              <button
                onClick={() => setIsNewParcelModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {renderContent()}
        </motion.div>
      </div>
    );
  };

  // Fetch and show details modal
  const handleShowDetails = async (parcelId: number) => {
    setDetailsLoading(true);
    setDetailsError(null);
    setIsDetailsModalOpen(true);
    try {
      const res = await fetch(`http://localhost:8000/api/parcels/${parcelId}/`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        throw new Error("Nie udało się pobrać szczegółów paczki");
      }
      const data = await res.json();
      setSelectedParcel(data);
    } catch (e: any) {
      setDetailsError(e.message || "Błąd ładowania szczegółów");
      setSelectedParcel(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  // Komponent karty paczki
  const ParcelCard = ({ parcel, onPickup }: { parcel: Parcel, onPickup: (trackingNumber: string) => void }) => (
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
            {parcel.status === "in_transit" ? (
              <Send className="mr-3 text-blue-500" size={20} />
            ) : parcel.status === "delivered" ? (
              <ShoppingBag className="mr-3 text-green-500" size={20} />
            ) : parcel.status === "preparing" ? (
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-3"></div>
            ) : (
              <Package className="mr-3 text-yellow-500" size={20} />
            )}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                #{parcel.tracking_number}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(parcel.created_at).toLocaleDateString("pl-PL")}
              </p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
              STATUS_COLORS[parcel.status as keyof typeof STATUS_COLORS] ||
              "bg-gray-500"
            }`}
          >
            {STATUS_LABELS[parcel.status as keyof typeof STATUS_LABELS] ||
              parcel.status_display}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Paczkomat</p>
            <p className="text-sm font-medium">{parcel.parcel_locker_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Skrytka</p>
            <p className="text-sm font-medium">
              {parcel.locker_slot_info?.slot_number || "—"}
            </p>
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
          {parcel.status === "awaiting_pickup" ? (
            <button
              className="ml-auto px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => onPickup(parcel.tracking_number)}
            >
              Odbierz paczkę
            </button>
          ) : (
            <button
              className="ml-auto px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
              onClick={() => handleShowDetails(parcel.id)}
            >
              Szczegóły
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) return renderLoading();
  if (error) return renderError();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
      {/* Nagłówek z tytułem i przyciskiem dodawania */}
      <div className=" bg-white dark:bg-gray-800 shadow-sm ">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Twoje przesyłki
            </h1>
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
            onClick={() => setActiveTab("all")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "all"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Wszystkie
          </button>
          <button
            onClick={() => setActiveTab("in_transit")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "in_transit"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            W transporcie
          </button>
          <button
            onClick={() => setActiveTab("preparing")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "preparing"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            W trakcie przygotowania
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "received"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Dostarczone
          </button>
          <button
            onClick={() => setActiveTab("awaiting_pickup")}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === "awaiting_pickup"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Oczekuje na odbiór
          </button>
        </div>

        {/* Zawartość - lista paczek */}
        {sortedParcels.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {sortedParcels.map((parcel) => (
                <ParcelCard key={parcel.id} parcel={parcel} onPickup={setPickupModalTracking} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal do dodawania nowej paczki */}
      <AnimatePresence>
        {isNewParcelModalOpen && (
          <NewParcelModal
            setIsNewParcelModalOpen={setIsNewParcelModalOpen}
            setParcels={setParcels}
          />
        )}
      </AnimatePresence>
      {/* Modal do odbioru paczki */}
      {pickupModalTracking && (
        <ParcelPickupModal trackingNumber={pickupModalTracking} onClose={() => setPickupModalTracking(null)} />
      )}
      {/* Modal do szczegółów paczki */}
      <AnimatePresence>
        {isDetailsModalOpen && (
          <div className="fixed inset-0 bg-[rgba(1,1,1,0.5)] bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6 font-sans relative"
            >
              <button
                onClick={() => { setIsDetailsModalOpen(false); setSelectedParcel(null); }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-2xl"
                aria-label="Zamknij"
              >
                ✕
              </button>
              {detailsLoading ? (
                <div className="text-center py-8 text-lg">Ładowanie...</div>
              ) : detailsError ? (
                <div className="text-center py-8 text-red-500">{detailsError}</div>
              ) : selectedParcel ? (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold mb-2">Szczegóły przesyłki</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Informacje podstawowe</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between"><dt className="text-gray-500">Numer przesyłki:</dt><dd className="font-medium">{selectedParcel.tracking_number}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Status:</dt><dd>{selectedParcel.status_display || selectedParcel.status}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Rozmiar:</dt><dd>{selectedParcel.size}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Data utworzenia:</dt><dd>{new Date(selectedParcel.created_at).toLocaleString()}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Nadawca:</dt><dd>{selectedParcel.sender_username}</dd></div>
                        <div className="flex justify-between"><dt className="text-gray-500">Odbiorca:</dt><dd>{selectedParcel.receiver_username}</dd></div>
                      </dl>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-3">Lokalizacja</h3>
                      <dl className="space-y-2">
                        <div className="flex justify-between"><dt className="text-gray-500">Paczkomat:</dt><dd>{selectedParcel.parcel_locker_name || `ID: ${selectedParcel.parcel_locker}`}</dd></div>
                        {selectedParcel.locker_slot_info && (
                          <div className="flex justify-between"><dt className="text-gray-500">Skrytka:</dt><dd>{selectedParcel.locker_slot_info.slot_number}</dd></div>
                        )}
                      </dl>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-3">Historia przesyłki</h3>
                    {selectedParcel.history && selectedParcel.history.length > 0 ? (
                      <div className="space-y-2">
                        {selectedParcel.history.map((event: any) => (
                          <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-1">
                            <div className="font-medium">{event.event_type_display || event.event_type}</div>
                            <div className="text-sm text-gray-500">{new Date(event.event_time).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500">Brak historii dla tej przesyłki</div>
                    )}
                  </div>
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
