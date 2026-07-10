export const PREMIUM_TIERS = [
  {
    id: 'basic',
    title: 'Home Cook',
    price: 0,
    prevPrice: null,
    features: ['View Basic Recipes'],
    isSelectable: false,
    stripePriceMap: null,
  },
  {
    id: 'premium',
    title: 'Sous Chef',
    price: 9.99,
    features: ['View Basic Recipes', 'View Premium Recipes', 'Create Recipes'],
    isSelectable: true,
    isPopular: true,
    stripePriceMap: {
      monthly: 'price_1TqzhZDI4opewoDuH4fREc7I',
      '6_months': 'price_1TqzkJDI4opewoDuwYX0Jdmv',
      annual: 'price_1TqzkJDI4opewoDuwX8nn38J',
    },
  },
  {
    id: 'chef',
    title: 'Master Chef',
    price: '19.99',
    features: [
      'View Basic Recipes',
      'View Premium Recipes',
      'Create Recipes',
      'Become a chef',
      'Create Premium Recipes',
    ],
    isSelectable: true,
    stripePriceMap: {
      monthly: 'price_1TqzoDDI4opewoDueNdyT307',
      '6_months': 'price_1TqzoDDI4opewoDun7UE5puy',
      annual: 'price_1TqzoDDI4opewoDuth4apRJ6',
    },
  },
];
