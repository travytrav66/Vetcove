// Sample data for the hero comparison demo.
// Prices and stock states mirror the examples on the current shop.vetcove.com homepage.

export const vendors = {
  A: { name: 'Vendor A', color: '#E5484D' },
  B: { name: 'Vendor B', color: '#1E9E63' },
  C: { name: 'Vendor C', color: '#F08C00' },
  D: { name: 'Vendor D', color: '#1F8FF0' },
};

// `sprite` is the product's position in products.webp (5 images in one row)
export const products = [
  {
    id: 'carprofen',
    query: 'carprofen 75',
    name: 'Carprofen Caplets',
    variant: '75mg, 180 count',
    units: 180,
    unit: 'tab',
    sprite: 0,
    offers: [
      ['A', 'in', 46.1],
      ['B', 'alt', 48.92],
      ['C', 'out', 56.0],
      ['D', 'in', 51.23],
    ],
  },
  {
    id: 'lrs',
    query: 'lactated ringers 1l',
    name: 'Lactated Ringer’s',
    variant: '1 liter bag, 12 count',
    units: 12,
    unit: 'bag',
    sprite: 1,
    offers: [
      ['A', 'in', 68.12],
      ['B', 'in', 71.65],
      ['C', 'in', 76.81],
      ['D', 'in', 62.82],
    ],
  },
  {
    id: 'amox',
    query: 'amoxicillin 500',
    name: 'Amoxicillin Capsules',
    variant: '500mg, 500 count',
    units: 500,
    unit: 'cap',
    sprite: 2,
    offers: [
      ['A', 'out', 25.42],
      ['B', 'alt', 28.41],
      ['C', 'in', 19.82],
      ['D', 'in', 33.79],
    ],
  },
  {
    id: 'ace',
    query: 'acepromazine inj',
    name: 'Acepromazine Injection',
    variant: '50ml (10mg/ml)',
    units: 50,
    unit: 'mL',
    sprite: 3,
    offers: [
      ['A', 'in', 15.12],
      ['B', 'in', 14.89],
      ['C', 'out', 16.11],
      ['D', 'in', 13.92],
    ],
  },
];

export const stockLabel = { in: 'In stock', alt: 'Alt. warehouse', out: 'Out of stock' };
export const stockRank = { in: 0, alt: 1, out: 2 };
