import ContentPanel from '@/components/Layout/ContentPanel';
import { useTranslation } from 'react-i18next';
import { Button, Paper, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BillingFailure() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Stack height='100%' justifyContent='center' alignItems='center' gap={3}>
      <ContentPanel
        sx={{
          display: 'flex',
          gap: 2,
          padding: 2,
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant='h1'>{t("Payment Failed")}</Typography>
        <Typography variant='h6' component='p'>{t("Unfortunately, your payment could not be processed. Please try again or contact support for assistance.")}</Typography>
      </ContentPanel>
      <Button variant='contained' onClick={() => navigate('/')}>{t("Back to Home")}</Button>
    </Stack>
  );
}

export default BillingFailure;
