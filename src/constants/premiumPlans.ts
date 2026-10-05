import type { TFunction } from 'i18next';
export const getPremiumTiers = (t: TFunction) => [
  {
    id: 'basic',
    title: t("Home Cook"),
    price: 0,
    prevPrice: null,
    features: [t("View Basic Recipes")],
    isSelectable: false,
    stripePriceMap: null,
  },
  {
    id: 'premium',
    title: t("Sous Chef"),
    price: 9.99,
    features: [t("View Basic Recipes"), t("View Premium Recipes"), t("Create Recipes")],
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
    title: t("Master Chef"),
    price: '19.99',
    features: [
      t("View Basic Recipes"),
      t("View Premium Recipes"),
      t("Create Recipes"),
      t("Become a chef"),
      t("Create Premium Recipes"),
    ],
    isSelectable: true,
    stripePriceMap: {
      monthly: 'price_1TqzoDDI4opewoDueNdyT307',
      '6_months': 'price_1TqzoDDI4opewoDun7UE5puy',
      annual: 'price_1TqzoDDI4opewoDuth4apRJ6',
    },
  },
];
