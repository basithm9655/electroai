/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base dark palette
        surface: {
          0:  '#060912',
          50: '#0a0f1e',
          100: '#0d1426',
          200: '#111827',
          300: '#1a2235',
          400: '#1e2a40',
          500: '#243050',
        },
        // Neon accent - cyan
        neon: {
          50:  '#e0feff',
          100: '#b3fbff',
          200: '#66f5ff',
          300: '#1ae8ff',
          400: '#00d4f0',
          500: '#00b8d4',
          600: '#0090a8',
        },
        // Electric blue
        electric: {
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        // Violet accent
        violet: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        // Emerald for success/simulation
        emerald: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
        },
        // Amber for warnings
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        // Rose for errors
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        'noise': `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        'radial-glow': 'radial-gradient(ellipse at center, rgba(0,212,240,0.08) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon-sm':  '0 0 8px rgba(0,212,240,0.4)',
        'neon-md':  '0 0 16px rgba(0,212,240,0.5), 0 0 32px rgba(0,212,240,0.15)',
        'neon-lg':  '0 0 32px rgba(0,212,240,0.6), 0 0 64px rgba(0,212,240,0.2)',
        'electric': '0 0 12px rgba(56,189,248,0.5)',
        'violet':   '0 0 12px rgba(139,92,246,0.5)',
        'glass':    '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
        'panel':    '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
        'component':'0 2px 8px rgba(0,0,0,0.6)',
        'component-hover': '0 0 16px rgba(0,212,240,0.3), 0 4px 16px rgba(0,0,0,0.6)',
      },
      borderColor: {
        'glass': 'rgba(255,255,255,0.06)',
        'neon':  'rgba(0,212,240,0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-neon':   'pulse-neon 2s ease-in-out infinite',
        'scan-line':    'scan-line 3s linear infinite',
        'float':        'float 3s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'wire-flow':    'wire-flow 1.5s linear infinite',
        'glow-pulse':   'glow-pulse 2s ease-in-out infinite',
        'slide-in-left':'slide-in-left 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-right':'slide-in-right 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-up':     'slide-up 0.3s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':      'fade-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 8px rgba(0,212,240,0.4)' },
          '50%':       { opacity: '0.8', boxShadow: '0 0 24px rgba(0,212,240,0.8)' },
        },
        'scan-line': {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':       { transform: 'translateY(-4px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'wire-flow': {
          '0%':   { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { filter: 'drop-shadow(0 0 4px rgba(0,212,240,0.4))' },
          '50%':       { filter: 'drop-shadow(0 0 12px rgba(0,212,240,0.9))' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%':   { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
