export type Sport = 'cricket' | 'football'
export type SlotStatus = 'available' | 'booked' | 'blocked' | 'closed'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'failed'
export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
}

export interface Turf {
  id: string
  name: string
  description: string
  location: string
  sports: Sport[]
  price_per_hour: number
  images: string[]
  is_active: boolean
  created_at: string
}

export interface TurfSettings {
  id: string
  turf_id: string
  opening_time: string // "06:00"
  closing_time: string // "23:00"
  slot_duration_minutes: number // 60
  advance_booking_days: number
  updated_at: string
}

export interface BlockedSlot {
  id: string
  turf_id: string
  date: string // "2024-01-15"
  start_time: string // "14:00"
  end_time: string // "15:00"
  reason: string | null
  created_at: string
}

export interface Booking {
  id: string
  user_id: string
  turf_id: string
  sport: Sport
  date: string
  start_time: string
  end_time: string
  amount: number
  status: BookingStatus
  stripe_session_id: string | null
  stripe_payment_intent: string | null
  notes: string | null
  created_at: string
  // Joined
  profile?: Profile
  turf?: Turf
}

export interface TimeSlot {
  startTime: string
  endTime: string
  status: SlotStatus
  booking?: Booking
}

export interface DemoStats {
  totalBookings: number
  todayBookings: number
  totalRevenue: number
  weeklyRevenue: number[]
  monthlyRevenue: number[]
  sportBreakdown: { cricket: number; football: number }
}
