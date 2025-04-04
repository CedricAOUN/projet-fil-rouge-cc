import { Paper, Stack, Typography } from '@mui/material';
import React from 'react';

function StepByStep({ instructions }) {
  return (
    <Paper sx={{ flex: 1 }}>
      <Typography variant='h4'>Steps</Typography>
      <Stack>{instructions}</Stack>
    </Paper>
  );
}

export default StepByStep;
