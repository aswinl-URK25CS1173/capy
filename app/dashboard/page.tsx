'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { format, addDays, subDays } from 'date-fns'
import { Calendar, Clock, Trophy, ChevronRight, IndianRupee, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { formatTime } from '@/lib/utils'
import Navbar from '@/components/Navbar'

const today = format(new Date(), 'yyyy-MM-dd')

const BOOKINGS = [
  { id:'GF7X2K9A', sport:'cricket',  date:today,                                      start:'07:00', end:'08:00', amount:800, status:'confirmed' },
  { id:'GF3M8P1Q', sport:'football', date:format(addDays(new Date(),1),'yyyy-MM-dd'), start:'06:00', end:'07:00', amount:800, status:'confirmed' },
  { id:'GF5N2R7T', sport:'cricket',  date:format(addDays(new Date(),3),'yyyy-MM-dd'), start:'10:00', end:'11:00', amount:800, status:'confirmed' },
  { id:'GF9C4L6B', sport:'football', date:format(subDays(new Date(),1),'yyyy-MM-dd'), start:'08:00', end:'09:00', amount:800, status:'confirmed' },
  { id:'GF1D8H3Z', sport:'cricket',  date:format(subDays(new Date(),3),'yyyy-MM-dd'), start:'11:00', end:'12:00', amount:800, status:'confirmed' },
  { id:'GF6W5J2V', sport:'football', date:format(subDays(new Date(),5),'yyyy-MM-dd'), start:'17:00', end:'18:00', amount:800, status:'cancelled' },
  { id:'GF4E9Q8N', sport:'cricket',  date:format(subDays(new Date(),7),'yyyy-MM-dd'), start:'09:00', end:'10:00', amount:800, status:'confirmed' },
]

const upcoming  = BOOKINGS.filter(b => b.date >= today && b.status !== 'cancelled')
const history   = BOOKINGS.filter(b => b.date < today  || b.status === 'cancelled')
const totalSpent = BOOKINGS.filter(b => b.status === 'confirmed').reduce((s, b) => s + b.amount, 0)

function BookingCard({ b }: { b: typeof BOOKINGS[0] }) {
  const isCricket = b.sport === 'cricket'
  const dateObj   = new Date(b.date + 'T00:00:00')
  const isUpcoming = b.date >= today

  return (
    <div className="card-hover p-4 sm:p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: isCricket ? 'rgba(245,158,11,0.1)' : 'rgba(34,197,94,0.1)' }}>
        {isCricket ? '🏏' : '⚽'}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="font-semibold capitalize text-sm">{b.sport}</span>
          <span className={b.status === 'confirmed' ? 'pill-confirmed' : 'pill-cancelled'}>
            {b.status === 'confirmed' ? '✓ Confirmed' : '✗ Cancelled'}
          </span>
          {isUpcoming && b.status === 'confirmed' && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', color: '#60a5fa' }}>
              UPCOMING
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap text-xs" style={{ color: '#6b7280' }}>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {format(dateObj, 'EEE, d MMM yyyy')}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {formatTime(b.start)} – {formatTime(b.end)}
          </span>
          <span className="font-mono" style={{ fontSize: 10, color: '#374151' }}>#{b.id}</span>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="font-bold text-base" style={{ fontFamily:'Space Grotesk', color: b.status === 'cancelled' ? '#374151' : '#4ade80', textDecoration: b.status === 'cancelled' ? 'line-through' : 'none' }}>
          ₹{b.amount.toLocaleString('en-IN')}
        </div>
        {b.status === 'confirmed' && isUpcoming && (
          <button className="text-xs mt-1 px-2 py-0.5 rounded-full transition-colors"
            style={{ color: 'rgba(248,113,113,0.5)', border: '1px solid rgba(239,68,68,0.15)' }}>
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [tab, setTab] = useState<'upcoming'|'history'>('upcoming')

  return (
    <div className="min-h-screen" style={{ background: '#05060a', color: '#f1f5f9' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        {/* Header */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1" style={{ fontFamily:'Space Grotesk' }}>
              Welcome back, Arjun
            </h1>
            <p className="text-sm" style={{ color:'#6b7280' }}>Manage your bookings and track your activity</p>
          </div>
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.25)', color:'#4ade80' }}>
            AK
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label:'Total Bookings', value: BOOKINGS.filter(b => b.status==='confirmed').length, color:'#f1f5f9' },
            { label:'Upcoming',       value: upcoming.length,                                      color:'#60a5fa' },
            { label:'Total Spent',    value:`₹${totalSpent.toLocaleString('en-IN')}`,              color:'#4ade80' },
            { label:'Favourite',      value:'🏏 Cricket',                                          color:'#fbbf24' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.07 }}
              className="card p-4">
              <div className="label-upper mb-2">{s.label}</div>
              <div className="text-xl font-bold" style={{ fontFamily:'Space Grotesk', color: s.color }}>{s.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick book CTA */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }}
          className="grad-border p-5 flex items-center justify-between gap-4 mb-8 relative overflow-hidden">
          <div className="absolute right-0 inset-y-0 w-48 pointer-events-none"
            style={{ background: 'linear-gradient(to left, rgba(34,197,94,0.06), transparent)' }} />
          <div>
            <div className="font-bold text-base mb-0.5">Ready for your next game? 🏆</div>
            <p className="text-sm" style={{ color:'#6b7280' }}>Weekend slots are filling up fast</p>
          </div>
          <Link href="/booking" className="flex-shrink-0">
            <button className="btn-green text-sm gap-2" style={{ whiteSpace:'nowrap' }}>
              Book Now <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit mb-5" style={{ background:'rgba(255,255,255,0.04)' }}>
          {(['upcoming','history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 capitalize"
              style={tab === t
                ? { background:'rgba(34,197,94,0.15)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.25)' }
                : { color:'#4b5563', border:'1px solid transparent' }}>
              {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3">
          {(tab === 'upcoming' ? upcoming : history).map((b, i) => (
            <motion.div key={b.id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.06 }}>
              <BookingCard b={b} />
            </motion.div>
          ))}
          {(tab === 'upcoming' ? upcoming : history).length === 0 && (
            <div className="text-center py-20" style={{ color:'#4b5563' }}>
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
