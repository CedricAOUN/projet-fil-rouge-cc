import { Paper, Stack, Typography } from '@mui/material';
import React from 'react';

function StepByStep({ instructions }) {

  return (
    <Paper sx={{ flex: 1, p: 2 }}>
      <Typography variant='h4' gutterBottom>Steps</Typography>
      <Stack gap={2}>
        <Typography variant='body1'>
          {instructions}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default StepByStep;
