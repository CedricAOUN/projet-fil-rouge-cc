import { Button, Paper, Typography, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BillingFailure() {
  const navigate = useNavigate();

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
        <Typography variant='h1'>Payment Failed</Typography>
        <Typography variant='h6'>
          Unfortunately, your payment could not be processed. Please try again
          or contact support for assistance.
        </Typography>
      </Paper>
      <Button variant='contained' onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Stack>
  );
}

export default BillingFailure;
