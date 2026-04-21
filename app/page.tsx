'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Clock, Star, ChevronRight, Phone,
  Zap, Shield, Trophy, ArrowRight,
  Calendar, Users, Wifi, Moon, CheckCircle, TrendingUp
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false })

const heroImages = [
  'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1400&q=80',
  'https://images.unsplash.com/photo-1431324155629-1a6dae1434a6?w=1400&q=80',
  'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1400&q=80',
]

const stats = [
  { value: '847+',   label: 'Total Bookings',    sub: 'All time' },
  { value: '₹6.78L', label: 'Revenue Generated', sub: 'This year' },
  { value: '4.9 ★',  label: 'Average Rating',    sub: 'On Google' },
  { value: '500+',   label: 'Happy Players',      sub: 'Monthly active' },
]

const features = [
  {
    icon: Zap, title: 'Instant Booking', sub: 'Book in under 60 seconds',
    desc: 'No phone calls, no waiting. Pick your slot, pay online, and get confirmed immediately.',
    colorClass: 'from-amber-500/20 to-yellow-500/10', border: 'rgba(245,158,11,0.2)',
    iconBg: 'rgba(245,158,11,0.1)', iconColor: '#fbbf24',
  },
  {
    icon: Shield, title: 'Secure Payments', sub: 'UPI · Card · Net Banking',
    desc: 'Bank-grade security via Stripe. UPI, PhonePe, Google Pay, Credit & Debit cards accepted.',
    colorClass: 'from-blue-500/20 to-cyan-500/10', border: 'rgba(59,130,246,0.2)',
    iconBg: 'rgba(59,130,246,0.1)', iconColor: '#60a5fa',
  },
  {
    icon: Wifi, title: 'Live Availability', sub: 'Real-time slot updates',
    desc: 'See exactly which slots are open right now. No double bookings — ever.',
    colorClass: 'from-green-500/20 to-emerald-500/10', border: 'rgba(34,197,94,0.2)',
    iconBg: 'rgba(34,197,94,0.1)', iconColor: '#4ade80',
  },
  {
    icon: Moon, title: 'Floodlit Nights', sub: 'Open until 11 PM',
    desc: 'Play morning to night with full floodlights. Free parking and changing rooms included.',
    colorClass: 'from-purple-500/20 to-violet-500/10', border: 'rgba(139,92,246,0.2)',
    iconBg: 'rgba(139,92,246,0.1)', iconColor: '#a78bfa',
  },
]

const testimonials = [
  {
    name: 'Arjun Krishnamurthy', role: 'Cricket Captain, Chennai CC', avatar: 'AK',
    text: 'Best cricket turf in Chennai, hands down. The online booking is incredibly smooth — confirmed in under 2 minutes. We book every weekend.',
    rating: 5, sport: 'cricket',
  },
  {
    name: 'Priya Raghavendra', role: 'Football Coach, FC Madras', avatar: 'PR',
    text: 'The pitch quality is FIFA-standard and the booking system is so professional. No more chasing on WhatsApp — just book and show up.',
    rating: 5, sport: 'football',
  },
  {
    name: 'Karthik Sundarajan', role: 'Sports Enthusiast, T. Nagar', avatar: 'KS',
    text: 'Finally a turf with a proper booking system. The slot grid makes it dead simple to see what\'s available. Highly recommended.',
    rating: 5, sport: 'cricket',
  },
]

const howSteps = [
  { n: '01', icon: Calendar,     title: 'Pick Date & Sport', desc: 'Choose Cricket or Football and select a date from the live calendar.' },
  { n: '02', icon: Clock,        title: 'Select a Time Slot', desc: 'See real-time availability — green slots are open, red are taken.' },
  { n: '03', icon: CheckCircle,  title: 'Pay & Get Confirmed', desc: 'Pay securely via UPI or Card. Instant confirmation to your phone.' },
]

