'use client'

import { useState, useEffect } from 'react'
import { Parcel } from '@/lib/types'
import { fetchWithAuth, formatDate } from '@/lib/utils'

interface ParcelListProps {
  endpoint: string
  title?: string
  showFilters?: boolean
}

export default function ParcelList({ endpoint, title, showFilters = true }: ParcelListProps) {
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    size: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  })

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        setLoading(true)
        // Build query parameters based on filters
        const queryParams = new URLSearchParams()
        
        if (filters.status) {
          queryParams.append('status', filters.status)
        }
        
        if (filters.size) {
          queryParams.append('size', filters.size)
        }
        
        // Note: Backend might handle ordering differently, adjust as needed
        if (filters.sortBy && filters.sortOrder) {
          queryParams.append('ordering', filters.sortOrder === 'desc' ? `-${filters.sortBy}` : filters.sortBy)
        }
        
        const url = queryParams.toString() ? `${endpoint}?${queryParams}` : endpoint
        const data = await fetchWithAuth(url)
        setParcels(data)
        setError('')
      } catch (err) {
        setError('Nie udało się pobrać listy przesyłek')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchParcels()
  }, [endpoint, filters])

  if (loading) {
    return <div className="text-center py-4">Ładowanie...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  return (
    <div className="space-y-4">
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select
            className="input-field"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">Wszystkie statusy</option>
            <option value="awaiting_pickup">Oczekujące na odbiór</option>
            <option value="in_transit">W transporcie</option>
            <option value="delivered">Dostarczone</option>
            <option value="picked_up">Odebrane</option>
          </select>

          <select
            className="input-field"
            value={filters.size}
            onChange={(e) => setFilters({ ...filters, size: e.target.value })}
          >
            <option value="">Wszystkie rozmiary</option>
            <option value="small">Mała</option>
            <option value="medium">Średnia</option>
            <option value="large">Duża</option>
          </select>

          <select
            className="input-field"
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
          >
            <option value="created_at">Data utworzenia</option>
            <option value="status">Status</option>
            <option value="size">Rozmiar</option>
          </select>

          <select
            className="input-field"
            value={filters.sortOrder}
            onChange={(e) => setFilters({ ...filters, sortOrder: e.target.value })}
          >
            <option value="desc">Malejąco</option>
            <option value="asc">Rosnąco</option>
          </select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Numer przesyłki
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paczkomat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data utworzenia
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rozmiar
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {parcels.map((parcel) => (
              <tr key={parcel.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {parcel.tracking_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    parcel.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    parcel.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                    parcel.status === 'awaiting_pickup' ? 'bg-yellow-100 text-yellow-800' :
                    parcel.status === 'picked_up' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {parcel.status_display || parcel.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {parcel.parcel_locker_name || parcel.parcel_locker}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(parcel.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {parcel.size}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
