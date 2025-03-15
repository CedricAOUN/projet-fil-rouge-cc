import { Paper, Stack, Typography } from '@mui/material'
import React from 'react'

function IngredientList({ ingredients }) {
  return (
    <Paper sx={{ flex: 1 }}>
      <Typography variant='h4'>Ingredients</Typography>
      <Stack>
        {ingredients}
      </Stack>
    </Paper>
  )
}

export default IngredientList