'use client'

import { useEffect, useState } from 'react'
import { ParcelLocker } from '@/lib/types'
import { fetchWithAuth } from '@/lib/utils'

interface LockerMapProps {
  onLockerSelect?: (locker: ParcelLocker) => void
  selectedLockerId?: number
}

export default function LockerMap({ onLockerSelect, selectedLockerId }: LockerMapProps) {
  const [lockers, setLockers] = useState<ParcelLocker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLockers = async () => {
      try {
        setLoading(true)
        const data = await fetchWithAuth('/lockers/')
        setLockers(data)
        setError('')
      } catch (err) {
        setError('Nie udało się pobrać listy paczkomatów')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLockers()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Ładowanie mapy...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lockers.map((locker) => (
          <div
            key={locker.id}
            className={`card cursor-pointer transition-colors ${
              selectedLockerId === locker.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onLockerSelect?.(locker)}
          >
            <h3 className="font-semibold">{locker.name}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {locker.address}<br />
              {locker.postal_code} {locker.city}
            </p>
            <div className="mt-2 flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                locker.status === 'active' ? 'bg-green-100 text-green-800' :
                locker.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {locker.status}
              </span>
              <span className="text-sm text-gray-500">
                {locker.small_boxes} małych, {locker.medium_boxes} średnich, {locker.large_boxes} dużych
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
