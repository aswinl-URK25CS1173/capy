import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSlots } from '@/lib/utils'
import { TimeSlot } from '@/types'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const turfId = searchParams.get('turf_id')

    if (!date || !turfId) {
      return NextResponse.json({ error: 'date and turf_id are required' }, { status: 400 })
    }

    // Get turf settings
    const { data: settings } = await supabase
      .from('turf_settings')
      .select('*')
      .eq('turf_id', turfId)
      .single()

    const openingTime = settings?.opening_time || '06:00'
    const closingTime = settings?.closing_time || '23:00'
    const durationMinutes = settings?.slot_duration_minutes || 60

    // Generate all slots
    const rawSlots = generateSlots(openingTime, closingTime, durationMinutes)

    // Get confirmed bookings for this date
    const { data: bookings } = await supabase
      .from('bookings')
      .select('start_time, end_time, sport, user_id')
      .eq('turf_id', turfId)
      .eq('date', date)
      .in('status', ['pending', 'confirmed'])

    // Get blocked slots
    const { data: blockedSlots } = await supabase
      .from('blocked_slots')
      .select('start_time, end_time')
      .eq('turf_id', turfId)
      .eq('date', date)

    // Merge availability
    const slots: TimeSlot[] = rawSlots.map(slot => {
      const isBooked = bookings?.some(b => b.start_time === slot.startTime)
      const isBlocked = blockedSlots?.some(b => b.start_time === slot.startTime)

      return {
        ...slot,
        status: isBlocked ? 'blocked' : isBooked ? 'booked' : 'available',
      }
    })

    return NextResponse.json({ slots })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
