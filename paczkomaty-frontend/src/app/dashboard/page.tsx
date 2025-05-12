'use client'

import { 
  Package, 
  Clock, 
  Truck, 
  CheckCircle2 
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell,  
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/sekelton'
import { Parcel } from '@/lib/types'
import { fetchWithAuth, formatDate } from '@/lib/utils'

// Status color mapping - poprawione dla lepszej czytelności
const STATUS_COLORS = {
  pending: 'bg-yellow-500 text-white font-semibold',
  in_transit: 'bg-blue-600 text-white font-semibold',
  delivered: 'bg-green-600 text-white font-semibold',
  default: 'bg-gray-500 text-white font-semibold'
}

export default function DashboardPage() {
  const [recentParcels, setRecentParcels] = useState<Parcel[]>([])
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_transit: 0,
    delivered: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [parcelsData, statsData] = await Promise.all([
          fetchWithAuth('/parcels/recent/'),
          fetchWithAuth('/parcels/stats/'),
        ])
        setRecentParcels(parcelsData)
        setStats(statsData)
        setError(null)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        setError('Nie udało się załadować danych. Spróbuj ponownie.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Render stats card
  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    bgColor 
  }: { 
    icon: React.ElementType, 
    title: string, 
    value: number, 
    bgColor: string 
  }) => (
    <Card className="hover:shadow-lg transition-shadow duration-300 border-2 bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-bold text-gray-700 dark:text-gray-200">{title}</CardTitle>
        <Icon className={`h-5 w-5 ${bgColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
      </CardContent>
    </Card>
  )

  // Render loading skeleton for stats
  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="bg-white dark:bg-gray-800">
          <CardHeader>
            <Skeleton className="h-4 w-20 mb-2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-8 w-16 bg-gray-200 dark:bg-gray-700" />
          </CardHeader>
        </Card>
      ))}
    </div>
  )

  // Render loading skeleton for table
  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          {['ID', 'Status', 'Data', 'Rozmiar'].map((header) => (
            <TableHead key={header} className="text-gray-700 dark:text-gray-200">{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            {[...Array(4)].map((_, j) => (
              <TableCell key={j}>
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Podsumowanie przesyłek
        </h1>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <StatsSkeleton />
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900 border-2 border-red-300 dark:border-red-700 p-4 rounded-lg text-red-900 dark:text-red-100 font-medium">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard 
            icon={Package} 
            title="Wszystkie przesyłki" 
            value={stats.total} 
            bgColor="text-blue-500" 
          />
          <StatCard 
            icon={Clock} 
            title="Oczekujące" 
            value={stats.pending} 
            bgColor="text-yellow-500" 
          />
          <StatCard 
            icon={Truck} 
            title="W transporcie" 
            value={stats.in_transit} 
            bgColor="text-purple-500" 
          />
          <StatCard 
            icon={CheckCircle2} 
            title="Dostarczone" 
            value={stats.delivered} 
            bgColor="text-green-500" 
          />
        </div>
      )}

      {/* Recent Parcels */}
      <Card className="bg-white dark:bg-gray-800 shadow-md">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Ostatnie przesyłki</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton />
          ) : error ? (
            <div className="bg-red-100 dark:bg-red-900 border-2 border-red-300 dark:border-red-700 p-4 rounded-lg text-red-900 dark:text-red-100 font-medium">
              {error}
            </div>
          ) : recentParcels.length === 0 ? (
            <div className="text-center text-gray-700 dark:text-gray-300 py-4 font-medium">
              Brak ostatnich przesyłek
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-gray-200 dark:border-gray-700">
                  <TableHead className="font-bold text-gray-900 dark:text-white">ID</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-white">Status</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-white">Data</TableHead>
                  <TableHead className="font-bold text-gray-900 dark:text-white">Rozmiar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentParcels.map((parcel) => (
                  <TableRow key={parcel.id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <TableCell className="font-medium text-gray-900 dark:text-white">
                      #{parcel.id}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${
                          STATUS_COLORS[parcel.status as keyof typeof STATUS_COLORS] || 
                          STATUS_COLORS.default
                        } border-2 px-2 py-1`}
                      >
                        {parcel.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200">
                      {formatDate(parcel.created_at)}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-200">
                      {parcel.size}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}