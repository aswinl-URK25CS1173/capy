'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { addDays, format, subDays } from 'date-fns'
import { Calendar, ChevronRight, Clock } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { formatTime } from '@/lib/utils'

const today = format(new Date(), 'yyyy-MM-dd')

const BOOKINGS = [
  { id: 'NT7X2K9A', sport: 'cricket', date: today, start: '07:00', end: '08:00', amount: 800, status: 'confirmed' },
  { id: 'NT3M8P1Q', sport: 'football', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), start: '06:00', end: '07:00', amount: 800, status: 'confirmed' },
  { id: 'NT5N2R7T', sport: 'cricket', date: format(addDays(new Date(), 3), 'yyyy-MM-dd'), start: '10:00', end: '11:00', amount: 800, status: 'confirmed' },
  { id: 'NT9C4L6B', sport: 'football', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), start: '08:00', end: '09:00', amount: 800, status: 'confirmed' },
  { id: 'NT1D8H3Z', sport: 'cricket', date: format(subDays(new Date(), 3), 'yyyy-MM-dd'), start: '11:00', end: '12:00', amount: 800, status: 'confirmed' },
  { id: 'NT6W5J2V', sport: 'football', date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), start: '17:00', end: '18:00', amount: 800, status: 'cancelled' },
  { id: 'NT4E9Q8N', sport: 'cricket', date: format(subDays(new Date(), 7), 'yyyy-MM-dd'), start: '09:00', end: '10:00', amount: 800, status: 'confirmed' },
]

const upcoming = BOOKINGS.filter((booking) => booking.date >= today && booking.status !== 'cancelled')
const history = BOOKINGS.filter((booking) => booking.date < today || booking.status === 'cancelled')
const totalSpent = BOOKINGS.filter((booking) => booking.status === 'confirmed').reduce((sum, booking) => sum + booking.amount, 0)

function BookingCard({ booking }: { booking: typeof BOOKINGS[number] }) {
  const isCricket = booking.sport === 'cricket'
  const dateObject = new Date(`${booking.date}T00:00:00`)
  const isUpcoming = booking.date >= today
  const accent = isCricket ? '#fb923c' : '#60a5fa'
  const accentBg = isCricket ? 'rgba(249,115,22,0.12)' : 'rgba(37,99,235,0.12)'

  return (
    <div className="card-hover p-4 sm:p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: accentBg }}>
        {isCricket ? '🏏' : '⚽'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-semibold capitalize text-sm">{booking.sport}</span>
          <span className={booking.status === 'confirmed' ? 'pill-confirmed' : 'pill-cancelled'}>
            {booking.status === 'confirmed' ? '✓ Confirmed' : '✗ Cancelled'}
          </span>
          {isUpcoming && booking.status === 'confirmed' && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold border border-blue-400/20 bg-blue-500/10 text-blue-300">
              UPCOMING
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {format(dateObject, 'EEE, d MMM yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatTime(booking.start)} – {formatTime(booking.end)}
          </span>
          <span className="font-mono text-[10px] text-slate-700">#{booking.id}</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-bold text-base" style={{ fontFamily: 'Space Grotesk', color: booking.status === 'cancelled' ? '#475569' : accent, textDecoration: booking.status === 'cancelled' ? 'line-through' : 'none' }}>
          ₹{booking.amount.toLocaleString('en-IN')}
        </div>
        {booking.status === 'confirmed' && isUpcoming && (
          <button className="text-xs mt-1 px-2 py-0.5 rounded-full transition-colors text-red-300/60 border border-red-500/15 hover:text-red-300 hover:border-red-500/30">
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [tab, setTab] = useState<'upcoming' | 'history'>('upcoming')

  return (
    <div className="min-h-screen bg-[#05060a] text-slate-100">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk' }}>
              Welcome back to <span className="text-neni-grad">7 NENI TURF</span>
            </h1>
            <p className="text-sm text-slate-500">Manage bookings, track match history, and jump back into your next game faster.</p>
          </div>
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm border border-blue-400/20 bg-blue-500/10 text-blue-300">
            AK
          </div>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total Bookings', value: BOOKINGS.filter((booking) => booking.status === 'confirmed').length, color: '#f1f5f9' },
            { label: 'Upcoming', value: upcoming.length, color: '#60a5fa' },
            { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, color: '#3b82f6' },
            { label: 'Favourite', value: '🏏 Cricket', color: '#fb923c' },
          ].map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }} className="card p-4">
              <div className="label-upper mb-2">{stat.label}</div>
              <div className="text-xl font-bold" style={{ fontFamily: 'Space Grotesk', color: stat.color }}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="grad-border p-5 flex items-center justify-between gap-4 mb-8 relative overflow-hidden">
          <div className="absolute right-0 inset-y-0 w-56 pointer-events-none bg-[linear-gradient(to_left,rgba(37,99,235,0.14),rgba(249,115,22,0.1),transparent)]" />
          <div>
            <div className="font-bold text-base mb-0.5">Ready for your next game? 🏆</div>
            <p className="text-sm text-slate-500">Weekend slots at 7 NENI TURF are filling up fast.</p>
          </div>
          <Link href="/booking" className="flex-shrink-0">
            <button className="btn-green text-sm gap-2 whitespace-nowrap">
              Book Now <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>

        <div className="flex gap-1 p-1 rounded-xl w-fit mb-5 bg-white/[0.04] border border-white/[0.05]">
          {(['upcoming', 'history'] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize"
              style={tab === item ? { background: 'rgba(37,99,235,0.16)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.22)' } : { color: '#64748b', border: '1px solid transparent' }}
            >
              {item === 'upcoming' ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {(tab === 'upcoming' ? upcoming : history).map((booking, index) => (
            <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <BookingCard booking={booking} />
            </motion.div>
          ))}
          {(tab === 'upcoming' ? upcoming : history).length === 0 && (
            <div className="text-center py-20 text-slate-600">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-25" />
              <p className="text-lg font-medium mb-1">No {tab} bookings</p>
              {tab === 'upcoming' && (
                <Link href="/booking">
                  <button className="btn-green mt-5 text-sm">Make Your First Booking</button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
