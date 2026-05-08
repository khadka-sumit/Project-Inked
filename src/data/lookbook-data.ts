export interface LookbookEntry {
  id: string;
  title: string;
  campaign: string;
  image: string;
  description: string;
  products: string[];
}

export const lookbookData: LookbookEntry[] = [
  {
    id: 'lb-1',
    title: 'THE CORE',
    campaign: 'Drop 001',
    image: '/products/product-1.jpg',
    description: 'Heavyweight essentials built for the underground. The foundation of every rotation.',
    products: ['Ink Mark Oversized Tee', 'Washed Denim Jacket'],
  },
  {
    id: 'lb-2',
    title: 'STAMPED',
    campaign: 'Drop 001',
    image: '/products/product-2.jpg',
    description: 'All-over print on brushed fleece. A bold statement without saying a word.',
    products: ['Stamped Logo Hoodie'],
  },
  {
    id: 'lb-3',
    title: 'CANVAS ARMOR',
    campaign: 'Drop 001',
    image: '/products/product-3.jpg',
    description: 'Waxed shell. Oversized fit. Designed to outlast trends and weather the storm.',
    products: ['Canvas Ink Jacket', 'Signature Chain Necklace'],
  },
  {
    id: 'lb-4',
    title: 'DEBOSSED',
    campaign: 'Drop 001',
    image: '/products/product-4.jpg',
    description: 'Subtle identity marks on premium wool blends.',
    products: ['Debossed Logo Cap'],
  },
  {
    id: 'lb-5',
    title: 'LIMITED',
    campaign: 'Drop 001',
    image: '/products/product-5.jpg',
    description: 'Numbered pieces. Once sold out, gone forever.',
    products: ['Limited Run Graphic Tee'],
  },
  {
    id: 'lb-6',
    title: 'THE BOXY FIT',
    campaign: 'Drop 001',
    image: '/products/product-6.jpg',
    description: 'Boxy cuts and dropped shoulders. Made to be lived in.',
    products: ['Oversized Logo Hoodie'],
  },
  {
    id: 'lb-7',
    title: 'INK WASH',
    campaign: 'Drop 001',
    image: '/products/product-7.jpg',
    description: 'Garment dyed unique finishes. No two pieces are identical.',
    products: ['Ink Wash Crewneck'],
  },
  {
    id: 'lb-8',
    title: 'HARDWARE',
    campaign: 'Drop 001',
    image: '/products/product-8.jpg',
    description: 'Oxidized stainless steel. Heavy gauge. Wears like armor.',
    products: ['Signature Chain Necklace'],
  },
  {
    id: 'lb-9',
    title: 'RAW EDGE',
    campaign: 'Drop 001',
    image: '/products/product-9.jpg',
    description: 'Vintage aesthetics meeting modern streetwear proportions.',
    products: ['Washed Denim Jacket'],
  },
];
