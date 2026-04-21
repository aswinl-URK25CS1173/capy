'use client'

import { useState } from 'react'
import { addDays, format, subDays } from 'date-fns'
import { motion } from 'framer-motion'
import {
  BarChart2,
  CheckCircle,
  Clock,
  Download,
  List,
  Menu,
  RefreshCw,
  Settings,
  Shield,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  X,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatTime } from '@/lib/utils'

const WEEKLY = [
  { day: 'Mon', revenue: 52000, bookings: 65 },
  { day: 'Tue', revenue: 48000, bookings: 60 },
  { day: 'Wed', revenue: 61000, bookings: 76 },
  { day: 'Thu', revenue: 55000, bookings: 69 },
  { day: 'Fri', revenue: 67000, bookings: 84 },
  { day: 'Sat', revenue: 72000, bookings: 90 },
  { day: 'Sun', revenue: 58000, bookings: 73 },
]

const MONTHLY = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => ({
  month,
  revenue: [180000, 210000, 195000, 230000, 215000, 248000, 225000, 260000, 278000, 245000, 290000, 310000][index],
}))

const SPORT_PIE = [
  { name: 'Cricket 🏏', value: 486, color: '#f97316' },
  { name: 'Football ⚽', value: 361, color: '#3b82f6' },
]

const ALL_BOOKINGS = [
  { id: 'NT7X2K9A', name: 'Arjun Krishnamurthy', email: 'arjun@gmail.com', sport: 'cricket', date: format(new Date(), 'yyyy-MM-dd'), start: '07:00', amount: 800, status: 'confirmed' },
  { id: 'NT3M8P1Q', name: 'Priya Raghavendra', email: 'priya@gmail.com', sport: 'football', date: format(new Date(), 'yyyy-MM-dd'), start: '09:00', amount: 800, status: 'confirmed' },
  { id: 'NT5N2R7T', name: 'Karthik Sundarajan', email: 'karthik@gmail.com', sport: 'cricket', date: format(new Date(), 'yyyy-MM-dd'), start: '11:00', amount: 800, status: 'confirmed' },
  { id: 'NT9C4L6B', name: 'Meera Natarajan', email: 'meera@gmail.com', sport: 'football', date: format(addDays(new Date(), 1), 'yyyy-MM-dd'), start: '16:00', amount: 800, status: 'confirmed' },
  { id: 'NT1D8H3Z', name: 'Vikram Subramaniam', email: 'vikram@gmail.com', sport: 'cricket', date: format(subDays(new Date(), 1), 'yyyy-MM-dd'), start: '08:00', amount: 800, status: 'confirmed' },
  { id: 'NT6W5J2V', name: 'Ravi Kumar', email: 'ravi@gmail.com', sport: 'football', date: format(subDays(new Date(), 2), 'yyyy-MM-dd'), start: '14:00', amount: 800, status: 'cancelled' },
  { id: 'NT4E9Q8N', name: 'Sunita Chandrasekhar', email: 'sunita@gmail.com', sport: 'cricket', date: format(addDays(new Date(), 2), 'yyyy-MM-dd'), start: '10:00', amount: 800, status: 'confirmed' },
  { id: 'NT2L7K5R', name: 'Deepak Rajendran', email: 'deepak@gmail.com', sport: 'football', date: format(new Date(), 'yyyy-MM-dd'), start: '18:00', amount: 800, status: 'confirmed' },
]

const TODAY_SCHEDULE = ALL_BOOKINGS.filter((booking) => booking.date === format(new Date(), 'yyyy-MM-dd'))

type Tab = 'overview' | 'bookings' | 'slots' | 'settings'

const NAV_ITEMS: { id: Tab; label: string; icon: typeof BarChart2 }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart2 },
  { id: 'bookings', label: 'Bookings', icon: List },
  { id: 'slots', label: 'Slot Manager', icon: Clock },
  { id: 'settings', label: 'Settings', icon: Settings },
]

type ChartTipProps = {
  active?: boolean
  payload?: Array<{ value?: number }>
  label?: string
}

