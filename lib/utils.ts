import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}

export function generateSlots(
  openingTime: string,
  closingTime: string,
  durationMinutes: number
): { startTime: string; endTime: string }[] {
  const slots = []
  const [openHour, openMin] = openingTime.split(':').map(Number)
  const [closeHour, closeMin] = closingTime.split(':').map(Number)

  let currentMinutes = openHour * 60 + openMin
  const closeMinutes = closeHour * 60 + closeMin

  while (currentMinutes + durationMinutes <= closeMinutes) {
    const startHour = Math.floor(currentMinutes / 60)
    const startMin = currentMinutes % 60
    const endMinutes = currentMinutes + durationMinutes
    const endHour = Math.floor(endMinutes / 60)
    const endMin = endMinutes % 60

    slots.push({
      startTime: `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
      endTime: `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`,
    })

    currentMinutes += durationMinutes
  }

  return slots
}

export function getSlotStatusColor(status: string) {
  switch (status) {
    case 'available':
      return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 cursor-pointer'
    case 'booked':
      return 'bg-red-500/20 border-red-500/40 text-red-400 cursor-not-allowed opacity-70'
    case 'blocked':
      return 'bg-zinc-800/60 border-zinc-700 text-zinc-600 cursor-not-allowed'
    case 'closed':
      return 'bg-zinc-900/60 border-zinc-800 text-zinc-700 cursor-not-allowed'
    default:
      return ''
  }
}
