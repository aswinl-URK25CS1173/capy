import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

// Use service role for webhook handler (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.bookingId

      if (bookingId) {
        await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent as string,
          })
          .eq('id', bookingId)
      }
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      const bookingId = session.metadata?.bookingId
      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: 'failed' })
          .eq('id', bookingId)
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      // Find booking by payment intent
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('stripe_payment_intent', paymentIntent.id)

      if (bookings?.length) {
        await supabase
          .from('bookings')
          .update({ status: 'failed' })
          .eq('id', bookings[0].id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
