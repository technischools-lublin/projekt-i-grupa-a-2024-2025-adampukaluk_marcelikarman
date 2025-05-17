export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  is_staff: boolean
}

export interface Parcel {
  id: number
  tracking_number: string
  parcel_locker: number
  parcel_locker_name?: string
  locker_slot?: number
  locker_slot_info?: LockerSlot
  size: 'small' | 'medium' | 'large'
  status: 'awaiting_pickup' | 'picked_up' | 'in_transit' | 'delivered'
  status_display?: string
  sender: number
  sender_username?: string
  receiver: number
  receiver_username?: string
  pickup_code?: string
  created_at: string
}

export interface ParcelLocker {
  id: number
  name: string
  location: string
  latitude: number
  longitude: number
  status: boolean
  number_of_slots: number
  created_at: string
  available_slots_count?: number
  slots?: LockerSlot[]
}

export interface LockerSlot {
  id: number
  parcel_locker: number
  parcel_locker_name?: string
  slot_number: string
  size: 'small' | 'medium' | 'large'
  is_occupied: boolean
  last_updated: string
}

export interface Locker {
  id: number
  name: string
  address: string
  postal_code: string
  city: string
  status: 'active' | 'maintenance' | 'inactive'
  small_boxes: number
  medium_boxes: number
  large_boxes: number
}

export interface DeliveryHistory {
  id: number
  parcel: number
  event_type: 'created' | 'placed_in_locker' | 'picked_up'
  event_type_display?: string
  event_time: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  code?: string
  detail?: string
}
