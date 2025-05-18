'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

interface SendParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newParcel: any) => void;
}

export default function SendParcelModal({ isOpen, onClose, onSuccess }: SendParcelModalProps) {
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
        const errorData = await response.json();
        
        // Check for non_field_errors
        if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
          throw new Error(errorData.non_field_errors[0]);
        } else if (errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          throw new Error("Brak dostępnych schowek o tej wielkości");
        }
      }

      const newParcel = await response.json();
      onSuccess(newParcel);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił nieznany błąd");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(1,1,1,0.5)] bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 font-sans"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white font-sans">Nadaj nową paczkę</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        
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
              onChange={(e) => setFormData(prev => ({ ...prev, tracking_number: e.target.value }))}
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
              onChange={(e) => setFormData(prev => ({ ...prev, parcel_locker: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans text-base"
              required
            >
              <option value="" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans">Wybierz paczkomat</option>
              {parcelLockers.map(locker => (
                <option key={locker.id} value={locker.id} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans">
                  {locker.name} - {locker.location}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">
              Rozmiar paczki
            </label>
            <select
              value={formData.size}
              onChange={(e) => setFormData(prev => ({ ...prev, size: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans text-base"
              required
            >
              <option value="small" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans">Mały</option>
              <option value="medium" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans">Średni</option>
              <option value="large" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans">Duży</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-sans">
              Odbiorca
            </label>
            <select
              value={formData.receiver}
              onChange={(e) => setFormData(prev => ({ ...prev, receiver: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="" className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans">Wybierz odbiorcę</option>
              {users.map(user => (
                <option key={user.id} value={user.id} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-sans">
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
              onChange={(e) => setFormData(prev => ({ ...prev, pickup_code: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-sans"
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
      </motion.div>
    </div>
  );
}
