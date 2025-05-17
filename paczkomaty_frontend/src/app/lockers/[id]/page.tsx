'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Locker } from '@/lib/types'
import { fetchWithAuth } from '@/lib/utils'

export default function LockerDetailPage() {
  const params = useParams()
  const [locker, setLocker] = useState<Locker | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchLocker = async () => {
      try {
        setLoading(true)
        const data = await fetchWithAuth(`/lockers/${params.id}/`)
        setLocker(data)
        setError('')
      } catch (err) {
        setError('Nie udało się pobrać szczegółów paczkomatu')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLocker()
  }, [params.id])

  if (loading) {
    return <div className="text-center py-4">Ładowanie...</div>
  }

  if (error || !locker) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="card">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{locker.name}</h1>
              <p className="mt-1 text-gray-500">
                {locker.address}<br />
                {locker.postal_code} {locker.city}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${
              locker.status === 'active' ? 'bg-green-100 text-green-800' :
              locker.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {locker.status}
            </span>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">Małe skrytki</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {locker.small_boxes}
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-lg font-medium text-green-800">Średnie skrytki</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                {locker.medium_boxes}
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800">Duże skrytki</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                {locker.large_boxes}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Lokalizacja</h2>
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg">
              {/* Here you would typically integrate a map component */}
              <div className="flex items-center justify-center text-gray-500">
                Mapa lokalizacji
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
