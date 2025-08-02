/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			
  			// KPVS Brand Colors - Enhanced
  			'kpvs-blue': {
  				DEFAULT: '#1a365d',
  				light: '#2c5282', 
  				dark: '#0f2a44',
  				darker: '#0a1e30',
  				50: '#f0f7ff',
  				100: '#e0f2fe',
  				200: '#bae6fd',
  				300: '#7dd3fc',
  				400: '#38bdf8',
  			},
  			'kpvs-orange': {
  				DEFAULT: '#ed8936',
  				light: '#f6ad55',
  				dark: '#c05621',
  				50: '#fff7ed',
  				100: '#ffedd5',
  			},
  			'kpvs-red': {
  				DEFAULT: '#e53e3e',
  				light: '#f87171',
  				dark: '#dc2626',
  			},
  			
  			// Professional Grays
  			'kpvs-gray': {
  				50: '#f9fafb',
  				100: '#f3f4f6',
  				200: '#e5e7eb',
  				300: '#d1d5db',
  				400: '#9ca3af',
  				500: '#6b7280',
  				600: '#4b5563',
  				700: '#374151',
  				800: '#1f2937',
  				900: '#111827',
  			},
  			
  			// Status Colors
  			'kpvs-success': {
  				DEFAULT: '#10b981',
  				light: '#34d399',
  				dark: '#047857',
  			},
  			'kpvs-warning': {
  				DEFAULT: '#f59e0b',
  				light: '#fbbf24',
  				dark: '#d97706',
  			},
  			'kpvs-error': {
  				DEFAULT: '#ef4444',
  				light: '#f87171',
  				dark: '#dc2626',
  			},
  			
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};