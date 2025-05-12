'use client'

import ParcelForm from '@/components/features/parcels/parcel-form'

export default function SendParcelPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Wyślij paczkę</h1>
      </div>

      <div className="card">
        <ParcelForm />
      </div>
    </div>
  )
}
