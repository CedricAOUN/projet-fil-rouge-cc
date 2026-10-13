import type { TFunction } from 'i18next';

export const RECIPE_CATEGORY_VALUES = ['breakfast', 'starter', 'main', 'side', 'dessert', 'snack', 'drink', 'other'] as const;
export type RecipeCategory = typeof RECIPE_CATEGORY_VALUES[number];

export const getRecipeCategories = (t: TFunction) => [
  { value: 'breakfast', label: t('Breakfast') },
  { value: 'starter', label: t('Starter') },
  { value: 'main', label: t('Main course') },
  { value: 'side', label: t('Side dish') },
  { value: 'dessert', label: t('Dessert') },
  { value: 'snack', label: t('Snack') },
  { value: 'drink', label: t('Drink') },
  { value: 'other', label: t('Other') },
];
