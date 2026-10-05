import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';

function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant='h1' component='p' fontSize={60}>
        404
      </Typography>
      <Typography variant='h1'>{t("Woops! This page doesn't exist.")}</Typography>
    </>
  );
}

export default NotFound;
