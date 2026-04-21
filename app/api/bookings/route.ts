import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')
    const turfId = searchParams.get('turf_id')

    let query = supabase
      .from('bookings')
      .select(`*, profile:profiles(full_name, email, avatar_url), turf:turfs(name)`)
      .order('date', { ascending: true })
      .order('start_time', { ascending: true })

    if (date) query = query.eq('date', date)
    if (turfId) query = query.eq('turf_id', turfId)

    // RLS handles user access — admins see all, users see their own
    const { data, error } = await query

    if (error) throw error

    return NextResponse.json({ bookings: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { bookingId } = await req.json()

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId)
      .eq('user_id', user.id) // RLS ensures user can only cancel their own

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
