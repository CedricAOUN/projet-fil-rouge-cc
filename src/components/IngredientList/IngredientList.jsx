import { Paper, Stack, Typography } from '@mui/material'
import React from 'react'

function IngredientList({ ingredients }) {
  return (
    <Paper sx={{ padding: '20px', borderRadius: '15px', flex: 1}}>
      <Typography fontSize={24}>Ingredients</Typography>
      <Stack>
        {ingredients}
      </Stack>
    </Paper>
  )
}

export default IngredientList