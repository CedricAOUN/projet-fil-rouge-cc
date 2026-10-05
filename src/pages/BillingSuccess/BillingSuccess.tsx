import { useTranslation } from 'react-i18next';
import React from 'react';
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { formatPrice, useGetOrderDetailsQuery } from '@/api/plansApi';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const BillingSuccess = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const stripeSessionId = new URLSearchParams(window.location.search).get(
    'session_id',
  );

  const { data, isLoading } = useGetOrderDetailsQuery(stripeSessionId!, {
    skip: !stripeSessionId,
  });

  const price = formatPrice(data?.amount_total, data?.currency);
  const createdAt = data?.created
    ? dayjs(new Date(data.created * 1000)).format('MMMM D, YYYY')
    : null;

  return (
    <Stack height='100%' justifyContent='center' alignItems='center' gap={3}>
      <Paper
        sx={{
          display: 'flex',
          gap: 2,
          padding: 2,
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant='h1'>{t("Payment Successful")}</Typography>
        <Typography variant='h6' component='p'>{t("Thank you for your payment. Your subscription has been activated.")}</Typography>
      </Paper>
      <Paper>
        <Typography variant='h6' component='h2'>{t("Order Details:")}</Typography>
        {isLoading ? (
          <Stack direction={'row'} justifyContent={'center'} p={3}>
            <CircularProgress size={'50px'} />
          </Stack>
        ) : (
          <Stack width='100%' padding={2} gap={1}>
            <Typography>{t('User: {{email}}', { email: data?.customer_details?.email })}</Typography>
            <Typography>{t('Date of purchase: {{date}}', { date: createdAt })}</Typography>
            <Typography>{t('Order ID: {{id}}', { id: data?.id })}</Typography>
            <Typography>{t('Amount Paid: {{price}}', { price })}</Typography>
          </Stack>
        )}
      </Paper>
      <Button variant='contained' onClick={() => navigate('/')}>{t("Back to Home")}</Button>
    </Stack>
  );
};

export default BillingSuccess;
