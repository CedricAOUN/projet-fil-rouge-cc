import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import React from 'react'

function ServerError() {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant='h1' component='p' fontSize={60}>
        500
      </Typography>
      <Typography variant='h1'>{t("Woops! Something went wrong on our end. Please try again later.")}</Typography>
    </>
  );
}

export default ServerError