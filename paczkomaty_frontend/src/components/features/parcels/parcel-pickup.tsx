'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithAuth } from '@/lib/utils'

interface ParcelPickupProps {
  parcelId: number
}

export default function ParcelPickup({ parcelId }: ParcelPickupProps) {
  const router = useRouter()
  const [pickupCode, setPickupCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const response = await fetchWithAuth(`/parcels/${parcelId}/pickup/`, {
        method: 'POST',
        body: JSON.stringify({ pickup_code: pickupCode }),
      })

      setSuccess(true)
      setPickupCode('')
      
      // Refresh the page after successful pickup
      setTimeout(() => {
        router.refresh()
      }, 2000)
    } catch (err: any) {
      setError(err.detail || 'Nie udało się odebrać paczki. Sprawdź poprawność kodu odbioru.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Odbierz paczkę</h2>
      
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm mb-4">
          Paczka została odebrana pomyślnie!
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pickup_code" className="block text-sm font-medium text-gray-700 mb-1">
            Kod odbioru
          </label>
          <input
            type="text"
            id="pickup_code"
            className="input-field w-full"
            value={pickupCode}
            onChange={(e) => setPickupCode(e.target.value)}
            placeholder="Wprowadź kod odbioru"
            required
            disabled={loading || success}
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading || success}
        >
          {loading ? 'Przetwarzanie...' : 'Odbierz paczkę'}
        </button>
      </form>
    </div>
  )
}