function ChartTip({ active, payload, label }: ChartTipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-[#181b27] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs shadow-xl">
      <p className="text-slate-400 mb-1">{label}</p>
      <p className="font-bold text-blue-300">₹{Number(payload[0]?.value).toLocaleString('en-IN')}</p>
    </div>
  )
}

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('overview')
  const [chartView, setChartView] = useState<'weekly' | 'monthly'>('weekly')
  const [sportFilter, setSportFilter] = useState<'all' | 'cricket' | 'football'>('all')
  const [turfOpen, setTurfOpen] = useState(true)
  const [blockedHours, setBlockedHours] = useState<number[]>([6, 22])
  const [openTime, setOpenTime] = useState('06:00')
  const [closeTime, setCloseTime] = useState('23:00')
  const [duration, setDuration] = useState(60)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filtered = ALL_BOOKINGS.filter((booking) => sportFilter === 'all' || booking.sport === sportFilter)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1200))
    setSaving(false)
    toast.success('Settings saved! ✓')
  }

  const toggleHour = (hour: number) => {
    setBlockedHours((current) => current.includes(hour) ? current.filter((item) => item !== hour) : [...current, hour])
    toast.success(blockedHours.includes(hour) ? `${hour}:00 Unblocked` : `${hour}:00 Blocked`)
  }

  const kpis = [
    { label: 'Total Bookings', value: '847', sub: '+12% this month', color: 'text-slate-100' },
    { label: "Today's Bookings", value: '12', sub: '4 slots remaining', color: 'text-blue-300' },
    { label: 'Total Revenue', value: '₹6,78,400', sub: 'All time', color: 'text-blue-400' },
    { label: 'Active Users', value: '512', sub: '+28 this week', color: 'text-orange-300' },
  ]
  const revenueChartData = chartView === 'weekly'
    ? WEEKLY.map(({ day, revenue }) => ({ label: day, revenue }))
    : MONTHLY.map(({ month, revenue }) => ({ label: month, revenue }))

  return (
    <div className="min-h-screen bg-bg text-white flex">
      <aside className="hidden lg:flex w-60 flex-col fixed inset-y-0 left-0 bg-[#0c0e15] border-r border-white/[0.06] z-40">
        <div className="p-5 border-b border-white/[0.06]">
          <Link href="/" className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[linear-gradient(135deg,#2563eb,#f97316)] flex items-center justify-center shadow-[0_8px_24px_rgba(37,99,235,0.25)]">
              <span className="text-white font-black text-xs">7★</span>
            </div>
            <div>
              <div className="font-bold text-base text-neni-grad" style={{ fontFamily: 'Space Grotesk' }}>NENI TURF</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-600">Admin Console</div>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 w-fit">
            <Shield className="w-3 h-3 text-blue-300" />
            <span className="text-blue-300 text-[10px] font-bold tracking-widest uppercase">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                tab === item.id ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3">
          <div className="card p-3 text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse" />
              Demo Mode Active
            </div>
            <p className="leading-relaxed">Data is simulated. Connect Supabase to go live.</p>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-60 bg-[#0c0e15] border-r border-white/[0.06] flex flex-col p-4 space-y-1 z-10">
            <button className="absolute top-4 right-4 text-slate-400" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mt-1 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[linear-gradient(135deg,#2563eb,#f97316)] flex items-center justify-center">
                <span className="text-white font-black text-xs">7★</span>
              </div>
              <div>
                <div className="font-bold text-neni-grad" style={{ fontFamily: 'Space Grotesk' }}>NENI TURF</div>
                <div className="text-[10px] uppercase tracking-[0.22em] text-slate-600">Admin</div>
              </div>
            </div>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === item.id ? 'bg-blue-500/10 text-blue-300' : 'text-slate-400 hover:text-white'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="lg:ml-60 flex-1 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-[#0c0e15]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="lg:hidden btn-ghost w-9 h-9 rounded-xl border border-white/[0.08]" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-bold text-sm sm:text-base capitalize">
                {tab === 'overview' ? 'Business Overview' : tab === 'bookings' ? 'Booking Management' : tab === 'slots' ? 'Slot Manager' : 'Turf Settings'}
              </h1>
              <p className="text-slate-500 text-[11px] hidden sm:block">
                {format(new Date(), 'EEEE, d MMMM yyyy')} · 7 NENI TURF, Chennai
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-[11px] font-bold text-blue-300">
              7★
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full">
          {tab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {kpis.map((kpi, index) => (
                  <motion.div key={kpi.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }} className="card p-5">
                    <div className="label-upper mb-2">{kpi.label}</div>
                    <div className={`text-2xl font-bold mb-1 ${kpi.color}`} style={{ fontFamily: 'Space Grotesk' }}>{kpi.value}</div>
                    <div className="text-xs text-blue-300 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {kpi.sub}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="card p-5 sm:p-6">
                <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
                  <div>
                    <h3 className="font-bold text-base">Revenue Analytics</h3>
                    <p className="text-slate-400 text-xs mt-0.5">{chartView === 'weekly' ? 'This week' : 'This year'} · Demo data</p>
                  </div>
                  <div className="flex gap-1 p-1 bg-white/[0.04] rounded-lg">
                    {(['weekly', 'monthly'] as const).map((view) => (
                      <button
                        key={view}
                        onClick={() => setChartView(view)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize ${chartView === view ? 'bg-blue-500/15 text-blue-300' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {view}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="adminRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                    <Tooltip content={<ChartTip />} />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} fill="url(#adminRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-3 gap-5">
                <div className="md:col-span-2 card p-5">
                  <h3 className="font-bold text-sm mb-4">Bookings This Week</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={WEEKLY} barSize={24}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        content={({ active, payload, label }) => active && payload?.length ? (
                          <div className="bg-[#181b27] border border-white/[0.08] rounded-xl px-3 py-2 text-xs">
                            <p className="text-slate-400 mb-0.5">{label}</p>
                            <p className="font-bold text-blue-300">{payload[0]?.value} bookings</p>
                          </div>
                        ) : null}
                      />
                      <Bar dataKey="bookings" fill="#3b82f6" fillOpacity={0.8} radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="card p-5">
                  <h3 className="font-bold text-sm mb-4">Sport Split</h3>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={SPORT_PIE} cx="50%" cy="50%" innerRadius={36} outerRadius={56} paddingAngle={4} dataKey="value">
                        {SPORT_PIE.map((entry) => <Cell key={entry.name} fill={entry.color} fillOpacity={0.9} />)}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value ?? 0} bookings`]} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-1">
                    {SPORT_PIE.map((sport) => (
                      <div key={sport.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: sport.color }} />
                          <span className="text-slate-400">{sport.name}</span>
                        </div>
                        <span className="font-bold">{sport.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm">Today&apos;s Schedule</h3>
                  <span className="text-xs text-slate-500">{TODAY_SCHEDULE.length} bookings</span>
                </div>
                <div className="space-y-2">
                  {TODAY_SCHEDULE.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
                      <div className="text-xl w-8 text-center">{booking.sport === 'cricket' ? '🏏' : '⚽'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{booking.name}</div>
                        <div className="text-slate-500 text-xs">{formatTime(booking.start)}</div>
                      </div>
                      <div className="text-[10px]"><span className="pill-confirmed">Confirmed</span></div>
                      <div className="font-bold text-blue-300 text-sm" style={{ fontFamily: 'Space Grotesk' }}>
                        ₹{booking.amount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'bookings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex gap-1 p-1 bg-white/[0.04] rounded-lg">
                  {(['all', 'cricket', 'football'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSportFilter(filter)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${sportFilter === filter ? 'bg-blue-500/15 text-blue-300' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      {filter === 'all' ? 'All' : filter === 'cricket' ? '🏏 Cricket' : '⚽ Football'}
                    </button>
                  ))}
                </div>
                <button className="btn-ghost text-xs border border-white/[0.08] px-3 py-1.5 rounded-lg gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
                <span className="text-slate-500 text-xs ml-auto">{filtered.length} records</span>
              </div>

              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        {['Booking ID', 'Customer', 'Sport', 'Date', 'Time', 'Amount', 'Status', 'Action'].map((heading) => (
                          <th key={heading} className="text-left label-upper px-4 py-3 whitespace-nowrap">{heading}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((booking, index) => (
                        <motion.tr key={booking.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 py-3 font-mono text-[11px] text-blue-300 font-bold">{booking.id}</td>
                          <td className="px-4 py-3">
                            <div className="font-medium text-sm whitespace-nowrap">{booking.name}</div>
                            <div className="text-slate-500 text-[11px]">{booking.email}</div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={booking.sport === 'cricket' ? 'badge-cricket' : 'badge-football'}>
                              {booking.sport === 'cricket' ? '🏏 Cricket' : '⚽ Football'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{format(new Date(`${booking.date}T00:00:00`), 'd MMM yyyy')}</td>
                          <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">{formatTime(booking.start)}</td>
                          <td className="px-4 py-3 font-bold text-blue-300 text-sm" style={{ fontFamily: 'Space Grotesk' }}>
                            ₹{booking.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            <span className={booking.status === 'confirmed' ? 'pill-confirmed' : 'pill-cancelled'}>{booking.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            {booking.status === 'confirmed' && (
                              <button onClick={() => toast.error('Confirmation required to cancel')} className="text-[11px] text-red-400/60 hover:text-red-400 border border-red-500/15 hover:border-red-500/30 px-2 py-0.5 rounded-full transition-colors">
                                Cancel
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'slots' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 max-w-2xl">
              <div className="card p-5">
                <h3 className="font-bold text-sm mb-1">Turf Status</h3>
                <p className="text-slate-400 text-xs mb-4">Enable or disable all bookings</p>
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
                  <div>
                    <div className="font-semibold text-sm">7 NENI TURF · Cricket / Football</div>
                    <div className={`text-xs mt-0.5 font-semibold ${turfOpen ? 'text-blue-300' : 'text-red-400'}`}>
                      {turfOpen ? '● Live – Bookings Open' : '● Closed – No Bookings'}
                    </div>
                  </div>
                  <button onClick={() => { setTurfOpen(!turfOpen); toast.success(turfOpen ? 'Turf closed' : 'Turf opened!') }} className="transition-all duration-200 hover:scale-105">
                    {turfOpen ? <ToggleRight className="w-12 h-8 text-blue-300" /> : <ToggleLeft className="w-12 h-8 text-slate-600" />}
                  </button>
                </div>
              </div>

              <div className="card p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-sm">Slot Block Manager</h3>
                  <button onClick={() => { setBlockedHours([6, 22]); toast.success('Reset to default') }} className="btn-ghost text-[11px] gap-1">
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>
                <p className="text-slate-400 text-xs mb-4">Click any slot to toggle its status</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {Array.from({ length: 17 }, (_, index) => index + 6).map((hour) => {
                    const isBlocked = blockedHours.includes(hour)
                    const label = `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
                    return (
                      <button
                        key={hour}
                        onClick={() => toggleHour(hour)}
                        className={`p-3 rounded-xl border-2 text-center transition-all duration-150 ${isBlocked ? 'border-red-500/35 bg-red-500/10 text-red-400 hover:bg-red-500/15' : 'border-blue-500/30 bg-blue-500/[0.07] text-blue-300 hover:bg-blue-500/15'}`}
                      >
                        <div className="text-base mb-0.5">{isBlocked ? '🔒' : '✓'}</div>
                        <div className="font-bold text-xs">{label}</div>
                        <div className="text-[9px] opacity-70 mt-0.5">{isBlocked ? 'Blocked' : 'Open'}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-sm mb-4">Today&apos;s Utilization</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Total slots', value: 17 },
                    { label: 'Booked', value: 8, color: 'text-blue-300' },
                    { label: 'Available', value: 7, color: 'text-orange-300' },
                    { label: 'Blocked', value: blockedHours.length, color: 'text-slate-500' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between">
                      <span className="text-slate-400">{row.label}</span>
                      <span className={`font-bold ${row.color || ''}`}>{row.value}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/[0.06]">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">Utilization Rate</span>
                      <span className="font-bold text-blue-300">47%</span>
                    </div>
                    <div className="h-2 bg-white/[0.07] rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500 bg-[linear-gradient(90deg,#2563eb,#f97316)]" style={{ width: '47%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 max-w-xl">
              <div className="card p-5">
                <h3 className="font-bold text-sm mb-1">Opening Hours</h3>
                <p className="text-slate-400 text-xs mb-4">Set when your turf accepts bookings</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Opening Time', value: openTime, setter: setOpenTime },
                    { label: 'Closing Time', value: closeTime, setter: setCloseTime },
                  ].map((field) => (
                    <div key={field.label}>
                      <div className="label-upper mb-2">{field.label}</div>
                      <input type="time" value={field.value} onChange={(event) => field.setter(event.target.value)} className="input-dark" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-sm mb-1">Slot Duration</h3>
                <p className="text-slate-400 text-xs mb-4">How long is each bookable slot?</p>
                <div className="grid grid-cols-4 gap-2.5">
                  {[30, 60, 90, 120].map((minutes) => (
                    <button
                      key={minutes}
                      onClick={() => setDuration(minutes)}
                      className={`py-3 rounded-xl border-2 text-center transition-all duration-150 ${duration === minutes ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-white/[0.07] text-slate-400 hover:border-white/20'}`}
                    >
                      <div className="font-bold text-sm">{minutes} min</div>
                      <div className="text-[10px] opacity-60">{minutes < 60 ? '½ hr' : `${minutes / 60} hr`}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-sm mb-1">Pricing</h3>
                <p className="text-slate-400 text-xs mb-4">Per hour rate, GST included</p>
                <div className="space-y-4">
                  {[{ emoji: '🏏', label: 'Cricket' }, { emoji: '⚽', label: 'Football' }].map((sport) => (
                    <div key={sport.label} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span className="text-xl">{sport.emoji}</span> {sport.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold">₹</span>
                        <input type="number" defaultValue={800} className="w-24 input-dark text-right text-sm py-2" />
                        <span className="text-slate-500 text-sm">/hr</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-5">
                <h3 className="font-bold text-sm mb-3">Payment Gateway</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Stripe Status', value: '✓ Connected (Test Mode)', active: true },
                    { label: 'Webhook', value: '✓ Active', active: true },
                    { label: 'UPI Enabled', value: '✓ PhonePe / GPay / Paytm', active: true },
                    { label: 'Currency', value: 'INR (Indian Rupee ₹)' },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
                      <span className="text-slate-400">{row.label}</span>
                      <span className={`font-semibold text-xs ${row.active ? 'text-blue-300' : 'text-slate-300'}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleSave} disabled={saving} className="btn-green w-full py-3.5 text-base gap-2.5">
                {saving ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> Save Settings</>}
              </button>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
