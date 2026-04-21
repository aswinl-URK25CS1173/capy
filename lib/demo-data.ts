import { Booking, DemoStats, Profile, TimeSlot } from '@/types'
import { format, subDays, addDays } from 'date-fns'

const demoProfiles: Profile[] = [
  {
    id: 'profile-1',
    email: 'arjun@example.com',
    full_name: 'Arjun Sharma',
    avatar_url: null,
    role: 'user',
    created_at: new Date().toISOString(),
  },
  {
    id: 'profile-2',
    email: 'priya@example.com',
    full_name: 'Priya Rajan',
    avatar_url: null,
    role: 'user',
    created_at: new Date().toISOString(),
  },
  {
    id: 'profile-3',
    email: 'karthik@example.com',
    full_name: 'Karthik Suresh',
    avatar_url: null,
    role: 'user',
    created_at: new Date().toISOString(),
  },
  {
    id: 'profile-4',
    email: 'meera@example.com',
    full_name: 'Meera Nair',
    avatar_url: null,
    role: 'user',
    created_at: new Date().toISOString(),
  },
  {
    id: 'profile-5',
    email: 'vikram@example.com',
    full_name: 'Vikram Das',
    avatar_url: null,
    role: 'user',
    created_at: new Date().toISOString(),
  },
]

export const DEMO_TURF = {
  id: 'demo-turf-1',
  name: '7 NENI TURF',
  description: 'Premium dual-sport turf in Chennai for cricket and football with neon-lit match nights, instant online booking, floodlights, and a champion-inspired arena atmosphere.',
  location: 'Anna Nagar, Chennai, Tamil Nadu',
  sports: ['cricket', 'football'] as const,
  price_per_hour: 800,
  images: [
    '/images/neni-turf-poster.jpeg',
    '/images/neni-turf-neon-sign.jpeg',
    '/images/neni-turf-poster.jpeg',
  ],
  is_active: true,
  created_at: new Date().toISOString(),
}

export const DEMO_STATS: DemoStats = {
  totalBookings: 847,
  todayBookings: 12,
  totalRevenue: 678400,
  weeklyRevenue: [52000, 48000, 61000, 55000, 67000, 72000, 58000],
  monthlyRevenue: [180000, 210000, 195000, 230000, 215000, 248000, 225000, 260000, 278000, 245000, 290000, 310000],
  sportBreakdown: { cricket: 486, football: 361 },
}

export const DEMO_BOOKINGS: Partial<Booking>[] = [
  {
    id: 'bk-001',
    sport: 'cricket',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '07:00',
    end_time: '08:00',
    amount: 800,
    status: 'confirmed',
    profile: demoProfiles[0],
  },
  {
    id: 'bk-002',
    sport: 'football',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    amount: 800,
    status: 'confirmed',
    profile: demoProfiles[1],
  },
  {
    id: 'bk-003',
    sport: 'cricket',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '11:00',
    end_time: '12:00',
    amount: 800,
    status: 'confirmed',
    profile: demoProfiles[2],
  },
  {
    id: 'bk-004',
    sport: 'football',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    start_time: '16:00',
    end_time: '17:00',
    amount: 800,
    status: 'confirmed',
    profile: demoProfiles[3],
  },
  {
    id: 'bk-005',
    sport: 'cricket',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    start_time: '08:00',
    end_time: '09:00',
    amount: 800,
    status: 'confirmed',
    profile: demoProfiles[4],
  },
]

export function generateTimeSlots(date: string): TimeSlot[] {
  const slots: TimeSlot[] = []
  const today = format(new Date(), 'yyyy-MM-dd')
  const isToday = date === today

  for (let hour = 6; hour < 23; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`

    let status: TimeSlot['status'] = 'available'
    const bookedHours = isToday ? [7, 9, 11, 14, 18, 20] : [8, 12, 16, 19]
    const blockedHours = [6, 22]

    if (blockedHours.includes(hour)) {
      status = 'blocked'
    } else if (bookedHours.includes(hour)) {
      status = 'booked'
    }

    slots.push({ startTime, endTime, status })
  }

  return slots
}
