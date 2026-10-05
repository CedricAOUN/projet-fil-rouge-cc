import { useTranslation } from 'react-i18next';
import { Paper, Stack, Typography } from '@mui/material';
import React from 'react';

function StepByStep({ instructions }) {
  const { t } = useTranslation();

  return (
    <Paper sx={{ flex: 1, p: 2 }}>
      <Typography variant='h4' component='h2' gutterBottom>{t("Steps")}</Typography>
      <Stack gap={2}>
        <Typography variant='body1'>
          {instructions}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default StepByStep;
