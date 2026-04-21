import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        bg:     '#05060a',
        bg2:    '#0c0e15',
        bg3:    '#111420',
        card:   '#13161f',
        card2:  '#181b27',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '20px',
        '4xl': '28px',
      },
      animation: {
        'float':     'float-y 3.5s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'slide-up':  'slide-up 0.4s cubic-bezier(.22,1,.36,1) forwards',
        'scale-in':  'scale-in 0.3s cubic-bezier(.22,1,.36,1) forwards',
      },
      keyframes: {
        'float-y':  { '0%,100%': { transform:'translateY(0)' }, '50%': { transform:'translateY(-12px)' } },
        'spin-slow':{ from: { transform:'rotate(0deg)' }, to: { transform:'rotate(360deg)' } },
        'slide-up': { from: { opacity:'0', transform:'translateY(18px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        'scale-in': { from: { opacity:'0', transform:'scale(0.93)' }, to: { opacity:'1', transform:'scale(1)' } },
      },
      backgroundImage: {
        'green-grad': 'linear-gradient(135deg,#16a34a,#22c55e)',
        'hero-grad':  'linear-gradient(135deg,#05060a 0%,#0c1a10 50%,#05060a 100%)',
      },
      boxShadow: {
        'green-glow': '0 4px 24px rgba(34,197,94,0.25)',
        'green-glow-lg': '0 8px 40px rgba(34,197,94,0.35)',
        'card': '0 2px 20px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
export default config
