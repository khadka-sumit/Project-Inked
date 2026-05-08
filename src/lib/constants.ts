/**
 * PROJECT INKED - Constants
 * Quick-access values for common use cases
 */

// ============================================
// COLOR CONSTANTS
// ============================================

export const COLORS = {
  primary: '#050505',           // ink
  secondary: '#7A1111',         // red-accent
  background: '#050505',        // ink
  foreground: '#F2EEE7',        // bone
  muted: '#8A8A8A',             // grey
  accent: '#7A1111',            // red-accent
  border: '#111111',            // ink-wash
  input: '#111111',             // ink-wash
  ring: '#7A1111',              // red-accent
} as const;

// ============================================
// ANIMATION CONSTANTS
// ============================================

export const ANIMATION = {
  // Durations (ms)
  INSTANT: 0,
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
  
  // Easing
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================
// LAYOUT CONSTANTS
// ============================================

export const LAYOUT = {
  HEADER_HEIGHT: '80px',
  HEADER_HEIGHT_MOBILE: '64px',
  FOOTER_HEIGHT: '300px',
  CONTAINER_PADDING: '1.5rem',
  CONTAINER_PADDING_MD: '2rem',
  CONTAINER_PADDING_LG: '3rem',
} as const;

// ============================================
// Z-INDEX CONSTANTS
// ============================================

export const Z_INDEX = {
  HIDDEN: -1,
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 35,
  MODAL: 40,
  POPOVER: 50,
  TOOLTIP: 60,
  NOTIFICATION: 70,
} as const;

// ============================================
// BREAKPOINT CONSTANTS (for JS)
// ============================================

export const BREAKPOINTS = {
  XS: 320,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// ============================================
// FORM CONSTANTS
// ============================================

export const FORM = {
  INPUT_HEIGHT: '3rem',
  INPUT_HEIGHT_SM: '2.5rem',
  INPUT_HEIGHT_LG: '3.5rem',
  BUTTON_HEIGHT: '3rem',
  BUTTON_HEIGHT_SM: '2.5rem',
  BUTTON_HEIGHT_LG: '3.5rem',
} as const;

// ============================================
// PRODUCT CONSTANTS
// ============================================

export const PRODUCT = {
  CARD_ASPECT_RATIO: '3/4',
  IMAGE_QUALITY: 80,
  PLACEHOLDER_IMAGE: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23111111" width="400" height="500"/%3E%3C/svg%3E',
} as const;

// ============================================
// TRANSITION STRINGS
// ============================================

export const TRANSITION = {
  FAST: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
  NORMAL: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  SLOW: 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================
// API/ENDPOINTS (placeholder)
// ============================================

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  SHOPIFY_STOREFRONT_URL: process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL || '',
  SHOPIFY_ACCESS_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || '',
} as const;

// ============================================
// UTILITY FUNCTIONS
// ============================================

export const isMobile = (width: number) => width < BREAKPOINTS.SM;
export const isTablet = (width: number) => width >= BREAKPOINTS.SM && width < BREAKPOINTS.LG;
export const isDesktop = (width: number) => width >= BREAKPOINTS.LG;
