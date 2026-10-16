import ContentPanel from '@/components/Layout/ContentPanel';
import { useTranslation } from 'react-i18next';
import { Button, Typography, Stack } from '@mui/material';
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
        <Typography variant='h1'>{t("Checkout cancelled")}</Typography>
        <Typography variant='h6' component='p'>{t("You cancelled checkout before completing your subscription. You can return to Premium whenever you are ready.")}</Typography>
      </ContentPanel>
      <Button variant='outlined' onClick={() => navigate('/premium')}>{t('Discover Premium')}</Button>
      <Button variant='contained' onClick={() => navigate('/')}>{t("Back to Home")}</Button>
    </Stack>
  );
}

export default BillingFailure;
