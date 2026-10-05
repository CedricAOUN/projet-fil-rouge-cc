import type { TFunction } from 'i18next';
import { Unit } from '@/api/api.types';

export const getUnits = (t: TFunction): Unit[] => [
  { value: 'ml', label: t("Milliliter (ml)") },
  { value: 'l', label: t("Liter (L)") },
  { value: 'pcs', label: t("Pieces") },
  { value: 'tsp', label: t("Teaspoon (tsp)") },
  { value: 'tbsp', label: t("Tablespoon (tbsp)") },
  { value: 'cup', label: t("Cup") },
  { value: 'fl_oz', label: t("Fluid Ounce (fl oz)") },
  { value: 'g', label: t("Gram (g)") },
  { value: 'kg', label: t("Kilogram (kg)") },
  { value: 'oz', label: t("Ounce (oz)") },
  { value: 'lb', label: t("Pound (lb)") },
];

export const UNIT_VALUES = ['ml', 'l', 'pcs', 'tsp', 'tbsp', 'cup', 'fl_oz', 'g', 'kg', 'oz', 'lb'];
