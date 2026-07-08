import {
  Badge,
  Box,
  Button,
  Menu,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import React, { useRef, useState } from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useCheckoutMutation, useSubscriptionStatusQuery } from '@/api/authApi';
import dayjs from 'dayjs';

// TODO: Put these in DB for configuration
const PREMIUM_TIERS = [
  {
    id: 'home-cook',
    title: 'Home Cook',
    price: 0,
    prevPrice: null,
    features: ['View Basic Recipes'],
    isSelectable: false,
  },
  {
    id: 'premium',
    title: 'Sous Chef',
    price: 9.99,
    prevPrice: 15.99,
    features: ['View Basic Recipes', 'View Premium Recipes', 'Create Recipes'],
    isSelectable: true,
    isPopular: true,
  },
  {
    id: 'chef',
    title: 'Master Chef',
    price: '17.99',
    prevPrice: '23.99',
    features: [
      'View Basic Recipes',
      'View Premium Recipes',
      'Create Recipes',
      'Become a chef',
      'Create Premium Recipes',
    ],
    isSelectable: true,
  },
];

function PremiumPage() {
  const isMobile = useMediaQuery('(max-width:900px)');
  const paymentSectionRef = useRef(null);
  const [selectedTier, setSelectedTier] = useState('premium');
  const [selectedBilling, setSelectedBilling] = useState('monthly');
  const currentUserId = useSelector((state: RootState) => state.user.currentUser?.id);

  const { data: subscriptionStatus } = useSubscriptionStatusQuery({
    userId: currentUserId,
  }, {
    skip: !currentUserId,
  });
  const isSubscribed = subscriptionStatus?.is_subscribed;

  const handleTierSelect = (id) => {
    setSelectedTier(id);
    paymentSectionRef.current?.scrollIntoView({ behaviour: 'smooth' });
  };
  
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

  if(isSubscribed) {
    return (
        <Stack gap={3}>
          <Typography variant='h1'>Premium</Typography>
          <Typography variant='h6' color='success.main'>
            You are already a subscribed user. Your subscription will be renewed on {dayjs(subscriptionStatus?.subscription.current_period_end).format('MMMM D, YYYY')}.
          </Typography>
          <Button variant='contained' color='primary'>Manage Subscription</Button>
        </Stack>
    )
  }

  return (
    <Stack gap={3}>
      <Typography variant='h1'>Premium</Typography>
      {isSubscribed && (
        <Typography variant='h6' color='success.main'>
          You are already a subscribed user. Your subscription will be renewed on {dayjs(subscriptionStatus?.subscription.current_period_end).format('MMMM D, YYYY')}.
        </Typography>
      )}
      <Stack direction={isMobile ? 'column' : 'row'} width='100%' gap={1}>
        {PREMIUM_TIERS.map((tier, index) => (
          <Badge
            key={index}
            badgeContent={tier?.isPopular && 'Most Popular'}
            color='secondary'
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
              flexGrow: 1,
              '& .MuiBadge-badge': {
                transform: 'translate(-5%, -30%)',
              },
            }}
          >
            <Paper
              sx={{
                flexGrow: 1,
                textAlign: 'center',
                display: 'grid',
                gridTemplateRows: '1fr 2fr 3fr',
                gap: '10px',
                position: 'relative',
              }}
            >
              {/* Title */}
              <Typography variant='h4' fontWeight={700}>
                {tier?.title}
              </Typography>

              {/* Pricing + Button */}
              <Stack justifyContent={'center'} height='100%' gap={1}>
                {tier?.prevPrice && (
                  <Typography
                    variant='h2'
                    fontSize={50}
                    color='text.disabled'
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ${tier?.prevPrice}
                  </Typography>
                )}
                <Typography
                  variant='h2'
                  fontSize={50}
                  mb={tier?.price === 0 ? '60px' : undefined}
                >
                  {tier?.price !== 0 ? `$${tier.price}` : 'Free'}
                </Typography>
                {tier?.price !== 0 && (
                  <Typography
                    variant='subtitle2'
                    mb={tier?.price === 'Free' ? '60px' : undefined}
                  >
                    ${tier?.price as number * 12} per year
                  </Typography>
                )}
                {tier?.isSelectable && (
                  <Button onClick={() => handleTierSelect(tier.id)}>
                    Get Started
                  </Button>
                )}
              </Stack>

              {/* Features */}
              <Stack mt={4} gap={2}>
                {tier?.features?.map((feat, index) => (
                  <Stack direction='row' gap={1} key={index}>
                    <DoneIcon color='success' />
                    <Typography variant='subtitle2'>{feat}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>
          </Badge>
        ))}
      </Stack>
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
            onChange={(e) => setSelectedTier(e.target.value)}
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
          <Typography variant='body2' fontSize={24}>
            Plan: {PREMIUM_TIERS.find((tier) => tier.id === selectedTier)?.title}
          </Typography>
          <Typography variant='body2' fontSize={24}>
            Price per month: ${PREMIUM_TIERS.find((tier) => tier.id === selectedTier)?.price}
          </Typography>
          <Typography variant='body2' fontSize={24}>
            Total Price: ${PREMIUM_TIERS.find((tier) => tier.id === selectedTier)?.price}
          </Typography>

          <Typography variant='body2' color='text.secondary'>
            You will be charged based on the selected billing cycle. You can cancel anytime.
          </Typography>
          <Button variant='contained' color='primary' onClick={handleCheckout}>
            Proceed to Payment
          </Button>
        </Paper>
      </Stack>
    </Stack>
  );
}

export default PremiumPage;
