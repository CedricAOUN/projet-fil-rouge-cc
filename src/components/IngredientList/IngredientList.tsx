import { useTranslation } from 'react-i18next';
import { Ingredient } from '@/api/api.types';
import { Paper, Stack, Typography } from '@mui/material';
import React from 'react';

function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  const { t } = useTranslation();
  if (!ingredients || ingredients.length === 0) {
    return (
      <Paper sx={{ flex: 1 }}>
        <Typography variant='h4' component='h2'>{t("Ingredients")}</Typography>
        <Typography variant='subtitle1'>{t("No ingredients available.")}</Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ flex: 1 }}>
      <Typography variant='h4' component='h2'>{t("Ingredients")}</Typography>
      <Stack>
        {ingredients.map((ingr, index) => (
          <Typography variant='subtitle1' key={index}>
            - {ingr.name} x {ingr.quantity} {ingr.unit}
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
}

export default IngredientList;
