/**
 * PROJECT INKED - Type Definitions
 * Common TypeScript types used throughout the application
 */

// ============================================
// PRODUCT TYPES
// ============================================

export type ProductCategory = 'tees' | 'hoodies' | 'jackets' | 'accessories';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: ProductCategory;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  sku?: string;
  weight?: number;
  material?: string;
  care?: string[];
  featured?: boolean;
  tags?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
  id: string; // unique cart item id
}

// ============================================
// CART & CHECKOUT TYPES
// ============================================

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export type CheckoutStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CheckoutState {
  status: CheckoutStatus;
  error?: string;
  redirectUrl?: string;
}

// ============================================
// FORM TYPES
// ============================================

export interface NewsletterFormData {
  email: string;
  name?: string;
  preferredCategory?: ProductCategory;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
  email?: string;
}

// ============================================
// ANIMATION TYPES
// ============================================

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
  repeat?: number;
  yoyo?: boolean;
}

export interface ScrollTriggerConfig {
  trigger: string | HTMLElement;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

// ============================================
// PAGE/METADATA TYPES
// ============================================

export interface PageMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
  author?: string;
  keywords?: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================
// UI COMPONENT TYPES
// ============================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonState = 'idle' | 'loading' | 'disabled' | 'error';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

export type InputSize = 'sm' | 'md' | 'lg';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

export interface InputProps {
  type?: InputType;
  size?: InputSize;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// SHOPIFY TYPES
// ============================================

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: Array<{
    id: string;
    merchandise: {
      id: string;
      title: string;
    };
    quantity: number;
  }>;
  cost: {
    subtotalAmount: {
      amount: string;
    };
    totalAmount: {
      amount: string;
    };
  };
}

// ============================================
// SECTION TYPES
// ============================================

export interface HeroSection {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
}

export interface FeatureCard {
  title: string;
  description: string;
  icon?: string;
  image?: string;
  link?: string;
}

// ============================================
// LOOKBOOK TYPES
// ============================================

export interface LookbookImage {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  productLinks?: Array<{
    productId: string;
    x: number;
    y: number;
  }>;
}

export interface LookbookSection {
  id: string;
  title: string;
  description?: string;
  images: LookbookImage[];
}

// ============================================
// UTILITY TYPES
// ============================================

export type Optional<T> = T | null | undefined;
export type Nullable<T> = T | null;
export type AsyncFunction<T> = () => Promise<T>;
