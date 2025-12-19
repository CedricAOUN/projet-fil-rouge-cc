import { Paper, Stack, Typography } from '@mui/material';
import React from 'react';

function StepByStep({ instructions }) {
  // Parse if it's a JSON string, otherwise use as-is
  const steps = typeof instructions === 'string' ? JSON.parse(instructions) : instructions;

  return (
    <Paper sx={{ flex: 1, p: 2 }}>
      <Typography variant='h4' gutterBottom>Steps</Typography>
      <Stack gap={2}>
        {steps?.map((step, index) => (
          <Stack key={index} direction='row' spacing={1}>
            <Typography variant='body1' fontWeight='bold'>
              {step.step}.
            </Typography>
            <Typography variant='body1'>
              {step.instruction}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

export default StepByStep;
