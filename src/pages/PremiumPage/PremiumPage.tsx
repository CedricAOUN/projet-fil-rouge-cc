import {
  Badge,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import React, { useRef, useState } from 'react';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { PREMIUM_TIERS } from '@/constants/premiumPlans';
import Checkout from '@/components/Checkout/Checkout';
import { useGetCurrentUserQuery } from '@/api/authApi';

function PremiumPage() {
  const isMobile = useMediaQuery('(max-width:900px)');
  const paymentSectionRef = useRef(null);
  const { data: currentUser } = useGetCurrentUserQuery();

  const [selectedTier, setSelectedTier] = useState('premium');

  const handleTierSelect = (id) => {
    setSelectedTier(id);
    paymentSectionRef.current?.scrollIntoView({ behaviour: 'smooth' });
  };

  if (currentUser?.is_premium) {
    return (
      <Paper
        sx={{ gap: 3, padding: 2, display: 'flex', flexDirection: 'column' }}
      >
        <Typography variant='h1'>Premium</Typography>
        <Typography variant='h6' color='success.main'>
          You are already a {currentUser?.is_chef ? 'Chef' : 'Premium member'}.
          Your subscription will be renewed on{' '}
          {dayjs(currentUser?.premium_expire).format('MMMM D, YYYY')}.
        </Typography>
        <Button variant='contained' color='primary'>
          Manage Subscription
        </Button>
      </Paper>
    );
  }

  return (
    <Stack gap={3}>
      <Typography variant='h1'>Premium</Typography>
      <Stack direction={isMobile ? 'column' : 'row'} width='100%' gap={1}>
        {PREMIUM_TIERS.map((tier, index) => (
          <Badge
            key={index}
            badgeContent={tier?.isPopular && 'Recommended'}
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
                {tier?.isSelectable && (
                  <Button
                    onClick={() => handleTierSelect(tier.id)}
                    sx={{ mt: '30px' }}
                  >
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
      <Checkout
        paymentSectionRef={paymentSectionRef}
        selectedTier={selectedTier}
        onTierSelect={handleTierSelect}
      />
    </Stack>
  );
}

export default PremiumPage;
