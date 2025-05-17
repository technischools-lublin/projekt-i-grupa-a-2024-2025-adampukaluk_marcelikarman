'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Parcel } from '@/lib/types'
import { fetchWithAuth, formatDate, formatCurrency } from '@/lib/utils'

export default function ParcelDetailPage() {
  const params = useParams()
  const [parcel, setParcel] = useState<Parcel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        setLoading(true)
        const data = await fetchWithAuth(`/parcels/${params.id}/`)
        setParcel(data)
        setError('')
      } catch (err) {
        setError('Nie udało się pobrać szczegółów przesyłki')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchParcel()
  }, [params.id])

  if (loading) {
    return <div className="text-center py-4">Ładowanie...</div>
  }

  if (error || !parcel) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Szczegóły przesyłki #{parcel.id}</h1>
        <span className={`px-3 py-1 rounded-full text-sm ${
          parcel.status === 'delivered' ? 'bg-green-100 text-green-800' :
          parcel.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
          parcel.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {parcel.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Informacje o przesyłce</h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">Data utworzenia</dt>
              <dd className="mt-1">{formatDate(parcel.created_at)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Ostatnia aktualizacja</dt>
              <dd className="mt-1">{formatDate(parcel.updated_at)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Rozmiar</dt>
              <dd className="mt-1">{parcel.size}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Cena</dt>
              <dd className="mt-1">{formatCurrency(parcel.price)}</dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Dane nadawcy i odbiorcy</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Nadawca</h3>
              <p className="font-medium">{parcel.sender.first_name} {parcel.sender.last_name}</p>
              <p className="text-sm text-gray-500">{parcel.sender.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Paczkomat: {parcel.sender_locker.name}<br />
                {parcel.sender_locker.address}<br />
                {parcel.sender_locker.postal_code} {parcel.sender_locker.city}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Odbiorca</h3>
              <p className="font-medium">{parcel.recipient.first_name} {parcel.recipient.last_name}</p>
              <p className="text-sm text-gray-500">{parcel.recipient.email}</p>
              <p className="text-sm text-gray-500 mt-2">
                Paczkomat: {parcel.recipient_locker.name}<br />
                {parcel.recipient_locker.address}<br />
                {parcel.recipient_locker.postal_code} {parcel.recipient_locker.city}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
