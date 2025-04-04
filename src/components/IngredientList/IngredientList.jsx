import { Paper, Stack, Typography } from '@mui/material';
import React from 'react';

function IngredientList({ ingredients }) {
  return (
    <Paper sx={{ flex: 1 }}>
      <Typography variant='h4'>Ingredients</Typography>
      <Stack>
        {ingredients.map((ingr, index) => (
          <Typography variant='subtitle' key={index}>
            - {ingr.name} x {ingr.amount} {ingr.unit}
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
}

export default IngredientList;
