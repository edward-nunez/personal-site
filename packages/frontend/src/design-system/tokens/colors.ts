/**
 * Color design tokens — mirrors CSS custom properties in globals.css
 * Use these for programmatic access (charts, dynamic styles, etc.)
 */
export const colors = {
  bg: {
    DEFAULT: '#0A0A0A',
    secondary: '#111111',
    tertiary: '#1A1A1A',
    elevated: '#222222',
    hover: '#2A2A2A',
  },
  fg: {
    DEFAULT: '#FAFAFA',
    secondary: '#A1A1A1',
    muted: '#737373',
    faint: '#525252',
  },
  accent: {
    DEFAULT: '#FF5E5B',
    hover: '#FF7A77',
    muted: 'rgba(255, 94, 91, 0.15)',
    orange: '#FF8C42',
  },
  border: {
    DEFAULT: '#262626',
    hover: '#404040',
    active: '#525252',
  },
  semantic: {
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#3B82F6',
  },
} as const;
