'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import dynamic from 'next/dynamic'

const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false })

const heroWords = [
  { text: 'book turf', color: '#60a5fa' },
  { text: 'play cricket', color: '#3b82f6' },
  { text: 'play football', color: '#fb923c' },
]

const stats = [
  { value: '847+', label: 'Matches Hosted', sub: 'Cricket + Football' },
  { value: '4.9★', label: 'Champion Rating', sub: 'Players love the vibe' },
  { value: '16 Hrs', label: 'Open Daily', sub: 'From sunrise to floodlights' },
  { value: '500+', label: 'Monthly Players', sub: 'Weekend peak energy' },
]

const featureSections = [
  {
    eyebrow: 'Daily availability',
    title: 'A Game Always Ready for You',
    description: 'Cricket and football slots stay live every day at 7 NENI TURF. From sunrise practice sessions to floodlit evening face-offs, your next match is always a few taps away.',
    points: ['Dual-sport booking in one venue', 'Prime-time evening slots every day', 'Live availability and instant confirmation'],
    image: '/images/neni-turf-poster.jpeg',
    accent: 'linear-gradient(135deg, rgba(37,99,235,0.26), rgba(59,130,246,0.06))',
    glow: 'rgba(59,130,246,0.28)',
  },
  {
    eyebrow: 'Premium experience',
    title: 'World-Class Turf, Zero Hassle',
    description: 'The booking flow stays fast, the facility stays match-ready, and the atmosphere stays premium. Professional setup, secure payments, and no back-and-forth over WhatsApp.',
    points: ['Instant digital booking flow', 'Secure UPI and card payments', 'Changing rooms, parking, and floodlights'],
    image: '/images/neni-turf-neon-sign.jpeg',
    accent: 'linear-gradient(135deg, rgba(249,115,22,0.24), rgba(249,115,22,0.04))',
    glow: 'rgba(251,146,60,0.28)',
  },
  {
    eyebrow: 'Champion atmosphere',
    title: 'Play with Champions',
    description: 'Every frame of the 7 NENI TURF brand is built around elite sporting energy. Dhoni calm, Ronaldo fire, Messi magic, and big-match lights shape a venue made for statement performances.',
    points: ['High-intensity football nights', 'Focused cricket strategy sessions', 'A turf built to feel larger than life'],
    image: '/images/neni-turf-poster.jpeg',
    accent: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(249,115,22,0.18))',
    glow: 'rgba(249,115,22,0.24)',
  },
]

const sportCards = [
  {
    sport: 'Cricket',
    href: '/booking?sport=cricket',
    accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.22)',
    strap: 'Strategy · Calm · Victory',
    title: 'Command the crease under blue neon.',
    description: 'From practice nets to team fixtures, 7 NENI TURF gives cricket sessions a premium arena feel with controlled pace, clear booking windows, and match-night focus.',
    quote: 'Play Where Champions Are Made',
    emoji: '🏏',
  },
  {
    sport: 'Football',
    href: '/booking?sport=football',
    accent: '#f97316',
    glow: 'rgba(249,115,22,0.22)',
    strap: 'Passion · Power · Glory',
    title: 'Bring fire to every attacking move.',
    description: 'Fast 5-a-side and 7-a-side football feels electric here. Big energy, instant bookings, and a venue identity that looks built for clutch goals and rivalry nights.',
    quote: 'Where Legends Compete, Champions Are Made',
    emoji: '⚽',
  },
]

const galleryCards = [
  {
    title: 'Hero Poster Wall',
    subtitle: 'Dhoni, Ronaldo, Messi, Kapil Dev energy',
    image: '/images/neni-turf-poster.jpeg',
  },
  {
    title: 'Neon Identity',
    subtitle: 'Signature 7★ NENI TURF night glow',
    image: '/images/neni-turf-neon-sign.jpeg',
  },
  {
    title: 'Matchday Mood',
    subtitle: 'Dual-tone blue and orange visual system',
    image: '/images/neni-turf-poster.jpeg',
  },
]

