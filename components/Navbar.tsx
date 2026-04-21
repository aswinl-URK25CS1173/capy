'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Sparkles } from 'lucide-react'

const links = [
  { href: '/#facilities', label: 'Facilities' },
  { href: '/booking', label: 'Book Now' },
  { href: '/dashboard', label: 'My Bookings' },
  { href: '/admin', label: 'Admin' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(5,6,10,0.88)',
        backdropFilter: 'blur(22px)',
        borderBottom: '1px solid rgba(148,163,184,0.12)',
        boxShadow: '0 14px 40px rgba(2,6,23,0.55)',
      } : {}}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 min-h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg,#2563eb,#f97316)',
              boxShadow: '0 2px 12px rgba(37,99,235,0.3)',
            }}
          >
            <span className="text-white font-black text-sm">7★</span>
          </div>
          <div className="leading-none">
            <span className="font-bold text-lg text-neni-grad block" style={{ fontFamily: 'Space Grotesk' }}>
              NENI TURF
            </span>
            <span className="hidden sm:block text-[10px] uppercase tracking-[0.28em] text-slate-500">
              Chennai Premier Turf
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1 rounded-full px-2 py-1 border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer"
                style={{ color: '#94a3b8' }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLElement
                  target.style.color = '#e2e8f0'
                  target.style.background = 'rgba(37,99,235,0.12)'
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLElement
                  target.style.color = '#94a3b8'
                  target.style.background = 'transparent'
                }}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <span
              className="px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all inline-flex items-center gap-2"
              style={{ color: '#cbd5e1', border: '1px solid rgba(148,163,184,0.18)', background: 'rgba(255,255,255,0.02)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#60a5fa' }} />
              Sign In
            </span>
          </Link>
          <Link href="/booking">
            <button className="btn-green text-sm" style={{ padding: '10px 22px', borderRadius: '999px' }}>
              Book a Slot
            </button>
          </Link>
        </div>

        <button
          className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
          style={{
            border: '1px solid rgba(148,163,184,0.14)',
            color: mobileOpen ? '#f8fafc' : '#94a3b8',
            background: mobileOpen ? 'rgba(37,99,235,0.1)' : 'rgba(255,255,255,0.02)',
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden px-4 pb-4"
          >
            <div
              className="rounded-3xl p-4 flex flex-col gap-2"
              style={{
                background: 'rgba(12,14,21,0.96)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(148,163,184,0.12)',
                boxShadow: '0 18px 50px rgba(2,6,23,0.45)',
              }}
            >
              {links.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <span
                    className="block px-4 py-3 rounded-2xl text-sm font-medium cursor-pointer transition-all"
                    style={{ color: '#cbd5e1', background: 'rgba(255,255,255,0.02)' }}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
              <Link href="/booking" onClick={() => setMobileOpen(false)}>
                <button className="btn-green w-full mt-2">Book a Slot</button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
