import {
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useGetPlanDetailsQuery } from '@/api/plansApi';
import { useState } from 'react';
import { useCheckoutMutation } from '@/api/authApi';
import { PREMIUM_TIERS } from '@/constants/premiumPlans';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

function Checkout({ paymentSectionRef, selectedTier, onTierSelect }) {
  const currentUserId = useSelector(
    (state: RootState) => state.user.currentUser?.id,
  );
  const isLoggedIn = Boolean(currentUserId);

  const [selectedBilling, setSelectedBilling] = useState('monthly');

  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation();
  const handleCheckout = async () => {
    checkout({ product: selectedTier, interval: selectedBilling })
      .unwrap()
      .then((response) => {
        window.location.href = response.checkout_url;
      })
      .catch((error) => {
        console.error('Checkout error:', error);
      });
  };

  // Fetch chosen plan details
  const selectedPlan = PREMIUM_TIERS.find((tier) => tier.id === selectedTier);
  const selectedPlanStripeId = selectedPlan?.stripePriceMap[selectedBilling];

  const { data: planDetails, isLoading: isPlanDetailsLoading } =
    useGetPlanDetailsQuery(selectedPlanStripeId, {
      skip: !selectedPlanStripeId,
    });

  return (
    <>
      <Typography variant='h1' ref={paymentSectionRef}>
        Plan Selection
      </Typography>
      <Stack direction='row' width='100%' gap={2} mb={5} flexWrap='wrap'>
        <Paper
          sx={{
            flexGrow: 1,
            gap: '10px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack direction='row' alignItems={'center'} gap={1}>
            <ReceiptIcon />
            <Typography variant='h6'>Subscription information</Typography>
          </Stack>
          <Select
            fullWidth
            size='small'
            value={selectedTier}
            onChange={(e) => onTierSelect(e.target.value)}
          >
            <MenuItem value='premium'>Sous Chef</MenuItem>
            <MenuItem value='chef'>Master Chef</MenuItem>
          </Select>
          <Select
            fullWidth
            size='small'
            value={selectedBilling}
            onChange={(e) => setSelectedBilling(e.target.value)}
          >
            <MenuItem value='monthly'>Monthly</MenuItem>
            <MenuItem value='6_months'>Every 6 Months</MenuItem>
            <MenuItem value='annual'>Yearly</MenuItem>
          </Select>
          {isPlanDetailsLoading ? (
            <Stack direction={'row'} justifyContent={'center'} p={3}>
              <CircularProgress size={'50px'} />
            </Stack>
          ) : (
            <>
              <Typography variant='body2' fontSize={18}>
                Price now: {planDetails?.price}
              </Typography>
              <Typography variant='body2' fontSize={18}>
                Equivalent to {planDetails?.monthlyPrice ?? 'N/A'}/month
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                You will be charged based on the selected billing cycle. You can
                cancel anytime.
              </Typography>
            </>
          )}
          <Button
            variant='contained'
            color='primary'
            onClick={handleCheckout}
            disabled={isCheckoutLoading || isPlanDetailsLoading || !isLoggedIn}
          >
            {isCheckoutLoading
              ? 'Processing...'
              : isLoggedIn
                ? 'Proceed to Checkout'
                : 'You must be logged in'}
          </Button>
        </Paper>
      </Stack>
    </>
  );
}

export default Checkout;