const testimonials = [
  {
    name: 'Arjun Krishnamurthy',
    role: 'Cricket Captain, Chennai CC',
    avatar: 'AK',
    text: 'Best cricket turf in Chennai, hands down. The online booking is incredibly smooth and the venue branding makes every game feel bigger.',
    sport: 'cricket',
  },
  {
    name: 'Priya Raghavendra',
    role: 'Football Coach, FC Madras',
    avatar: 'PR',
    text: 'The pitch quality is excellent and the booking flow is fast enough for last-minute sessions. It feels premium from the first screen to kick-off.',
    sport: 'football',
  },
  {
    name: 'Karthik Sundarajan',
    role: 'Weekend Player, T. Nagar',
    avatar: 'KS',
    text: 'The dual-sport presentation is brilliant. Whether we are planning box cricket or football, the whole experience is polished and frictionless.',
    sport: 'cricket',
  },
  {
    name: 'Meera Natarajan',
    role: 'Community Organizer',
    avatar: 'MN',
    text: 'Our groups love how quickly we can lock a slot and pay. The site looks modern, the turf feels organized, and the matchday energy is top class.',
    sport: 'football',
  },
]

const howSteps = [
  {
    icon: Calendar,
    title: 'Choose Sport & Date',
    description: 'Pick cricket or football, then lock the day that works for your squad.',
  },
  {
    icon: Clock3,
    title: 'Select Your Slot',
    description: 'See live availability instantly and grab the hour before someone else does.',
  },
  {
    icon: ShieldCheck,
    title: 'Pay & Show Up',
    description: 'Complete secure payment and walk into 7 NENI TURF with confirmation in hand.',
  },
]

const venueLogos = ['ANNA NAGAR LEAGUE', 'WEEKEND CRICKET CLUBS', 'FIVE-A-SIDE NIGHTS', 'SCHOOL TOURNAMENTS', 'CORPORATE MATCHES', 'CHAMPIONS SESSIONS']

