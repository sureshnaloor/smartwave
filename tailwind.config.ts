import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Aurora Tech palette
				'sw-deepest': '#0a0a0a',
				'sw-card': '#0f172a',
				'sw-elevated': '#111827',
				'sw-teal': '#00b4d8',
				'sw-aurora': '#00f5d4',
				'sw-copper': '#b87333',
				'sw-text-primary': '#ffffff',
				'sw-text-secondary': '#e5e7eb',
				'sw-text-muted': '#94a3b8',
				'sw-text-dim': '#64748b',
				// Legacy aliases (mapped to Aurora palette)
				'smart-charcoal': '#0a0a0a',
				'smart-silver': '#e5e7eb',
				'smart-teal': '#00b4d8',
				'smart-aurora': '#00f5d4',
				'smart-amber': '#b87333',
				'smart-copper': '#b87333',
			},
			fontFamily: {
				heading: ['var(--font-heading)', 'Inter', 'sans-serif'],
				body: ['var(--font-body)', 'var(--font-body-fallback)', 'sans-serif'],
				display: ['var(--font-display)', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				wiggle: {
					'0%, 100%': { transform: 'rotate(-9deg)' },
					'50%': { transform: 'rotate(9deg)' }
				},
				'breathe-x': {
					'0%, 100%': { transform: 'scaleX(1)' },
					'50%': { transform: 'scaleX(1.05)' },
				},
				aurora: {
					'0%, 100%': {
						transform: 'translateX(-10%) rotate(0deg)',
						opacity: '0.3',
					},
					'50%': {
						transform: 'translateX(10%) rotate(2deg)',
						opacity: '0.6',
					},
				},
				'aurora-shift': {
					'0%, 100%': {
						transform: 'translate(0, 0) rotate(0deg)',
						opacity: '0.5',
					},
					'33%': {
						transform: 'translate(5%, -3%) rotate(1deg)',
						opacity: '0.7',
					},
					'66%': {
						transform: 'translate(-3%, 2%) rotate(-1deg)',
						opacity: '0.4',
					},
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' },
				},
				'glow-pulse': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(0, 180, 216, 0.3), 0 0 40px rgba(0, 245, 212, 0.1)',
					},
					'50%': {
						boxShadow: '0 0 30px rgba(0, 180, 216, 0.5), 0 0 60px rgba(0, 245, 212, 0.2)',
					},
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				wiggle: 'wiggle 0.3s ease-in-out',
				'breathe-x': 'breathe-x 15s ease-in-out infinite',
				aurora: 'aurora 20s ease-in-out infinite',
				'aurora-shift': 'aurora-shift 25s ease-in-out infinite',
				float: 'float 6s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
			},
			boxShadow: {
				'sw-glow': '0 0 20px rgba(0, 180, 216, 0.3), 0 0 40px rgba(0, 245, 212, 0.1)',
				'sw-glow-lg': '0 0 30px rgba(0, 180, 216, 0.5), 0 0 60px rgba(0, 245, 212, 0.2)',
				'sw-copper-glow': '0 0 20px rgba(184, 115, 51, 0.4)',
			},
		}
	},
	plugins: [animate],
} satisfies Config;

export default config;
