'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ParcelLocker } from '@/lib/types'
import { fetchWithAuth } from '@/lib/utils'

export default function ParcelForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lockers, setLockers] = useState<ParcelLocker[]>([])
  const [formData, setFormData] = useState({
    tracking_number: '',
    parcel_locker: '',
    size: 'medium',
    receiver: '',
    pickup_code: '',
  })

  useEffect(() => {
    const fetchLockers = async () => {
      try {
        const data = await fetchWithAuth('/parcel_lockers/')
        setLockers(data)
      } catch (err) {
        console.error('Error fetching lockers:', err)
        setError('Nie udało się pobrać listy paczkomatów')
      }
    }

    fetchLockers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetchWithAuth('/parcels/', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      router.push(`/dashboard/parcels/${response.id}`)
    } catch (err: any) {
      setError(err.detail || 'Nie udało się utworzyć przesyłki. Sprawdź poprawność danych.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="tracking_number" className="block text-sm font-medium text-gray-700">
          Numer przesyłki
        </label>
        <input
          type="text"
          id="tracking_number"
          className="input-field mt-1"
          value={formData.tracking_number}
          onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="receiver" className="block text-sm font-medium text-gray-700">
          ID odbiorcy
        </label>
        <input
          type="text"
          id="receiver"
          className="input-field mt-1"
          value={formData.receiver}
          onChange={(e) => setFormData({ ...formData, receiver: e.target.value })}
          required
        />
      </div>

      <div>
        <label htmlFor="parcel_locker" className="block text-sm font-medium text-gray-700">
          Paczkomat docelowy
        </label>
        <select
          id="parcel_locker"
          className="input-field mt-1"
          value={formData.parcel_locker}
          onChange={(e) => setFormData({ ...formData, parcel_locker: e.target.value })}
          required
        >
          <option value="">Wybierz paczkomat</option>
          {lockers.map((locker) => (
            <option key={locker.id} value={locker.id}>
              {locker.name} - {locker.location}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="size" className="block text-sm font-medium text-gray-700">
          Rozmiar paczki
        </label>
        <select
          id="size"
          className="input-field mt-1"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          required
        >
          <option value="small">Mała</option>
          <option value="medium">Średnia</option>
          <option value="large">Duża</option>
        </select>
      </div>

      <div>
        <label htmlFor="pickup_code" className="block text-sm font-medium text-gray-700">
          Kod odbioru
        </label>
        <input
          type="text"
          id="pickup_code"
          className="input-field mt-1"
          value={formData.pickup_code}
          onChange={(e) => setFormData({ ...formData, pickup_code: e.target.value })}
          required
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full"
        disabled={loading}
      >
        {loading ? 'Wysyłanie...' : 'Wyślij paczkę'}
      </button>
    </form>
  )
}
