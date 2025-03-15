import { Paper, Stack, Typography } from '@mui/material'
import React from 'react'

function StepByStep({ steps }) {
  return (
    <Paper sx={{ flex: 1 }}>
      <Typography variant='h4'>Steps</Typography>
      <Stack>
        {steps}
      </Stack>
    </Paper>
  )
}

export default StepByStep