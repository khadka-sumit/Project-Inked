/* ═══════════════════════════════════════════
   Product & Data Engine — PROJECT INKED
   Persisted via localStorage ('projectinked_products')
   ═══════════════════════════════════════════ */

const DEFAULT_PRODUCTS = [
  {
    id: '1',
    title: 'Ink Mark Oversized Tee',
    description: 'Premium heavyweight cotton tee with embroidered ink mark on chest. Dropped shoulders, raw hem edge — made to be worn like a statement.',
    price: 3200,
    originalPrice: 4500,
    image: 'products/product-1.jpg',
    images: ['products/product-1.jpg', 'products/product-4.jpg'],
    category: 'tees',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Bone'],
    inStock: true,
    featured: true,
    badge: 'BEST SELLER',
    material: '100% Heavyweight Cotton (280gsm)',
  },
  {
    id: '2',
    title: 'Stamped Logo Hoodie',
    description: 'Heavy-gauge fleece hoodie with all-over stamp print on the back. Ribbed cuffs, boxy cut, brushed interior — built for the underground.',
    price: 5800,
    originalPrice: 7500,
    image: 'products/product-2.jpg',
    images: ['products/product-2.jpg', 'products/product-5.jpg'],
    category: 'hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Charcoal'],
    inStock: true,
    featured: true,
    badge: 'DROP EXCLUSIVE',
    material: '80% Cotton, 20% Polyester (400gsm fleece)',
  },
  {
    id: '3',
    title: 'Canvas Ink Jacket',
    description: 'Waxed canvas shell with ink-washed lining. Oversized silhouette, chest pocket with debossed closure — a jacket that outlives trends.',
    price: 9500,
    originalPrice: 12000,
    image: 'products/product-3.jpg',
    images: ['products/product-3.jpg', 'products/product-7.jpg'],
    category: 'jackets',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Olive'],
    inStock: true,
    featured: true,
    badge: '21% OFF',
    material: 'Waxed Canvas Shell, Cotton Lining',
  },
  {
    id: '4',
    title: 'Debossed Logo Cap',
    description: 'Six-panel structured cap with debossed PROJECT INKED logo on front. Adjustable strap, premium wool blend.',
    price: 2200,
    originalPrice: 2800,
    image: 'products/product-4.jpg',
    images: ['products/product-4.jpg'],
    category: 'accessories',
    sizes: ['ONE SIZE'],
    colors: ['Black'],
    inStock: true,
    featured: false,
    badge: 'LIMITED',
    material: '60% Wool, 40% Polyester',
  },
  {
    id: '5',
    title: 'Limited Run Graphic Tee',
    description: 'Single-color screen print, limited to 100 pieces globally. Once sold out — gone forever. Your chance to own a numbered piece.',
    price: 4200,
    originalPrice: 5500,
    image: 'products/product-5.jpg',
    images: ['products/product-5.jpg', 'products/product-8.jpg'],
    category: 'tees',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black'],
    inStock: true,
    featured: false,
    badge: '100 PCS ONLY',
    material: '100% Organic Cotton (220gsm)',
  },
  {
    id: '6',
    title: 'Oversized Logo Hoodie',
    description: 'Oversized boxy hoodie with large back print. Kangaroo pocket, dropped shoulders, heavy fleece interior for the cold nights.',
    price: 6500,
    originalPrice: 8200,
    image: 'products/product-6.jpg',
    images: ['products/product-6.jpg', 'products/product-9.jpg'],
    category: 'hoodies',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Washed Black'],
    inStock: true,
    featured: false,
    badge: '20% OFF',
    material: '100% Cotton Fleece (380gsm)',
  },
  {
    id: '7',
    title: 'Ink Wash Crewneck',
    description: 'Garment-dyed crewneck in signature ink wash finish. No two pieces are identical. Relaxed fit, dropped hem, embroidered chest mark.',
    price: 4800,
    originalPrice: 6000,
    image: 'products/product-7.jpg',
    images: ['products/product-7.jpg', 'products/product-1.jpg'],
    category: 'hoodies',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Ink Wash Black', 'Ink Wash Grey'],
    inStock: true,
    featured: false,
    badge: 'NEW DROP',
    material: '100% Garment-Dyed Cotton (320gsm)',
  },
  {
    id: '8',
    title: 'Signature Chain Necklace',
    description: 'Heavy-gauge stainless steel chain with ink-drop pendant. Oxidised black finish, water-resistant. Wears like armour.',
    price: 3500,
    originalPrice: 4200,
    image: 'products/product-8.jpg',
    images: ['products/product-8.jpg'],
    category: 'accessories',
    sizes: ['ONE SIZE'],
    colors: ['Silver/Black'],
    inStock: true,
    featured: false,
    badge: 'ACCESSORIES',
    material: '316L Stainless Steel, Oxidised Black',
  },
  {
    id: '9',
    title: 'Washed Denim Jacket',
    description: 'Stone-washed denim with custom ink transfer on the back panel. Raw cut cuffs, contrast stitching — this one is built to age.',
    price: 8800,
    originalPrice: 11500,
    image: 'products/product-9.jpg',
    images: ['products/product-9.jpg', 'products/product-3.jpg'],
    category: 'jackets',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Washed Indigo', 'Black Wash'],
    inStock: false,
    featured: false,
    badge: 'SOLD OUT',
    material: '100% Stone-Washed Denim (12oz)',
  },
];

