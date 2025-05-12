'use client'

import ParcelList from '@/components/features/parcels/parcel-list'

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Historia przesyłek</h1>
      </div>

      <ParcelList
        endpoint="/parcels/history/"
        showFilters={true}
      />
    </div>
  )
}
