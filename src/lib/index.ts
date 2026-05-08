/**
 * Library exports
 * Central point for importing utilities, types, constants, and design tokens
 */

// Design system
export { designTokens, colors, typography, spacing, motion, breakpoints, borderRadius, shadows, zIndex } from './design-tokens';
export { COLORS, ANIMATION, LAYOUT, Z_INDEX, BREAKPOINTS, FORM, PRODUCT, TRANSITION, API, isMobile, isTablet, isDesktop } from './constants';

// Types
export type * from './types';

// Utilities
export { cn } from './utils/cn';

// Hooks
export { useGSAP, useScrollTrigger, gsap, ScrollTrigger } from './hooks';
export { useWindowSize, useMediaQuery, useMobile, useTablet, useDesktop, useReducedMotion } from './hooks';

// Animation configs
export { useGSAPContext } from './animation/gsap-config';
