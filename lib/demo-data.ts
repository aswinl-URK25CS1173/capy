import { Booking, DemoStats, TimeSlot } from '@/types'
import { format, subDays, addDays } from 'date-fns'

export const DEMO_TURF = {
  id: 'demo-turf-1',
  name: 'GreenField Sports Arena',
  description: 'Premium artificial turf facility with floodlights, changing rooms, and a café. The finest sports experience in the city.',
  location: 'Anna Nagar, Chennai, Tamil Nadu',
  sports: ['cricket', 'football'] as const,
  price_per_hour: 800,
  images: [
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1200',
    'https://images.unsplash.com/photo-1431324155629-1a6dae1434a6?w=1200',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200',
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
    profile: { full_name: 'Arjun Sharma', email: 'arjun@example.com' } as any,
  },
  {
    id: 'bk-002',
    sport: 'football',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    amount: 800,
    status: 'confirmed',
    profile: { full_name: 'Priya Rajan', email: 'priya@example.com' } as any,
  },
  {
    id: 'bk-003',
    sport: 'cricket',
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '11:00',
    end_time: '12:00',
    amount: 800,
    status: 'confirmed',
    profile: { full_name: 'Karthik Suresh', email: 'karthik@example.com' } as any,
  },
  {
    id: 'bk-004',
    sport: 'football',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    start_time: '16:00',
    end_time: '17:00',
    amount: 800,
    status: 'confirmed',
    profile: { full_name: 'Meera Nair', email: 'meera@example.com' } as any,
  },
  {
    id: 'bk-005',
    sport: 'cricket',
    date: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    start_time: '08:00',
    end_time: '09:00',
    amount: 800,
    status: 'confirmed',
    profile: { full_name: 'Vikram Das', email: 'vikram@example.com' } as any,
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

    // Demo: make some slots booked
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