function SportPill({ sport, price, accent }: { sport: string; price: string; accent: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
      style={{ background: `${accent}18`, border: `1px solid ${accent}40` }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base" style={{ background: `${accent}20` }}>
        {sport === 'Cricket' ? '🏏' : '⚽'}
      </div>
      <div>
        <div className="font-bold text-sm" style={{ color: accent }}>{sport}</div>
        <div className="text-xs text-slate-500">{price}</div>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [heroWordIndex, setHeroWordIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroWordIndex((current) => (current + 1) % heroWords.length)
    }, 2200)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#05060a] text-slate-100">
      <Navbar />

      <section className="relative min-h-screen overflow-hidden flex items-center pt-28">
        <ThreeBackground variant="hero" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_30%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_32%),linear-gradient(180deg,rgba(5,6,10,0.78),#05060a)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 w-full">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-7"
                style={{ background: 'rgba(15,23,42,0.72)', border: '1px solid rgba(96,165,250,0.18)' }}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.28em] font-bold text-slate-300">
                  7 NENI TURF · Chennai
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="font-bold leading-[0.95] text-[clamp(3rem,7vw,6.2rem)]"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                <span className="block text-slate-100">The Easiest Way to</span>
                <span className="block min-h-[1.15em] mt-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={heroWords[heroWordIndex].text}
                      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="inline-block"
                      style={{ color: heroWords[heroWordIndex].color }}
                    >
                      {heroWords[heroWordIndex].text}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="text-lg leading-8 text-slate-400 max-w-xl mt-6"
              >
                Explore 7 NENI TURF and book your game in no time. Premium cricket and football sessions, champion energy, and an instant booking flow built for modern players.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
                className="flex flex-wrap gap-3 mt-8"
              >
                <Link href="/booking">
                  <button className="btn-green gap-2 group" style={{ padding: '14px 30px', borderRadius: '999px', fontSize: '15px' }}>
                    Start Playing
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </Link>
                <Link href="#facilities">
                  <button className="btn-outline" style={{ padding: '14px 28px', borderRadius: '999px', fontSize: '15px' }}>
                    Explore Venue
                  </button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
                className="flex flex-wrap gap-3 mt-10"
              >
                <SportPill sport="Cricket" price="₹800 / hr" accent="#60a5fa" />
                <SportPill sport="Football" price="₹800 / hr" accent="#fb923c" />
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/[0.03]">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>
                    <div className="text-sm font-semibold text-slate-200">Anna Nagar, Chennai</div>
                    <div className="text-xs text-slate-500">Floodlights · Parking · Instant booking</div>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.24, duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[40px] blur-3xl bg-[radial-gradient(circle,rgba(37,99,235,0.28),transparent_45%),radial-gradient(circle_at_right,rgba(249,115,22,0.22),transparent_38%)]" />
              <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-[#0b0e16] shadow-[0_24px_80px_rgba(2,6,23,0.55)]">
                <div className="relative aspect-[1.05] md:aspect-[1.12]">
                  <Image
                    src="/images/neni-turf-poster.jpeg"
                    alt="7 NENI TURF champions poster featuring football and cricket legends"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,0.06),rgba(5,6,10,0.2)_45%,rgba(5,6,10,0.72)_100%)]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.24em] font-bold text-slate-200 border border-white/10 bg-black/30 backdrop-blur-xl">
                      <Sparkles className="w-3.5 h-3.5 text-orange-300" />
                      Where Legends Compete, Champions Are Made
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                      <div className="rounded-2xl p-4 border border-blue-400/20 bg-blue-500/10 backdrop-blur-xl">
                        <div className="text-xs uppercase tracking-[0.2em] text-blue-200 font-bold">Cricket</div>
                        <div className="text-sm text-slate-300 mt-1">Strategy · Calm · Victory</div>
                      </div>
                      <div className="rounded-2xl p-4 border border-orange-400/20 bg-orange-500/10 backdrop-blur-xl">
                        <div className="text-xs uppercase tracking-[0.2em] text-orange-200 font-bold">Football</div>
                        <div className="text-sm text-slate-300 mt-1">Passion · Power · Glory</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden lg:flex absolute -left-10 top-10 rounded-2xl px-4 py-3 border border-blue-400/20 bg-slate-950/80 backdrop-blur-xl items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100">500+ active players</div>
                  <div className="text-xs text-slate-500">Weekend prime-time squads</div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="hidden lg:flex absolute -right-8 bottom-12 rounded-2xl px-4 py-3 border border-orange-400/20 bg-slate-950/80 backdrop-blur-xl items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-orange-300" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-100">Champion-ready nights</div>
                  <div className="text-xs text-slate-500">Floodlights until 11 PM</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 h-14 overflow-hidden">
          <div className="absolute inset-x-[-6%] bottom-4 h-[2px] -rotate-[4deg] bg-[linear-gradient(90deg,transparent,rgba(96,165,250,0.8),rgba(249,115,22,0.65),transparent)]" />
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-[#0c0e15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-[28px] overflow-hidden">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="px-6 py-6 text-center bg-[#0c0e15]"
              >
                <div className="text-neni-grad font-bold text-[clamp(1.5rem,2.8vw,2rem)]" style={{ fontFamily: 'Space Grotesk' }}>
                  {stat.value}
                </div>
                <div className="font-semibold text-sm text-slate-100 mt-1">{stat.label}</div>
                <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6" id="facilities">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="label-upper mb-3">Premium turf experience</div>
          <h2 className="text-[clamp(2.2rem,5vw,4rem)] font-bold leading-tight">
            Designed like a <span className="text-neni-grad">modern sports brand</span>, built for one unforgettable venue.
          </h2>
          <p className="text-lg text-slate-400 mt-5">
            Dark surfaces, neon accents, premium motion, and real booking utility come together at 7 NENI TURF.
          </p>
        </motion.div>

        <div className="space-y-16">
          {featureSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="label-upper mb-3">{section.eyebrow}</div>
                <h3 className="text-[clamp(2rem,4vw,3.2rem)] font-bold leading-tight max-w-xl">{section.title}</h3>
                <p className="text-slate-400 text-lg leading-8 mt-5 max-w-xl">{section.description}</p>
                <div className="space-y-3 mt-8">
                  {section.points.map((point) => (
                    <div key={point} className="flex items-center gap-3 text-slate-200">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/10 bg-white/[0.03]">
                        <CheckCircle className="w-4 h-4 text-blue-300" />
                      </div>
                      <span className="text-sm sm:text-base">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="relative">
                  <div className="absolute -z-10 inset-auto -left-6 top-10 w-40 h-40 rounded-[36px] blur-sm" style={{ background: section.accent }} />
                  <div className="absolute -z-10 -right-8 bottom-[-16px] w-36 h-36 rounded-full blur-2xl" style={{ background: section.glow }} />
                  <div className="relative rounded-[30px] overflow-hidden border border-white/10 bg-[#0b0e16] shadow-[0_20px_60px_rgba(2,6,23,0.42)]">
                    <div className="relative aspect-[1.2]">
                      <Image
                        src={section.image}
                        alt={section.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className={`object-cover ${index === 1 ? 'object-center' : 'object-[center_30%]'}`}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,0.05),rgba(5,6,10,0.22)_55%,rgba(5,6,10,0.72)_100%)]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-[#090b11] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <div className="label-upper mb-3">Trusted by game nights across the city</div>
            <h2 className="text-[clamp(2rem,4vw,3.4rem)] font-bold">One venue. Two sports. Endless matchups.</h2>
          </motion.div>

          <div className="overflow-hidden rounded-full border border-white/[0.08] bg-white/[0.02] px-6 py-4 mb-14">
            <motion.div
              className="flex w-max gap-4"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
            >
              {[...venueLogos, ...venueLogos].map((item, index) => (
                <div key={`${item}-${index}`} className="px-5 py-2 rounded-full border border-white/10 bg-[#0f131d] text-sm font-semibold text-slate-300 whitespace-nowrap">
                  {item}
                </div>
              ))}
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {sportCards.map((card) => (
              <motion.div
                key={card.sport}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-[30px] border border-white/10 p-8 bg-[linear-gradient(180deg,rgba(19,22,31,0.98),rgba(10,12,19,0.98))]"
              >
                <div className="absolute inset-0 opacity-80" style={{ background: `radial-gradient(circle at top right, ${card.glow}, transparent 35%)` }} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: `${card.accent}22`, border: `1px solid ${card.accent}40` }}>
                      {card.emoji}
                    </div>
                    <span className="text-xs uppercase tracking-[0.22em] font-bold" style={{ color: card.accent }}>
                      {card.strap}
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold max-w-sm leading-tight">{card.title}</h3>
                  <p className="text-slate-400 leading-8 mt-5 max-w-xl">{card.description}</p>
                  <div className="rounded-2xl mt-6 p-4 border border-white/8 bg-white/[0.03] text-sm text-slate-200">
                    “{card.quote}”
                  </div>
                  <div className="flex items-center justify-between flex-wrap gap-4 mt-8">
                    <div>
                      <div className="text-sm text-slate-500">Starting from</div>
                      <div className="text-2xl font-bold" style={{ color: card.accent, fontFamily: 'Space Grotesk' }}>₹800 / hour</div>
                    </div>
                    <Link href={card.href}>
                      <button className="btn-green" style={{ borderRadius: '999px' }}>
                        Book {card.sport}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <div className="label-upper mb-3">Venue gallery</div>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold max-w-xl">A premium turf identity built to stand out day and night.</h2>
          </div>
          <div className="text-slate-400 max-w-md">Poster-scale storytelling, signature neon branding, and a sports-first dark interface define the 7 NENI TURF experience.</div>
        </motion.div>
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="relative rounded-[32px] overflow-hidden border border-white/10 min-h-[420px]">
            <Image src={galleryCards[0].image} alt={galleryCards[0].title} fill sizes="(max-width: 1024px) 100vw, 58vw" className="object-cover object-center" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,0.06),rgba(5,6,10,0.3)_50%,rgba(5,6,10,0.85)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <div className="text-sm uppercase tracking-[0.22em] text-blue-200 font-bold">{galleryCards[0].title}</div>
              <div className="text-xl font-bold mt-2">{galleryCards[0].subtitle}</div>
            </div>
          </div>
          <div className="grid gap-6">
            {galleryCards.slice(1).map((card, index) => (
              <div key={card.title} className="relative rounded-[28px] overflow-hidden border border-white/10 min-h-[198px]">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 38vw"
                  className={`object-cover ${index === 0 ? 'object-center' : 'object-[center_30%]'}`}
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,0.08),rgba(5,6,10,0.72)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-xs uppercase tracking-[0.22em] text-orange-200 font-bold">{card.title}</div>
                  <div className="text-lg font-bold mt-1">{card.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 overflow-hidden border-y border-white/[0.05] bg-[#0c0e15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="label-upper mb-3">Testimonials</div>
            <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-bold max-w-2xl">Players keep coming back for the speed, the vibe, and the venue identity.</h2>
          </motion.div>
        </div>
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-5 w-max px-4 sm:px-6"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          >
            {[...testimonials, ...testimonials].map((testimonial, index) => {
              const accent = testimonial.sport === 'cricket' ? '#60a5fa' : '#fb923c'
              return (
                <div
                  key={`${testimonial.name}-${index}`}
                  className="w-[320px] sm:w-[360px] rounded-[26px] p-6 border border-white/10 bg-[#13161f]"
                >
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: `${accent}20`, color: accent }}>
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-100">{testimonial.name}</div>
                        <div className="text-xs text-slate-500">{testimonial.role}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-400 leading-7 text-sm">“{testimonial.text}”</p>
                  <div className="mt-6 pt-4 border-t border-white/8 text-[11px] uppercase tracking-[0.22em] font-bold" style={{ color: accent }}>
                    {testimonial.sport === 'cricket' ? 'Cricket review' : 'Football review'}
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="label-upper mb-3">How it works</div>
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-bold">Start playing in three sharp moves.</h2>
          <p className="text-slate-400 mt-4 text-lg">Simple enough for a last-minute session. Premium enough for a full tournament plan.</p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {howSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="relative rounded-[28px] border border-white/10 p-7 bg-[linear-gradient(180deg,rgba(19,22,31,0.98),rgba(9,11,17,0.98))]"
            >
              <div className="absolute top-5 right-5 text-[12px] font-bold text-slate-600">0{index + 1}</div>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-blue-400/20 bg-blue-500/10 mb-6">
                <step.icon className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold">{step.title}</h3>
              <p className="text-slate-400 leading-7 mt-4">{step.description}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/booking">
            <button className="btn-green" style={{ padding: '14px 34px', borderRadius: '999px' }}>
              Start Playing
              <ChevronRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/neni-turf-neon-sign.jpeg"
            alt="7 NENI TURF neon sign"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,6,10,0.55),rgba(5,6,10,0.8)_40%,rgba(5,6,10,0.92))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(37,99,235,0.2),transparent_30%),radial-gradient(circle_at_right,rgba(249,115,22,0.2),transparent_30%)]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="label-upper mb-4">Final whistle? Not yet.</div>
            <h2 className="text-[clamp(2.6rem,5vw,4.4rem)] font-bold leading-tight">
              Let&apos;s Get a <span className="text-neni-grad">Game Going</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto mt-6 leading-8">
              Play where champions are made. Book a slot at 7 NENI TURF and bring your squad to Chennai&apos;s boldest cricket and football arena.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-9">
              <Link href="/booking">
                <button className="btn-green" style={{ padding: '15px 36px', borderRadius: '999px', fontSize: '15px' }}>
                  Start Playing
                  <ChevronRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-5 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-300" /> Instant confirmation</span>
              <span className="inline-flex items-center gap-2"><CheckCircle className="w-4 h-4 text-orange-300" /> Secure payments</span>
              <span className="inline-flex items-center gap-2"><CheckCircle className="w-4 h-4 text-blue-300" /> Cricket + football</span>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] bg-[#0c0e15]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#2563eb,#f97316)', boxShadow: '0 2px 12px rgba(37,99,235,0.3)' }}
                >
                  <span className="text-white font-black text-sm">7★</span>
                </div>
                <span className="font-bold text-xl text-neni-grad" style={{ fontFamily: 'Space Grotesk' }}>NENI TURF</span>
              </div>
              <p className="text-sm leading-7 max-w-sm text-slate-400">
                7 NENI TURF is Chennai&apos;s premium turf booking destination for cricket and football. Where legends compete, champions are made.
              </p>
            </div>
            <div>
              <div className="label-upper mb-4">Quick Links</div>
              <div className="space-y-2.5">
                {[['/', 'Home'], ['/booking', 'Book Now'], ['/dashboard', 'My Bookings'], ['/admin', 'Admin Panel']].map(([href, label]) => (
                  <Link key={href} href={href}>
                    <div className="text-sm transition-colors cursor-pointer text-slate-500 hover:text-blue-300">{label}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <div className="label-upper mb-4">Venue</div>
              <div className="space-y-2.5 text-sm text-slate-500">
                <div>🏏 Cricket — ₹800/hr</div>
                <div>⚽ Football — ₹800/hr</div>
                <div>📍 Anna Nagar, Chennai</div>
                <div>📞 +91 98765 43210</div>
                <div>✉️ play@7neniturf.in</div>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 border-t border-white/[0.06]">
            <div>© 2025 7 NENI TURF. All rights reserved.</div>
            <div className="flex gap-6">
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms of Service</span>
              <span>GST: 33ABCDE1234F1Z5</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
