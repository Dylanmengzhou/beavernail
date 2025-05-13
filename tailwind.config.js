/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'subtle-pulse': 'subtlePulse 4s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        'custom-bounce': 'customBounce 2s infinite',
        'bounce-twice': 'bounce 1s ease-in-out 2',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(500%)' },
        },
        subtlePulse: {
          '0%, 100%': { 
            transform: 'scale(1)', 
            boxShadow: '0 8px 32px 0 rgba(255,120,200,0.18), 0 1.5px 0 0 rgba(255,255,255,0.7) inset, 0 0 0 8px rgba(255,182,193,0.10)'
          },
          '50%': { 
            transform: 'scale(1.02)', 
            boxShadow: '0 10px 40px 0 rgba(255,120,200,0.22), 0 1.5px 0 0 rgba(255,255,255,0.8) inset, 0 0 0 10px rgba(255,182,193,0.15)'
          },
        },
        customBounce: {
          '0%, 100%': { 
            transform: 'translateY(0)',
            boxShadow: '0 8px 32px 0 rgba(255,120,200,0.18)'
          },
          '50%': { 
            transform: 'translateY(-15px)',
            boxShadow: '0 20px 40px 0 rgba(255,120,200,0.3)'
          }
        }
      },
    },
  },
  plugins: [],
} 