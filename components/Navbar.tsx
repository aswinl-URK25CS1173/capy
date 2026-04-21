'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/#about',    label: 'Facilities' },
  { href: '/booking',   label: 'Book Now' },
  { href: '/dashboard', label: 'My Bookings' },
  { href: '/admin',     label: 'Admin' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={scrolled ? {
        background: 'rgba(5,6,10,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 24px rgba(0,0,0,0.5)',
      } : {}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)', boxShadow: '0 2px 12px rgba(34,197,94,0.3)' }}>
            <span className="text-black font-black text-sm">GF</span>
          </div>
          <span className="font-bold text-lg text-green-grad" style={{ fontFamily: 'Space Grotesk' }}>GreenField</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}>
              <span className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => { (e.target as HTMLElement).style.color = '#fff'; (e.target as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { (e.target as HTMLElement).style.color = '#94a3b8'; (e.target as HTMLElement).style.background = 'transparent' }}>
                {l.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard">
            <span className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all"
              style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)' }}>
              Sign In
            </span>
          </Link>
          <Link href="/booking">
            <button className="btn-green text-sm" style={{ padding: '8px 20px' }}>Book a Slot</button>
          </Link>
        </div>

        <button className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
          style={{ border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}
          onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="md:hidden px-5 py-4 flex flex-col gap-1"
            style={{ background: 'rgba(12,14,21,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}>
                <span className="block px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all"
                  style={{ color: '#94a3b8' }}>
                  {l.label}
                </span>
              </Link>
            ))}
            <Link href="/booking" onClick={() => setMobileOpen(false)}>
              <button className="btn-green w-full mt-3">Book a Slot</button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