export default function LandingPage() {
  const [imgIdx, setImgIdx] = useState(0)
  const [testimonialIdx, setTestimonialIdx] = useState(0)

  useEffect(() => {
    const t1 = setInterval(() => setImgIdx(i => (i + 1) % heroImages.length), 4500)
    const t2 = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 4000)
    return () => { clearInterval(t1); clearInterval(t2) }
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#05060a', color: '#f1f5f9' }}>
      <Navbar />

      {/* ─── HERO ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <ThreeBackground variant="hero" />

        <div className="absolute inset-0 z-0">
          {heroImages.map((img, i) => (
            <motion.div
              key={i} className="absolute inset-0"
              animate={{ opacity: i === imgIdx ? 1 : 0 }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #05060a 0%, rgba(5,6,10,0.8) 50%, rgba(5,6,10,0.3) 100%)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #05060a 0%, transparent 60%)' }} />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-20 w-full">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
              style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4ade80' }}>Live · Slots Available Now</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="font-bold leading-tight mb-6"
              style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', letterSpacing: '-0.03em' }}
            >
              Play Hard.<br />
              <span className="text-green-grad">Book Smarter.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{ color: '#94a3b8' }}
            >
              Chennai's premier Cricket & Football turf. Book your slot in real-time, 
              pay securely, and step onto world-class ground — all in 60 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <Link href="/booking">
                <button className="btn-green gap-2 group" style={{ padding: '12px 32px', fontSize: '15px' }}>
                  Book a Slot
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="#about">
                <button className="btn-outline" style={{ padding: '12px 28px', fontSize: '15px' }}>
                  View Facilities
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-3"
            >
              {[
                { emoji: '🏏', sport: 'Cricket', price: '₹800 / hr', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', color: '#fbbf24' },
                { emoji: '⚽', sport: 'Football', price: '₹800 / hr', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', color: '#4ade80' },
              ].map(p => (
                <div key={p.sport} className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
                  style={{ background: p.bg, border: `1px solid ${p.border}` }}>
                  <span className="text-2xl">{p.emoji}</span>
                  <div>
                    <div className="font-bold text-sm" style={{ color: p.color }}>{p.sport}</div>
                    <div className="text-xs" style={{ color: '#6b7280' }}>{p.price}</div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <MapPin className="w-4 h-4" style={{ color: '#6b7280' }} />
                <span className="text-sm" style={{ color: '#94a3b8' }}>Anna Nagar, Chennai</span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {heroImages.map((_, i) => (
            <button key={i} onClick={() => setImgIdx(i)}
              className="h-1 rounded-full transition-all duration-300"
              style={{ width: i === imgIdx ? '32px' : '8px', background: i === imgIdx ? '#4ade80' : 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────── */}
      <section style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0c0e15' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: '1px', background: 'rgba(255,255,255,0.06)' }}>
            {stats.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="px-8 py-6 text-center" style={{ background: '#0c0e15' }}
              >
                <div className="text-green-grad font-bold mb-1" style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.4rem, 3vw, 1.9rem)' }}>{s.value}</div>
                <div className="font-semibold text-sm text-white/90">{s.label}</div>
                <div className="text-xs mt-0.5" style={{ color: '#4b5563' }}>{s.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─────────────────────────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6" id="about">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="label-upper mb-3">Why GreenField?</div>
          <h2 className="font-bold mb-4" style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Everything You Need,<br /><span className="text-green-grad">In One Place</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: '#94a3b8' }}>
            The smoothest turf booking experience in Chennai — built for players, by players.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-200"
              style={{ background: `linear-gradient(135deg, ${f.colorClass.replace('from-','').replace(' to-','')})`,
                       border: `1px solid ${f.border}`,
                       backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))` }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                style={{ background: f.iconBg }}>
                <f.icon className="w-5 h-5" style={{ color: f.iconColor }} />
              </div>
              <div className="font-bold text-base mb-0.5 text-white">{f.title}</div>
              <div className="text-xs font-medium mb-3" style={{ color: '#4b5563' }}>{f.sub}</div>
              <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SPORTS SECTION ───────────────────────────── */}
      <section className="py-4 pb-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="font-bold mb-3" style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Choose Your Sport
          </h2>
          <p style={{ color: '#94a3b8' }}>World-class surfaces, professional setup</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              sport: 'cricket', emoji: '🏏',
              img: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
              label: 'Cricket Turf', sub: 'Net practice, T20 matches, Tournaments',
              tags: ['Batting Nets', 'Bowling Crease', 'Floodlights', 'Score Display'],
              accent: '#f59e0b',
            },
            {
              sport: 'football', emoji: '⚽',
              img: 'https://images.unsplash.com/photo-1431324155629-1a6dae1434a6?w=800&q=80',
              label: 'Football Turf', sub: '5-a-side, 7-a-side, Training sessions',
              tags: ['FIFA Grass', 'Goal Posts', 'Changing Room', 'Water Station'],
              accent: '#22c55e',
            },
          ].map((c, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: i === 0 ? -24 : 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
            >
              <div className="relative h-80">
                <img src={c.img} alt={c.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #05060a 0%, rgba(5,6,10,0.5) 50%, transparent 100%)' }} />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-4xl mb-2">{c.emoji}</div>
                <h3 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Space Grotesk' }}>{c.label}</h3>
                <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>{c.sub}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {c.tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.12)', color: '#d1d5db' }}>
                      ✓ {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xl" style={{ color: c.accent }}>₹800</span>
                    <span className="text-sm ml-1" style={{ color: '#6b7280' }}>/ hour</span>
                  </div>
                  <Link href={`/booking?sport=${c.sport}`}>
                    <button className="btn-green text-sm gap-2">
                      Book {c.label} <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─────────────────────────────── */}
      <section className="py-24" style={{ background: '#0c0e15', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-bold mb-3" style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Book in 3 Steps</h2>
            <p style={{ color: '#94a3b8' }}>Simple, fast, no friction</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px"
              style={{ background: 'linear-gradient(to right, transparent, rgba(34,197,94,0.3), transparent)' }} />
            {howSteps.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="text-center"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.22)' }}>
                    <s.icon className="w-8 h-8" style={{ color: 'rgba(74,222,128,0.7)' }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#22c55e', color: '#000' }}>{i + 1}</div>
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-14">
            <Link href="/booking">
              <button className="btn-green gap-2.5" style={{ padding: '14px 40px', fontSize: '15px' }}>
                Start Booking <ChevronRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="font-bold" style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            What Players Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="grad-border p-6 transition-all duration-200 hover:scale-[1.02]"
              style={{ outline: i === testimonialIdx ? '1px solid rgba(34,197,94,0.3)' : 'none' }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5 italic" style={{ color: '#94a3b8' }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: t.sport === 'cricket' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)',
                    color: t.sport === 'cricket' ? '#fbbf24' : '#4ade80',
                  }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs" style={{ color: '#4b5563' }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── LOCATION ─────────────────────────────────── */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grad-border p-6 sm:p-10 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="label-upper mb-3">Our Location</div>
              <h2 className="font-bold mb-5" style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}>
                Find Us Here
              </h2>
              <p className="leading-relaxed mb-8" style={{ color: '#94a3b8' }}>
                Centrally located in Anna Nagar with ample parking space.
                Easy access from all major areas of Chennai.
              </p>
              <div className="space-y-5">
                {[
                  { Icon: MapPin, label: 'Address', value: '14, 4th Ave, Anna Nagar West, Chennai – 600040' },
                  { Icon: Clock,  label: 'Hours',   value: '6:00 AM – 11:00 PM · Monday to Sunday' },
                  { Icon: Phone,  label: 'Contact', value: '+91 98765 43210 · WhatsApp available' },
                ].map(({ Icon, label, value }) => (
                  <div key={label} className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(34,197,94,0.1)' }}>
                      <Icon className="w-4 h-4" style={{ color: '#4ade80' }} />
                    </div>
                    <div>
                      <div className="label-upper mb-0.5">{label}</div>
                      <div className="text-sm" style={{ color: '#94a3b8' }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-72 rounded-2xl overflow-hidden"
              style={{ background: '#0c0e15', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="absolute inset-0 opacity-25"
                style={{ backgroundImage: 'radial-gradient(circle, rgba(34,197,94,0.5) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(16,50,30,0.5), transparent)' }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="anim-float">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                    <MapPin className="w-7 h-7" style={{ color: '#4ade80' }} />
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-sm mb-1">GreenField Sports Arena</div>
                  <div className="text-xs" style={{ color: '#6b7280' }}>Anna Nagar, Chennai 600040</div>
                </div>
                <a href="https://maps.google.com/?q=Anna+Nagar+Chennai" target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
                  style={{ color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }}>
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────── */}
      <section className="py-28 relative overflow-hidden">
        <ThreeBackground variant="booking" />
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{ background: 'linear-gradient(to bottom, #05060a, rgba(5,6,10,0.5), #05060a)' }} />
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="rounded-full" style={{ width: 600, height: 600, background: 'rgba(34,197,94,0.05)', filter: 'blur(80px)' }} />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="label-upper mb-4">Ready to Play?</div>
            <h2 className="font-bold mb-6" style={{ fontFamily: 'Space Grotesk', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
              Book Your Slot <span className="text-green-grad">Today.</span>
            </h2>
            <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: '#94a3b8' }}>
              Join 500+ players who book with GreenField every month.
              Secure your slot before it's gone.
            </p>
            <Link href="/booking">
              <button className="btn-green gap-3" style={{ padding: '16px 48px', fontSize: '17px' }}>
                Book a Slot <ChevronRight className="w-6 h-6" />
              </button>
            </Link>
            <div className="mt-6 text-sm flex flex-wrap justify-center gap-4" style={{ color: '#4b5563' }}>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-600" /> No registration required</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-600" /> Instant confirmation</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-green-600" /> Easy cancellation</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#0c0e15' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>
                  <span className="text-black font-black text-sm">GF</span>
                </div>
                <span className="font-bold text-lg text-green-grad" style={{ fontFamily: 'Space Grotesk' }}>GreenField</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#6b7280' }}>
                Chennai's premium Cricket & Football turf booking platform.
                Your game, our commitment.
              </p>
            </div>
            <div>
              <div className="label-upper mb-4">Quick Links</div>
              <div className="space-y-2">
                {[['/', 'Home'], ['/booking', 'Book Now'], ['/dashboard', 'My Bookings'], ['/admin', 'Admin Panel']].map(([href, label]) => (
                  <Link key={href} href={href}>
                    <div className="text-sm transition-colors cursor-pointer hover:text-green-400" style={{ color: '#6b7280' }}>{label}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="label-upper mb-4">Contact</div>
              <div className="space-y-2 text-sm" style={{ color: '#6b7280' }}>
                <div>🏏 Cricket — ₹800/hr</div>
                <div>⚽ Football — ₹800/hr</div>
                <div className="mt-3">📍 Anna Nagar, Chennai</div>
                <div>📞 +91 98765 43210</div>
                <div>✉️ play@greenfield.in</div>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: '#374151' }}>
            <div>© 2025 GreenField Sports Arena Pvt. Ltd. · All rights reserved.</div>
            <div className="flex gap-6">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
              <span style={{ color: '#1f2937' }}>GST: 33ABCDE1234F1Z5</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
