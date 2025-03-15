import { Button, Paper, Typography } from '@mui/material'
import React from 'react'

function PremiumCard() {
  return (
    <Paper>
      <Typography variant='h3'>Premium</Typography>
      <Typography variant='subtitle1'>Become a Chef, View Premium Recipes and more!</Typography>
      <Button variant='contained' href='/premium'>Get Premium</Button>
    </Paper>
  )
}

export default PremiumCard