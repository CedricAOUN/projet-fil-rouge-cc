import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import React from 'react'

function Unauthorized() {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant='h1' component='p' fontSize={60}>
        403
      </Typography>
      <Typography variant='h1'>{t("Woops! You are not authorized to view this page.")}</Typography>
    </>
  );
}

export default Unauthorized