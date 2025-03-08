import { Paper, Stack, Typography } from '@mui/material'
import React from 'react'

function StepByStep({ steps }) {
  return (
    <Paper sx={{ padding: '20px', borderRadius: '15px', flex: 1 }}>
      <Typography fontSize={24}>Steps</Typography>
      <Stack>
        {steps}
      </Stack>
    </Paper>
  )
}

export default StepByStep