# PROJECT INKED - Design Tokens Documentation

## Overview

The design tokens define all visual and behavioral constants used throughout the PROJECT INKED website. These tokens ensure consistency across the brand and make it easy to update the design system globally.

## File Structure

```
src/lib/
├── design-tokens.ts      # Complete design token definitions
├── constants.ts          # Quick-access constants for components
├── types.ts             # TypeScript type definitions
├── index.ts             # Main exports
└── hooks/               # Custom React hooks
    ├── useGSAP.ts      # Animation hooks
    ├── useResponsive.ts # Media query hooks
    └── index.ts        # Hook exports
```

## Colors

### Primary Palette
- **ink** (`#050505`) - Primary dark background
- **bone** (`#F2EEE7`) - Primary light text
- **red-accent** (`#7A1111`) - Primary accent color

### Neutrals
- **grey** (`#8A8A8A`) - Secondary text
- **silver** (`#C7C7C7`) - Borders and dividers

### Usage in Components

```tsx
import { colors } from '@/lib/design-tokens';

export default function Component() {
  return (
    <div style={{ backgroundColor: colors.ink, color: colors.bone }}>
      Content
    </div>
  );
}
```

### Tailwind CSS Usage

```tsx
export default function Component() {
  return (
    <div className="bg-ink text-bone border border-grey">
      Content
    </div>
  );
}
```

## Typography

### Font Families
- **Display**: Abril Fatface (headlines, bold statements)
- **Body**: Space Grotesk (body text, UI)
- **Mono**: System fonts (code)

### Font Sizes

| Size | Value | Usage |
|------|-------|-------|
| 7xl | 4.5rem (72px) | Hero headlines |
| 6xl | 3.75rem (60px) | Section titles |
| 5xl | 3rem (48px) | Large titles |
| 4xl | 2.25rem (36px) | Medium titles |
| 3xl | 1.875rem (30px) | Section headings |
| 2xl | 1.5rem (24px) | Card titles |
| xl | 1.25rem (20px) | Subheadings |
| lg | 1.125rem (18px) | Body large |
| base | 1rem (16px) | Body text |
| sm | 0.875rem (14px) | Small text |
| xs | 0.75rem (12px) | Captions |

### Font Weights
- 400 (normal) - Body text
- 500 (medium) - UI labels
- 600 (semibold) - Emphasis
- 700 (bold) - Headlines

### Usage

```tsx
<h1 className="font-display text-7xl font-bold">PROJECT INKED</h1>
<h2 className="font-display text-5xl">Collection Title</h2>
<p className="font-body text-base font-normal">Body text</p>
```

## Spacing

All spacing follows a 4px base unit system.

| Value | Pixels | Usage |
|-------|--------|-------|
| 1 | 4px | Tiny gaps |
| 2 | 8px | Small gaps |
| 4 | 16px | Default padding |
| 6 | 24px | Section spacing |
| 8 | 32px | Large sections |
| 16 | 64px | Major spacing |
| 24 | 96px | Page sections |

### Usage

```tsx
<div className="p-6 gap-4 mb-12">
  Content with padding 24px, gaps 16px, margin-bottom 48px
</div>
```

## Motion & Animation

### Durations (milliseconds)

| Name | Duration | Usage |
|------|----------|-------|
| instant | 0ms | Immediate |
| fast | 150ms | Quick interactions |
| normal | 300ms | Standard transitions |
| slow | 500ms | Scroll reveals |
| verySlow | 1000ms | Cinematic effects |

### Easing Functions

```tsx
import { motion } from '@/lib/design-tokens';

// Common easings
motion.easing.easeOut     // Default smooth exit
motion.easing.easeInOut   // Smooth both ways
motion.easing.easeInCubic // Custom curves available
```

### GSAP Animation Example

```tsx
'use client';

import { useGSAP } from '@/lib/hooks';
import gsap from 'gsap';
import { motion } from '@/lib/design-tokens';

export default function AnimatedComponent() {
  useGSAP(() => {
    gsap.to('.box', {
      duration: motion.durations.normal / 1000,
      opacity: 1,
      y: 0,
      ease: motion.easing.easeOut,
    });
  });

  return <div className="box opacity-0 translate-y-4">Content</div>;
}
```

## Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Tablets |
| md | 768px | Landscape tablets |
| lg | 1024px | Desktops |
| xl | 1280px | Large desktops |
| 2xl | 1536px | Ultra-wide |

### Responsive Usage

```tsx
// Tailwind CSS
<div className="text-base sm:text-lg md:text-xl lg:text-2xl">
  Responsive text
</div>

// React Hooks
import { useDesktop, useMobile } from '@/lib/hooks';

export default function Component() {
  const isDesktop = useDesktop();
  return isDesktop ? <DesktopLayout /> : <MobileLayout />;
}
```

## Accessibility

### Reduced Motion Support

Always check for `prefers-reduced-motion` before using animations:

```tsx
import { useReducedMotion } from '@/lib/hooks';

export default function AnimatedButton() {
  const reducedMotion = useReducedMotion();

  const handleClick = () => {
    if (reducedMotion) {
      // Skip animation
      setState(newState);
    } else {
      // Animate state change
      gsap.to('.button', { duration: 0.3, scale: 1.1 });
    }
  };

  return <button onClick={handleClick}>Click me</button>;
}
```

## Commonly Used Values

### Quick Constants

```tsx
import { COLORS, ANIMATION, LAYOUT, Z_INDEX } from '@/lib/constants';

// Colors
COLORS.primary    // #050505
COLORS.accent     // #7A1111

// Animation
ANIMATION.FAST    // 150ms
ANIMATION.NORMAL  // 300ms

// Layout
LAYOUT.HEADER_HEIGHT        // 80px
LAYOUT.CONTAINER_PADDING    // 1.5rem

// Z-Index
Z_INDEX.MODAL      // 40
Z_INDEX.TOOLTIP    // 60
```

## Common Patterns

### Creating a Styled Button

```tsx
import { cn } from '@/lib/utils/cn';
import { ANIMATION } from '@/lib/constants';

export function Button({ variant = 'primary', ...props }) {
  const baseStyles = 'px-6 py-3 font-semibold rounded transition-all';
  const variants = {
    primary: 'bg-red-accent text-bone hover:bg-red-accent-light',
    secondary: 'border border-silver text-bone hover:bg-silver hover:text-ink',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant])}
      style={{ transitionDuration: `${ANIMATION.NORMAL}ms` }}
      {...props}
    />
  );
}
```

### Responsive Container

```tsx
import { spacing } from '@/lib/design-tokens';

export function Container({ children }) {
  return (
    <div
      className="max-w-7xl mx-auto w-full"
      style={{
        paddingLeft: spacing['6'],
        paddingRight: spacing['6'],
        paddingTop: spacing['8'],
        paddingBottom: spacing['8'],
      }}
    >
      {children}
    </div>
  );
}
```

## Brand Guidelines

### Colors in Use

- **Ink Black** - Primary background, text hierarchy
- **Bone White** - Primary foreground, contrast
- **Red Accent** - Calls-to-action, emphasis, hover states
- **Silver** - Borders, dividers, secondary elements

### Typography Hierarchy

1. **Display** (Abril Fatface) - Headlines, strong statements
2. **Body** (Space Grotesk) - All body copy, UI labels
3. **Accent sizing** - Use 7xl-5xl for major headlines, 3xl-lg for body

### Motion Principles

- Quick interactions (buttons, hover): **fast** (150ms)
- Standard transitions: **normal** (300ms)
- Scroll reveals, cinematic: **slow** (500ms)
- Always respect `prefers-reduced-motion`

## Updating Design Tokens

To update global design values:

1. Edit `src/lib/design-tokens.ts` for comprehensive changes
2. Edit `src/lib/constants.ts` for quick-access values
3. Update `tailwind.config.ts` if adding new categories
4. Both Tailwind classes and TypeScript values will update automatically

Example: Changing the primary accent color

```tsx
// In design-tokens.ts
export const colors = {
  // ...
  redAccent: '#FF0000', // Changed from #7A1111
};

// Automatically available as:
// - Tailwind: className="bg-red-accent"
// - TypeScript: colors.redAccent
// - Constants: COLORS.accent
```

## Resources

- Tailwind CSS: https://tailwindcss.com/docs
- GSAP: https://greensock.com/gsap/
- Animation best practices: https://material-motion.github.io/material-motion/

---

**Last Updated:** May 8, 2026  
**Version:** 1.0.0
