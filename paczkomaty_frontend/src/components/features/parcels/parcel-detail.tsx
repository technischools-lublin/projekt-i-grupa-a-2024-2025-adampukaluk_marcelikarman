'use client'

import { useState, useEffect } from 'react'
import { Parcel, DeliveryHistory } from '@/lib/types'
import { fetchWithAuth, formatDate, getStatusDisplay, getStatusColor } from '@/lib/utils'
import ParcelPickup from './parcel-pickup'

interface ParcelDetailProps {
  parcelId: number
}

export default function ParcelDetail({ parcelId }: ParcelDetailProps) {
  const [parcel, setParcel] = useState<Parcel | null>(null)
  const [history, setHistory] = useState<DeliveryHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchParcelDetails = async () => {
      try {
        setLoading(true)
        // Fetch parcel details
        const parcelData = await fetchWithAuth(`/parcels/${parcelId}/`)
        setParcel(parcelData)
        
        // Fetch parcel history
        const historyData = await fetchWithAuth(`/parcels/${parcelId}/history/`)
        setHistory(historyData)
        
        setError('')
      } catch (err: any) {
        setError(err.detail || 'Nie udało się pobrać szczegółów przesyłki')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (parcelId) {
      fetchParcelDetails()
    }
  }, [parcelId])

  if (loading) {
    return <div className="text-center py-4">Ładowanie...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  if (!parcel) {
    return <div className="text-center py-4">Nie znaleziono przesyłki</div>
  }

  // Check if parcel is awaiting pickup to show the pickup form
  const showPickupForm = parcel.status === 'awaiting_pickup'

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Szczegóły przesyłki</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Informacje podstawowe</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Numer przesyłki:</dt>
                <dd className="font-medium">{parcel.tracking_number}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Status:</dt>
                <dd>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(parcel.status)}`}>
                    {parcel.status_display || getStatusDisplay(parcel.status)}
                  </span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Rozmiar:</dt>
                <dd>{parcel.size}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Data utworzenia:</dt>
                <dd>{formatDate(parcel.created_at)}</dd>
              </div>
            </dl>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Lokalizacja</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Paczkomat:</dt>
                <dd>{parcel.parcel_locker_name || `ID: ${parcel.parcel_locker}`}</dd>
              </div>
              {parcel.locker_slot_info && (
                <div className="flex justify-between">
                  <dt className="text-gray-500">Skrytka:</dt>
                  <dd>{parcel.locker_slot_info.slot_number}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
      
      {showPickupForm && (
        <ParcelPickup parcelId={parcelId} />
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Historia przesyłki</h2>
        
        {history.length === 0 ? (
          <p className="text-gray-500">Brak historii dla tej przesyłki</p>
        ) : (
          <div className="space-y-4">
            {history.map((event) => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="font-medium">{event.event_type_display || event.event_type}</div>
                <div className="text-sm text-gray-500">{formatDate(event.event_time)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
