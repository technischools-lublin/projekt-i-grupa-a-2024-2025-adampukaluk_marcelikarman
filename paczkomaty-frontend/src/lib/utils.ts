const API_URL = 'http://localhost:8000/api/'

export const getAuthHeader = () => {
  const token = localStorage.getItem('token')
  return {
    'Authorization': token ? `Token ${token}` : '',
    'Content-Type': 'application/json',
  }
}

export const fetchWithAuth = async (endpoint: string, options: RequestInit = {}) => {
  const headers = getAuthHeader()
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      // Handle Django REST Framework error responses
      const error: any = new Error(data.detail || 'API request failed')
      error.status = response.status
      error.detail = data.detail || data.message || 'Unknown error'
      
      // Add field errors if available
      if (typeof data === 'object' && data !== null) {
        error.fieldErrors = data
      }
      
      throw error
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error')
  }
}

export const formatDate = (date: string) => {
  if (!date) return ''
  
  return new Date(date).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatCurrency = (amount: number) => {
  if (amount === undefined || amount === null) return ''
  
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount)
}

// Helper function to handle parcel status display
export const getStatusDisplay = (status: string): string => {
  const statusMap: Record<string, string> = {
    'awaiting_pickup': 'Oczekuje na odbiór',
    'picked_up': 'Odebrana',
    'in_transit': 'W transporcie',
    'delivered': 'Dostarczona'
  }
  
  return statusMap[status] || status
}

// Helper function to get status badge color
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'awaiting_pickup': 'bg-yellow-100 text-yellow-800',
    'picked_up': 'bg-purple-100 text-purple-800',
    'in_transit': 'bg-blue-100 text-blue-800',
    'delivered': 'bg-green-100 text-green-800'
  }
  
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}




import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}