import React from 'react';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { formatPrice, useGetOrderDetailsQuery } from '@/api/plansApi';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const BillingSuccess = () => {
  const navigate = useNavigate();
  const stripeSessionId = new URLSearchParams(window.location.search).get(
    'session_id',
  );

  const { data, isLoading } = useGetOrderDetailsQuery(stripeSessionId!, {
    skip: !stripeSessionId,
  });

  console.log('Order details:', data);

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
        <Typography variant='h1'>Payment Successful</Typography>
        <Typography variant='h6'>
          Thank you for your payment. Your subscription has been activated.
        </Typography>
      </Paper>
      <Paper>
        <Typography variant='h6'>Order Details:</Typography>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Stack width='100%' padding={2} gap={1}>
            <Typography>User: {data?.customer_details?.email}</Typography>
            <Typography>Date of purchase: {createdAt}</Typography>
            <Typography>Order ID: {data?.id}</Typography>
            <Typography>Amount Paid: {price}</Typography>
          </Stack>
        )}
      </Paper>
      <Button variant='contained' onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Stack>
  );
};

export default BillingSuccess;