const STORAGE_KEY = 'projectinked_products';

// Data loader function
function loadProducts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load products from localStorage', e);
  }
  // If not found in localStorage, initialize with default
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return [...DEFAULT_PRODUCTS];
}

// Save products to localStorage
function saveProducts(products) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    // Update live memory array reference
    window.PRODUCTS = products;
  } catch (e) {
    console.error('Failed to save products to localStorage', e);
  }
}

// Global dynamic array
window.PRODUCTS = loadProducts();
window.saveProducts = saveProducts;
window.loadProducts = loadProducts;

// CRUD Helper methods for Admin
window.ProductStore = {
  getAll: () => window.loadProducts(),
  getById: (id) => window.loadProducts().find(p => p.id === String(id)),
  add: (newProduct) => {
    const list = window.loadProducts();
    newProduct.id = newProduct.id || String(Date.now());
    list.unshift(newProduct);
    window.saveProducts(list);
    return newProduct;
  },
  update: (id, updatedFields) => {
    const list = window.loadProducts();
    const index = list.findIndex(p => String(p.id) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields };
      window.saveProducts(list);
      return list[index];
    }
    return null;
  },
  delete: (id) => {
    let list = window.loadProducts();
    list = list.filter(p => String(p.id) !== String(id));
    window.saveProducts(list);
    return true;
  },
  resetToDefault: () => {
    window.saveProducts([...DEFAULT_PRODUCTS]);
    return DEFAULT_PRODUCTS;
  }
};

/* ── Lookbook Data ── */
const LOOKBOOK = [
  { id: 'lb-1', title: 'THE CORE',      campaign: 'Drop 001', image: 'products/product-1.jpg', description: 'Heavyweight essentials built for the underground. The foundation of every rotation.', products: ['Ink Mark Oversized Tee', 'Washed Denim Jacket'] },
  { id: 'lb-2', title: 'STAMPED',        campaign: 'Drop 001', image: 'products/product-2.jpg', description: 'All-over print on brushed fleece. A bold statement without saying a word.', products: ['Stamped Logo Hoodie'] },
  { id: 'lb-3', title: 'CANVAS ARMOR',   campaign: 'Drop 001', image: 'products/product-3.jpg', description: 'Waxed shell. Oversized fit. Designed to outlast trends and weather the storm.', products: ['Canvas Ink Jacket', 'Signature Chain Necklace'] },
  { id: 'lb-4', title: 'DEBOSSED',       campaign: 'Drop 001', image: 'products/product-4.jpg', description: 'Subtle identity marks on premium wool blends.', products: ['Debossed Logo Cap'] },
  { id: 'lb-5', title: 'LIMITED',         campaign: 'Drop 001', image: 'products/product-5.jpg', description: 'Numbered pieces. Once sold out, gone forever.', products: ['Limited Run Graphic Tee'] },
  { id: 'lb-6', title: 'THE BOXY FIT',   campaign: 'Drop 001', image: 'products/product-6.jpg', description: 'Boxy cuts and dropped shoulders. Made to be lived in.', products: ['Oversized Logo Hoodie'] },
  { id: 'lb-7', title: 'INK WASH',       campaign: 'Drop 001', image: 'products/product-7.jpg', description: 'Garment dyed unique finishes. No two pieces are identical.', products: ['Ink Wash Crewneck'] },
  { id: 'lb-8', title: 'HARDWARE',       campaign: 'Drop 001', image: 'products/product-8.jpg', description: 'Oxidized stainless steel. Heavy gauge. Wears like armor.', products: ['Signature Chain Necklace'] },
  { id: 'lb-9', title: 'RAW EDGE',       campaign: 'Drop 001', image: 'products/product-9.jpg', description: 'Vintage aesthetics meeting modern streetwear proportions.', products: ['Washed Denim Jacket'] },
];
