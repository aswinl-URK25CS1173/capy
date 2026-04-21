'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { format, isBefore, startOfDay } from 'date-fns'
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Clock, CreditCard, IndianRupee, X } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import { generateTimeSlots } from '@/lib/demo-data'
import { formatTime } from '@/lib/utils'
import { Sport, TimeSlot } from '@/types'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function SlotTile({ slot, onClick }: { slot: TimeSlot; onClick: () => void }) {
  const isAvailable = slot.status === 'available'
  const isBooked = slot.status === 'booked'
  const dotColor = isAvailable ? '#60a5fa' : isBooked ? '#f87171' : 'rgba(255,255,255,0.2)'
  const label = isAvailable ? 'Available' : isBooked ? 'Booked' : 'Closed'

  return (
    <button onClick={isAvailable ? onClick : undefined} className={`w-full rounded-xl p-4 text-left ${isAvailable ? 'slot-available' : isBooked ? 'slot-booked' : 'slot-blocked'}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: dotColor }} />
        <span className="font-bold uppercase tracking-wider text-[9px] opacity-80">{label}</span>
      </div>
      <div className="font-bold text-sm">{formatTime(slot.startTime)}</div>
      <div className="text-[11px] opacity-60 mt-0.5">to {formatTime(slot.endTime)}</div>
    </button>
  )
}

function BookingContent() {
  const searchParams = useSearchParams()
  const [sport, setSport] = useState<Sport>((searchParams.get('sport') as Sport) || 'cricket')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'review' | 'processing' | 'done'>('review')
  const [bookingRef, setBookingRef] = useState('')

  const today = startOfDay(new Date())
  const year = calendarMonth.getFullYear()
  const month = calendarMonth.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setSlots(generateTimeSlots(format(selectedDate, 'yyyy-MM-dd')))
      setLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [selectedDate])

  const activeAccent = sport === 'cricket' ? '#3b82f6' : '#f97316'
  const activeBg = sport === 'cricket' ? 'rgba(37,99,235,0.12)' : 'rgba(249,115,22,0.12)'

  const openBooking = (slot: TimeSlot) => {
    setSelectedSlot(slot)
    setPaymentStep('review')
    setShowModal(true)
  }

  const handleDateSelect = (date: Date) => {
    setLoading(true)
    setSelectedDate(date)
  }

  const confirmPayment = async () => {
    setPaymentStep('processing')
    await new Promise((resolve) => setTimeout(resolve, 2200))
    setBookingRef(`NT${Math.random().toString(36).slice(2, 10).toUpperCase()}`)
    setPaymentStep('done')
    toast.success('Booking confirmed!')
    setSlots((current) => current.map((slot) => slot.startTime === selectedSlot?.startTime ? { ...slot, status: 'booked' } : slot))
  }

  const availableCount = slots.filter((slot) => slot.status === 'available').length
  const bookedCount = slots.filter((slot) => slot.status === 'booked').length

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20">
        <div className="flex items-center gap-3 py-8">
          <Link href="/">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors border border-white/10 text-slate-400 hover:text-slate-100 hover:border-blue-400/30 hover:bg-blue-500/10">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Space Grotesk' }}>Book a Slot</h1>
            <p className="text-sm mt-0.5 text-slate-500">Select sport → Choose date → Pick time → Pay securely at 7 NENI TURF</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-72 xl:w-80 flex-shrink-0 space-y-4">
            <div className="card p-5">
              <div className="label-upper mb-3">Select Sport</div>
              <div className="grid grid-cols-2 gap-3">
                {(['cricket', 'football'] as Sport[]).map((item) => {
                  const isSelected = sport === item
                  const isCricket = item === 'cricket'
                  const accent = isCricket ? '#3b82f6' : '#f97316'
                  const selectedBg = isCricket ? 'rgba(37,99,235,0.12)' : 'rgba(249,115,22,0.12)'

                  return (
                    <button
                      key={item}
                      onClick={() => setSport(item)}
                      className="p-4 rounded-xl text-left transition-all duration-150"
                      style={{
                        border: isSelected ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.07)',
                        background: isSelected ? selectedBg : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      <div className="text-2xl mb-2">{isCricket ? '🏏' : '⚽'}</div>
                      <div className="font-bold text-sm capitalize" style={{ color: isSelected ? accent : '#94a3b8' }}>{item}</div>
                      <div className="text-xs mt-0.5 text-slate-500">₹800/hr</div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="label-upper mb-0.5">Select Date</div>
                  <div className="font-bold text-sm">{MONTH_NAMES[month]} {year}</div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCalendarMonth(new Date(year, month - 1))}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 text-slate-400 hover:border-blue-400/30 hover:text-slate-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCalendarMonth(new Date(year, month + 1))}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/10 text-slate-400 hover:border-blue-400/30 hover:text-slate-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {DAY_NAMES.map((day) => (
                  <div key={day} className="text-center py-1 font-semibold text-[10px] text-slate-700">{day}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, index) => <div key={`empty-${index}`} />)}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const date = new Date(year, month, day)
                  const isPast = isBefore(date, today)
                  const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
                  const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

                  return (
                    <button
                      key={day}
                      disabled={isPast}
                      onClick={() => !isPast && handleDateSelect(date)}
                      className={`aspect-square text-center rounded-lg text-xs font-medium transition-all border ${
                        isPast ? 'cal-past border-transparent' : isSelected ? 'cal-selected' : isToday ? 'cal-today' : 'border-transparent text-slate-400 hover:border-blue-400/20 hover:text-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="card p-5">
              <div className="label-upper mb-3">Slot Legend</div>
              <div className="space-y-2.5">
                {[
                  { dot: '#3b82f6', label: 'Available', count: availableCount },
                  { dot: '#ef4444', label: 'Booked', count: bookedCount },
                  { dot: 'rgba(255,255,255,0.2)', label: 'Blocked', count: null },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.dot }} />
                      <span className="text-xs text-slate-500">{item.label}</span>
                    </div>
                    {item.count !== null && <span className="text-xs font-bold text-slate-300">{item.count}</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="card p-6 h-full min-h-[400px]">
              <div className="flex items-start justify-between mb-6 gap-4">
                <div>
                  <h2 className="font-bold text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                    {format(selectedDate, 'EEEE, d MMMM yyyy')}
                  </h2>
                  <p className="text-sm mt-0.5 text-slate-500">
                    {sport === 'cricket' ? '🏏 Cricket' : '⚽ Football'} · 7 NENI TURF, Anna Nagar
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-2xl" style={{ fontFamily: 'Space Grotesk', color: activeAccent }}>₹800</div>
                  <div className="text-xs text-slate-600">per hour</div>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {Array.from({ length: 12 }).map((_, index) => <div key={index} className="skeleton h-20" />)}
                </div>
              ) : (
                <motion.div key={format(selectedDate, 'yyyy-MM-dd')} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                  {slots.map((slot, index) => (
                    <motion.div key={slot.startTime} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.025 }}>
                      <SlotTile slot={slot} onClick={() => openBooking(slot)} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              <div className="mt-6 pt-5 flex flex-wrap gap-4 text-xs text-slate-500 border-t border-white/[0.06]">
                <span className="flex items-center gap-1.5"><IndianRupee className="w-3 h-3" /> UPI / Card / Net Banking accepted</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3 h-3 text-blue-400" /> GST included</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Instant confirmation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 modal-backdrop flex items-end sm:items-center justify-center p-4"
            onClick={(event) => event.target === event.currentTarget && paymentStep !== 'processing' && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="w-full max-w-md grad-border p-7 relative"
            >
              {paymentStep !== 'processing' && (
                <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 w-8 h-8 rounded-xl flex items-center justify-center border border-white/10 text-slate-400 hover:text-slate-100 hover:border-blue-400/30">
                  <X className="w-4 h-4" />
                </button>
              )}

              {paymentStep === 'review' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ background: activeBg, border: `1px solid ${activeAccent}33` }}>
                      {sport === 'cricket' ? '🏏' : '⚽'}
                    </div>
                    <div>
                      <h3 className="font-bold text-xl" style={{ fontFamily: 'Space Grotesk' }}>Confirm Booking</h3>
                      <p className="text-sm capitalize text-slate-500">{sport} · 7 NENI TURF</p>
                    </div>
                  </div>

                  <div className="rounded-xl overflow-hidden mb-5 border border-white/[0.07]">
                    {[
                      { label: 'Date', value: format(selectedDate, 'EEE, d MMM yyyy') },
                      { label: 'Time', value: `${formatTime(selectedSlot.startTime)} – ${formatTime(selectedSlot.endTime)}` },
                      { label: 'Duration', value: '1 Hour' },
                      { label: 'Sport', value: sport === 'cricket' ? '🏏 Cricket' : '⚽ Football' },
                    ].map((row, index) => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-3 text-sm" style={{ background: index % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
                        <span className="text-slate-500">{row.label}</span>
                        <span className="font-semibold">{row.value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(37,99,235,0.08)', borderTop: '1px solid rgba(37,99,235,0.2)' }}>
                      <span className="font-semibold text-slate-300">Total Amount</span>
                      <span className="font-bold text-2xl text-blue-300" style={{ fontFamily: 'Space Grotesk' }}>₹800</span>
                    </div>
                  </div>

                  <div className="flex gap-2.5 rounded-xl p-3.5 mb-5 border border-orange-400/20 bg-orange-500/8">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-300" />
                    <p className="text-xs leading-relaxed text-orange-200/85">
                      <strong>Demo Mode:</strong> No real payment will be charged. This simulates a secure checkout flow.
                    </p>
                  </div>

                  <button onClick={confirmPayment} className="btn-green w-full gap-2.5" style={{ padding: '14px', fontSize: '15px' }}>
                    <CreditCard className="w-5 h-5" /> Pay ₹800 & Confirm
                  </button>
                  <p className="text-center text-xs mt-3 text-slate-500">UPI · PhonePe · Google Pay · Credit & Debit Card</p>
                </>
              )}

              {paymentStep === 'processing' && (
                <div className="py-10 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-blue-400/20">
                    <div className="w-10 h-10 rounded-full border-2 animate-spin" style={{ borderColor: 'rgba(255,255,255,0.1)', borderTopColor: '#60a5fa' }} />
                  </div>
                  <h3 className="font-bold text-xl mb-2" style={{ fontFamily: 'Space Grotesk' }}>Processing Payment</h3>
                  <p className="text-sm text-slate-500">Confirming your 7 NENI TURF booking — please wait</p>
                  <div className="flex justify-center gap-1.5 mt-5">
                    {[0, 1, 2].map((item) => (
                      <div key={item} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${item * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {paymentStep === 'done' && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 bg-blue-500/15 border-2 border-blue-400/35"
                  >
                    <CheckCircle className="w-10 h-10 text-blue-300" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk' }}>Booking Confirmed!</h3>
                  <p className="text-sm mb-6 text-slate-500">Your slot is secured. See you at 7 NENI TURF.</p>

                  <div className="rounded-xl p-4 text-left mb-6 space-y-2.5 border border-white/[0.07] bg-white/[0.03]">
                    {[
                      { label: 'Booking Ref', value: bookingRef, highlight: true },
                      { label: 'Sport', value: sport === 'cricket' ? '🏏 Cricket' : '⚽ Football' },
                      { label: 'Date', value: format(selectedDate, 'EEE, d MMM yyyy') },
                      { label: 'Time', value: `${formatTime(selectedSlot.startTime)} – ${formatTime(selectedSlot.endTime)}` },
                      { label: 'Amount Paid', value: '₹800', highlight: true },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between text-sm gap-4">
                        <span className="text-slate-500">{row.label}</span>
                        <span className="font-bold" style={{ color: row.highlight ? '#60a5fa' : '#f1f5f9', fontFamily: row.highlight ? 'monospace' : undefined }}>
                          {row.value}
                        </span>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#05060a]"><div className="flex gap-2">{[0, 1, 2].map((item) => <div key={item} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${item * 0.15}s` }} />)}</div></div>}>
      <BookingContent />
    </Suspense>
  )
}
