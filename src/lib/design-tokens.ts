/**
 * PROJECT INKED - Design Tokens
 * Central configuration for all design system values
 * Used for consistency across components and pages
 */

// ============================================
// COLORS
// ============================================

export const colors = {
  // Primary Palette
  ink: '#050505',
  inkWash: '#111111',
  inkLight: '#1a1a1a',
  bone: '#F2EEE7',
  boneLight: '#FDFBF7',
  
  // Accents
  redAccent: '#7A1111',
  redAccentLight: '#A61515',
  
  // Neutrals
  grey: '#8A8A8A',
  greyLight: '#A8A8A8',
  greyDark: '#6B6B6B',
  silver: '#C7C7C7',
  silverLight: '#E0E0E0',
  
  // Functional
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Transparent
  inkTransparent: 'rgba(5, 5, 5, 0.8)',
  boneTransparent: 'rgba(242, 238, 231, 0.9)',
} as const;

// ============================================
// TYPOGRAPHY
// ============================================

export const typography = {
  // Font Families
  display: 'var(--font-display), "Abril Fatface", serif',
  body: 'var(--font-body), "Space Grotesk", sans-serif',
  mono: 'Menlo, Monaco, "Courier New", monospace',
  
  // Font Sizes (in rem)
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
  },
  
  // Font Weights
  weights: {
    thin: 100,
    extralight: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  
  // Line Heights
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  
  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================
// SPACING & SIZING
// ============================================

export const spacing = {
  // Base unit: 4px
  0: '0',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  7: '1.75rem',    // 28px
  8: '2rem',       // 32px
  9: '2.25rem',    // 36px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  14: '3.5rem',    // 56px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px
  28: '7rem',      // 112px
  32: '8rem',      // 128px
  36: '9rem',      // 144px
  40: '10rem',     // 160px
  44: '11rem',     // 176px
  48: '12rem',     // 192px
  52: '13rem',     // 208px
  56: '14rem',     // 224px
  60: '15rem',     // 240px
  64: '16rem',     // 256px
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Mobile-first media queries
export const media = {
  sm: `@media (min-width: 640px)`,
  md: `@media (min-width: 768px)`,
  lg: `@media (min-width: 1024px)`,
  xl: `@media (min-width: 1280px)`,
  '2xl': `@media (min-width: 1536px)`,
  maxSm: `@media (max-width: 639px)`,
  maxMd: `@media (max-width: 767px)`,
  maxLg: `@media (max-width: 1023px)`,
  maxXl: `@media (max-width: 1279px)`,
} as const;

// ============================================
// MOTION & ANIMATION
// ============================================

export const motion = {
  // Durations (in milliseconds)
  durations: {
    instant: 0,
    fastest: 50,
    faster: 100,
    fast: 150,
    normal: 200,
    slow: 300,
    slower: 500,
    slowest: 700,
    verySlow: 1000,
  },
  
  // Easing Functions
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
    easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
    easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
    easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
    easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
    easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
    easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
    easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
    easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
    easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
    easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // GSAP Timings (for consistency)
  gsap: {
    stagger: 0.1,
    stagDuration: 0.5,
  },
  
  // Transition helpers
  transition: (property = 'all', duration = 200, easing = 'ease-out') =>
    `${property} ${duration}ms ${easing}`,
} as const;

// ============================================
// BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0',
  xs: '0.125rem',  // 2px
  sm: '0.25rem',   // 4px
  base: '0.375rem', // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',   // 32px
  full: '9999px',
} as const;

// ============================================
// SHADOWS
// ============================================

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Ink brand shadows (dark, subtle)
  inkSm: '0 2px 8px rgba(5, 5, 5, 0.15)',
  inkMd: '0 8px 16px rgba(5, 5, 5, 0.2)',
  inkLg: '0 16px 32px rgba(5, 5, 5, 0.25)',
} as const;

// ============================================
// Z-INDEX LAYERS
// ============================================

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  notification: 70,
} as const;

// ============================================
// TRANSITIONS & ANIMATIONS
// ============================================

export const transitions = {
  fast: `all ${motion.durations.fast}ms ${motion.easing.easeOut}`,
  base: `all ${motion.durations.normal}ms ${motion.easing.easeOut}`,
  slow: `all ${motion.durations.slow}ms ${motion.easing.easeOut}`,
} as const;

// ============================================
// CONTAINER WIDTHS
// ============================================

export const containers = {
  xs: '20rem',    // 320px
  sm: '24rem',    // 384px
  md: '28rem',    // 448px
  lg: '32rem',    // 512px
  xl: '36rem',    // 576px
  '2xl': '42rem', // 672px
  '3xl': '48rem', // 768px
  '4xl': '56rem', // 896px
  '5xl': '64rem', // 1024px
  '6xl': '72rem', // 1152px
  '7xl': '80rem', // 1280px
} as const;

// ============================================
// BRAND-SPECIFIC VALUES
// ============================================

export const brand = {
  name: 'PROJECT INKED',
  tagline: 'Wearable ink. Limited marks.',
  statement: 'Not made for everyone. Made to leave a mark.',
  
  // Common phrases
  phrases: {
    cta: 'Shop the Drop',
    newsletter: 'Enter the next drop.',
    notMadeForEveryone: 'NOT MADE FOR EVERYONE.',
    madeToLeaveMark: 'MADE TO LEAVE A MARK.',
  },
  
  // Social links (placeholder)
  socials: {
    instagram: 'https://instagram.com/projectinked',
    tiktok: 'https://tiktok.com/@projectinked',
    twitter: 'https://twitter.com/projectinked',
  },
} as const;

// ============================================
// EXPORT DEFAULTS
// ============================================

export const designTokens = {
  colors,
  typography,
  spacing,
  breakpoints,
  media,
  motion,
  borderRadius,
  shadows,
  zIndex,
  transitions,
  containers,
  brand,
} as const;

export default designTokens;
