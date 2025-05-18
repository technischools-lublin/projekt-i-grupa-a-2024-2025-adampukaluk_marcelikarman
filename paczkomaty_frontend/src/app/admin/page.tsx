"use client";
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Package, 
  Search, 
  ChevronDown, 
  RefreshCw,
  Filter,
  Bell,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  status: 'awaiting_pickup' | 'in_transit' | 'delivered' | 'preparing' | string;
  status_display: string;
  sender: number;
  sender_username: string;
  receiver: number;
  receiver_username: string;
  created_at: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  sent_parcels: number[];
  received_parcels: number[];
}

// Status color mapping
const STATUS_COLORS = {
  awaiting_pickup: "bg-yellow-500",
  in_transit: "bg-blue-500",
  delivered: "bg-green-500",
  preparing: "bg-purple-500",
} as const;

// Size display mapping
const SIZE_LABELS = {
  small: "Mały",
  medium: "Średni",
  large: "Duży",
};

const AdminDashboard = () => {
  // State variables
  const [users, setUsers] = useState<User[]>([]);
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'parcels'>('parcels');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isChangeStatusModalOpen, setIsChangeStatusModalOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);


  const router = useRouter()
  // Fetch data on component mount
  useEffect(() => {
    fetchUsers();
    fetchParcels();
  }, []);

  // Fetch users from the API
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/users/", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      const data = await response.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch parcels from the API
  const fetchParcels = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:8000/api/parcels/", {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch parcels");
      }
      
      const data = await response.json();
      setParcels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching parcels:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle user selection
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setActiveTab('parcels');
  };

  // Handle status change
  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcel || !newStatus) return;
    try {
      const response = await fetch(`http://localhost:8000/api/update_status/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          tracking_number: selectedParcel.tracking_number, 
          status: newStatus 
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update parcel status");
      }
      // Po udanej zmianie statusu odśwież paczki
      await fetchParcels();
      setIsChangeStatusModalOpen(false);
    } catch (error) {
      console.error("Error updating parcel status:", error);
    }
  };

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

  // Filter parcels based on selected user and search query
  const filteredParcels = parcels.filter(parcel => {
    const matchesUser = selectedUser 
      ? selectedUser.sent_parcels.includes(parcel.id) || selectedUser.received_parcels.includes(parcel.id)
      : true;
    
    const matchesSearch = searchQuery === "" ||
      parcel.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.parcel_locker_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.sender_username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parcel.receiver_username.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === "" || parcel.status === filterStatus;
    
    return matchesUser && matchesSearch && matchesStatus;
  });

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    searchQuery === "" ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}


      {/* Main content */}
      <div className="container mx-auto px-4 py-6">
        {/* Top controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex space-x-2 items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {activeTab === 'users' 
                  ? 'Zarządzanie użytkownikami' 
                  : selectedUser 
                    ? `Paczki użytkownika: ${selectedUser.username}` 
                    : 'Zarządzanie paczkami'}
              </h2>
              {selectedUser && (
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  (Wyczyść)
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => {fetchUsers(); fetchParcels();}}
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <RefreshCw size={16} className="mr-2" />
                Odśwież dane
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'users' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Users size={16} className="mr-2" />
                Użytkownicy
              </button>
              <button 
                onClick={() => setActiveTab('parcels')}
                className={`flex items-center px-4 py-2 text-sm rounded-lg ${
                  activeTab === 'parcels' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Package size={16} className="mr-2" />
                Paczki
              </button>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={activeTab === 'users' 
                  ? "Szukaj użytkownika po nazwie, emailu..." 
                  : "Szukaj paczki po numerze, paczkomacie, nadawcy..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {activeTab === 'parcels' && (
              <div className="relative">
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <Filter size={16} />
                  <span>Status</span>
                  <ChevronDown size={16} />
                </button>
                
                {isFilterOpen && (
                  <div className="absolute z-10 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                    <div className="py-1">
                      <button
                        onClick={() => {setFilterStatus(""); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        Wszystkie
                      </button>
                      <button
                        onClick={() => {setFilterStatus("awaiting_pickup"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        Oczekuje na odbiór
                      </button>
                      <button
                        onClick={() => {setFilterStatus("in_transit"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        W transporcie
                      </button>
                      <button
                        onClick={() => {setFilterStatus("delivered"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        Dostarczone
                      </button>
                      <button
                        onClick={() => {setFilterStatus("preparing"); setIsFilterOpen(false);}}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      >
                        W przygotowaniu
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
          </div>
        )}

        {/* Tab content */}
        {!isLoading && activeTab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Nazwa użytkownika
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Imię i nazwisko
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Liczba paczek
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        Nie znaleziono użytkowników
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.email || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {(user.first_name || user.last_name) ? `${user.first_name} ${user.last_name}` : "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          Wysłane: {user.sent_parcels.length}, Odebrane: {user.received_parcels.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleUserSelect(user)}
                              className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Zobacz paczki użytkownika"
                            >
                              <Eye size={18} />
                            </button>
                            <button 
                              className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                              title="Edytuj użytkownika"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              title="Usuń użytkownika"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!isLoading && activeTab === 'parcels' && (
          <>
            {filteredParcels.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
                <div className="mx-auto bg-gray-100 dark:bg-gray-700 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                  <Package size={24} className="text-gray-500 dark:text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Brak przesyłek</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {selectedUser 
                    ? `Użytkownik ${selectedUser.username} nie ma żadnych przesyłek spełniających kryteria wyszukiwania.`
                    : "Nie znaleziono przesyłek spełniających kryteria wyszukiwania."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParcels.map((parcel) => (
                  <div key={parcel.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center">
                            <Package size={20} className="mr-2 text-blue-500" />
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              #{parcel.tracking_number}
                            </h3>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(parcel.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
                            STATUS_COLORS[parcel.status as keyof typeof STATUS_COLORS] || "bg-gray-500"
                          }`}
                        >
                          {parcel.status_display || parcel.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Paczkomat</p>
                          <p className="text-sm font-medium dark:text-white">{parcel.parcel_locker_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Skrytka</p>
                          <p className="text-sm font-medium dark:text-white">
                            {parcel.locker_slot_info?.slot_number || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Nadawca</p>
                          <p className="text-sm font-medium dark:text-white">{parcel.sender_username}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Odbiorca</p>
                          <p className="text-sm font-medium dark:text-white">{parcel.receiver_username}</p>
                        </div>
                      </div>

                      <div className="flex items-center pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded-full ${
                            parcel.size === 'small' ? 'bg-gray-300' :
                            parcel.size === 'medium' ? 'bg-gray-400' : 'bg-gray-500'
                          }`}></div>
                          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                            {SIZE_LABELS[parcel.size as keyof typeof SIZE_LABELS] || parcel.size}
                          </span>
                        </div>
                        <button 
                          className="ml-auto px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => {
                            setSelectedParcel(parcel);
                            setNewStatus(parcel.status);
                            setIsChangeStatusModalOpen(true);
                          }}
                        >
                          Zmień status
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Change status modal */}
      {isChangeStatusModalOpen && selectedParcel && (
        <div className="fixed inset-0 bg-[rgba(1,1,1,0.5)] bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Zmień status paczki #{selectedParcel.tracking_number}
              </h3>
              <button 
                onClick={() => setIsChangeStatusModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleStatusChange}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status paczki
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="awaiting_pickup" className="font-sans text-sm text-gray-900 dark:text-white">Oczekuje na odbiór</option>
                  <option value="in_transit" className="font-sans text-sm text-gray-900 dark:text-white">W transporcie</option>
                  <option value="delivered" className="font-sans text-sm text-gray-900 dark:text-white">Dostarczone</option>
                  <option value="preparing" className="font-sans text-sm text-gray-900 dark:text-white">W trakcje przygotowania</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsChangeStatusModalOpen(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Zapisz zmiany
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;