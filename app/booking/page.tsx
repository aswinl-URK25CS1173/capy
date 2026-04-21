'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isBefore, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Clock, CheckCircle, X, CreditCard, AlertCircle, Calendar, IndianRupee } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { formatTime } from '@/lib/utils'
import { generateTimeSlots } from '@/lib/demo-data'
import { TimeSlot, Sport } from '@/types'
import dynamic from 'next/dynamic'
import Navbar from '@/components/Navbar'

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false })

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_NAMES   = ['Su','Mo','Tu','We','Th','Fr','Sa']

function SlotTile({ slot, onClick }: { slot: TimeSlot; onClick: () => void }) {
  const isAvailable = slot.status === 'available'
  const isBooked    = slot.status === 'booked'

  const statusStyle = isAvailable ? 'slot-available' : isBooked ? 'slot-booked' : 'slot-blocked'
  const dotColor    = isAvailable ? '#4ade80' : isBooked ? '#f87171' : 'rgba(255,255,255,0.2)'
  const label       = isAvailable ? 'Available' : isBooked ? 'Booked' : 'Closed'

  return (
    <button onClick={isAvailable ? onClick : undefined} className={`w-full rounded-xl p-4 text-left ${statusStyle}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
        <span className="font-bold uppercase tracking-wider" style={{ fontSize: '9px', opacity: 0.8 }}>{label}</span>
      </div>
      <div className="font-bold text-sm">{formatTime(slot.startTime)}</div>
      <div style={{ fontSize: '11px', opacity: 0.6, marginTop: 2 }}>to {formatTime(slot.endTime)}</div>
    </button>
  )
}

function BookingContent() {
  const searchParams = useSearchParams()
  const [sport, setSport]             = useState<Sport>((searchParams.get('sport') as Sport) || 'cricket')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calMonth, setCalMonth]       = useState(new Date())
  const [slots, setSlots]             = useState<TimeSlot[]>([])
  const [loading, setLoading]         = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showModal, setShowModal]     = useState(false)
  const [payStep, setPayStep]         = useState<'review' | 'processing' | 'done'>('review')
  const [bookingRef, setBookingRef]   = useState('')

  const today     = startOfDay(new Date())
  const year      = calMonth.getFullYear()
  const month     = calMonth.getMonth()
  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      setSlots(generateTimeSlots(format(selectedDate, 'yyyy-MM-dd')))
      setLoading(false)
    }, 500)
    return () => clearTimeout(t)
  }, [selectedDate])

  const openBooking = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setPayStep('review')
    setShowModal(true)
  }

  const confirmPayment = async () => {
    setPayStep('processing')
    await new Promise(r => setTimeout(r, 2200))
    setBookingRef('GF' + Math.random().toString(36).slice(2, 10).toUpperCase())
    setPayStep('done')
    toast.success('Booking confirmed!')
    setSlots(prev => prev.map(s => s.startTime === selectedSlot?.startTime ? { ...s, status: 'booked' as const } : s))
  }

  const availCount  = slots.filter(s => s.status === 'available').length
  const bookedCount = slots.filter(s => s.status === 'booked').length

  return (
    <div className="min-h-screen" style={{ background: '#05060a', color: '#f1f5f9' }}>
      <Navbar />

      {/* Page header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <div className="flex items-center gap-3 py-8">
          <Link href="/">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Book a Slot</h1>
            <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>Select sport → Choose date → Pick time → Pay securely</p>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* LEFT */}
          <div className="lg:w-72 xl:w-80 flex-shrink-0 space-y-4">

            {/* Sport selector */}
            <div className="card p-5">
              <div className="label-upper mb-3">Select Sport</div>
              <div className="grid grid-cols-2 gap-3">
                {(['cricket', 'football'] as Sport[]).map(s => {
                  const isSel = sport === s
                  const isCricket = s === 'cricket'
                  return (
                    <button key={s} onClick={() => setSport(s)}
                      className="p-4 rounded-xl text-left transition-all duration-150"
                      style={{
                        border: isSel
                          ? `2px solid ${isCricket ? '#f59e0b' : '#22c55e'}`
                          : '2px solid rgba(255,255,255,0.07)',
                        background: isSel
                          ? isCricket ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)'
                          : 'rgba(255,255,255,0.02)',
                      }}>
                      <div className="text-2xl mb-2">{isCricket ? '🏏' : '⚽'}</div>
                      <div className="font-bold text-sm capitalize"
                        style={{ color: isSel ? (isCricket ? '#fbbf24' : '#4ade80') : '#94a3b8' }}>{s}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#4b5563' }}>₹800/hr</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Calendar */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="label-upper mb-0.5">Select Date</div>
                  <div className="font-bold text-sm">{MONTH_NAMES[month]} {year}</div>
                </div>
                <div className="flex gap-1">
                  {[
                    { fn: () => setCalMonth(new Date(year, month - 1)), Icon: ChevronLeft },
                    { fn: () => setCalMonth(new Date(year, month + 1)), Icon: ChevronRight },
                  ].map(({ fn, Icon }, i) => (
                    <button key={i} onClick={fn}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                      style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map(d => (
                  <div key={d} className="text-center py-1 font-semibold" style={{ fontSize: '10px', color: '#374151' }}>{d}</div>
                ))}
                {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day  = i + 1
                  const date = new Date(year, month, day)
                  const isPast  = isBefore(date, today)
                  const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                  const isSel   = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

                  let style: React.CSSProperties = {
                    border: '1px solid transparent',
                    color: '#94a3b8',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 500,
                    padding: '4px 0',
                    cursor: 'pointer',
                    transition: 'all 0.1s',
                  }
                  if (isPast)   style = { ...style, color: 'rgba(255,255,255,0.12)', cursor: 'not-allowed', pointerEvents: 'none' }
                  else if (isSel) style = { ...style, background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.55)', color: '#4ade80', boxShadow: '0 0 12px rgba(34,197,94,0.2)' }
                  else if (isToday) style = { ...style, borderColor: 'rgba(34,197,94,0.4)', color: '#86efac' }

                  return (
                    <button key={day} disabled={isPast} onClick={() => !isPast && setSelectedDate(date)}
                      className="aspect-square text-center" style={style}>
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="card p-5">
              <div className="label-upper mb-3">Slot Legend</div>
              <div className="space-y-2.5">
                {[
                  { dot: '#22c55e', label: 'Available', count: availCount },
                  { dot: '#ef4444', label: 'Booked',    count: bookedCount },
                  { dot: 'rgba(255,255,255,0.2)', label: 'Blocked', count: null },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.dot }} />
                      <span className="text-xs" style={{ color: '#6b7280' }}>{item.label}</span>
                    </div>
                    {item.count !== null && <span className="text-xs font-bold" style={{ color: '#94a3b8' }}>{item.count}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Slots */}
          <div className="flex-1 min-w-0">
            <div className="card p-6 h-full" style={{ minHeight: 400 }}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                    {format(selectedDate, 'EEEE, d MMMM yyyy')}
                  </h2>
                  <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
                    {sport === 'cricket' ? '🏏 Cricket' : '⚽ Football'} · GreenField Arena, Anna Nagar
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ fontFamily: 'Space Grotesk', fontSize: 24, color: '#4ade80' }}>₹800</div>
                  <div className="text-xs" style={{ color: '#4b5563' }}>per hour</div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {[...Array(12)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80 }} />)}
                </div>
              ) : (
                <motion.div key={format(selectedDate, 'yyyy-MM-dd')} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {slots.map((slot, i) => (
                    <motion.div key={slot.startTime} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}>
                      <SlotTile slot={slot} onClick={() => openBooking(slot)} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="mt-6 pt-5 flex flex-wrap gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#4b5563' }}>
                <span className="flex items-center gap-1.5"><IndianRupee className="w-3 h-3" /> UPI / Card / Net Banking accepted</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3" style={{ color: '#22c55e' }} /> GST included</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Instant confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {showModal && selectedSlot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && payStep !== 'processing' && setShowModal(false)}>
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-md grad-border p-7 relative">

              {payStep !== 'processing' && (
                <button onClick={() => setShowModal(false)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* REVIEW */}
              {payStep === 'review' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ background: sport === 'cricket' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)' }}>
                      {sport === 'cricket' ? '🏏' : '⚽'}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl" style={{ fontFamily: 'Space Grotesk' }}>Confirm Booking</h3>
                      <p className="text-sm capitalize" style={{ color: '#6b7280' }}>{sport} · GreenField Arena</p>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden mb-5" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                    {[
                      { label: 'Date',     value: format(selectedDate, 'EEE, d MMM yyyy') },
                      { label: 'Time',     value: `${formatTime(selectedSlot.startTime)} – ${formatTime(selectedSlot.endTime)}` },
                      { label: 'Duration', value: '1 Hour' },
                      { label: 'Sport',    value: sport === 'cricket' ? '🏏 Cricket' : '⚽ Football' },
                    ].map((row, i) => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-3 text-sm"
                        style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                        <span style={{ color: '#6b7280' }}>{row.label}</span>
                        <span className="font-semibold">{row.value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-4 py-3"
                      style={{ background: 'rgba(34,197,94,0.07)', borderTop: '1px solid rgba(34,197,94,0.2)' }}>
                      <span className="font-semibold" style={{ color: '#94a3b8' }}>Total Amount</span>
                      <span className="font-bold" style={{ fontFamily: 'Space Grotesk', fontSize: 24, color: '#4ade80' }}>₹800</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 rounded-xl p-3.5 mb-5"
                    style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#fbbf24' }} />
                    <p className="text-xs leading-relaxed" style={{ color: 'rgba(251,191,36,0.8)' }}>
                      <strong>Demo Mode:</strong> No real payment will be charged. This simulates a Stripe checkout flow.
                    </p>
                  </div>

                  <button onClick={confirmPayment} className="btn-green w-full gap-2.5" style={{ padding: '14px', fontSize: '15px' }}>
                    <CreditCard className="w-5 h-5" /> Pay ₹800 & Confirm
                  </button>
                  <p className="text-center text-xs mt-3" style={{ color: '#4b5563' }}>
                    UPI · PhonePe · Google Pay · Credit & Debit Card
                  </p>
                </>
              )}

              {/* PROCESSING */}
              {payStep === 'processing' && (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ border: '2px solid rgba(34,197,94,0.3)' }}>
                    <div className="w-10 h-10 rounded-full border-2 border-t-green-400 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#4ade80' }} />
                  </div>
                  <h3 className="font-bold text-xl mb-2" style={{ fontFamily: 'Space Grotesk' }}>Processing Payment</h3>
                  <p className="text-sm" style={{ color: '#6b7280' }}>Connecting to Stripe — please wait</p>
                  <div className="flex justify-center gap-1.5 mt-5">
                    {[0,1,2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-green-400 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {/* SUCCESS */}
              {payStep === 'done' && (
                <div className="text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
                    style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.4)' }}>
                    <CheckCircle className="w-10 h-10" style={{ color: '#4ade80' }} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk' }}>Booking Confirmed!</h3>
                  <p className="text-sm mb-6" style={{ color: '#6b7280' }}>Your slot is secured. See you on the turf!</p>

                  <div className="rounded-xl p-4 text-left mb-6 space-y-2.5"
                    style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}>
                    {[
                      { label: 'Booking Ref', value: bookingRef, green: true },
                      { label: 'Sport',        value: sport === 'cricket' ? '🏏 Cricket' : '⚽ Football' },
                      { label: 'Date',         value: format(selectedDate, 'EEE, d MMM yyyy') },
                      { label: 'Time',         value: `${formatTime(selectedSlot.startTime)} – ${formatTime(selectedSlot.endTime)}` },
                      { label: 'Amount Paid',  value: '₹800', green: true },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between text-sm">
                        <span style={{ color: '#6b7280' }}>{row.label}</span>
                        <span className="font-bold" style={{ color: row.green ? '#4ade80' : '#f1f5f9', fontFamily: row.green ? 'monospace' : undefined }}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setShowModal(false)} className="btn-outline py-3 text-sm">Book Another</button>
                    <Link href="/dashboard">
                      <button className="btn-green w-full py-3 text-sm">View My Bookings</button>
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#05060a' }}>
        <div className="flex gap-2">
          {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-green-500 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}
