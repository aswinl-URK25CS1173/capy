import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { turfId, sport, date, startTime, endTime, amount } = body

    // Validate required fields
    if (!turfId || !sport || !date || !startTime || !endTime || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check slot is still available (prevent race conditions)
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('turf_id', turfId)
      .eq('date', date)
      .eq('start_time', startTime)
      .in('status', ['pending', 'confirmed'])
      .single()

    if (existingBooking) {
      return NextResponse.json({ error: 'Slot already booked' }, { status: 409 })
    }

    // Create pending booking first
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        turf_id: turfId,
        sport,
        date,
        start_time: startTime,
        end_time: endTime,
        amount,
        status: 'pending',
      })
      .select()
      .single()

    if (bookingError || !booking) {
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${sport.charAt(0).toUpperCase() + sport.slice(1)} Turf — ${date}`,
              description: `${startTime} – ${endTime} · GreenField Sports Arena`,
              images: ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=600'],
            },
            unit_amount: amount * 100, // paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        userId: user.id,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&ref=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/booking?cancelled=true`,
    })

    // Save session ID to booking
    await supabase
      .from('bookings')
      .update({ stripe_session_id: session.id })
      .eq('id', booking.id)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
