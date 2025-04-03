import {
  Button,
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
    id: 'sous-chef',
    title: 'Sous Chef',
    price: 9.99,
    prevPrice: 15.99,
    features: ['View Basic Recipes', 'View Premium Recipes', 'Create Recipes'],
    isSelectable: true,
    isPopular: true,
  },
  {
    id: 'master-chef',
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
  const [selectedTier, setSelectedTier] = useState('sous-chef');

  const handleTierSelect = (id) => {
    setSelectedTier(id);
    paymentSectionRef.current?.scrollIntoView({ behaviour: 'smooth' });
  };

  return (
    <Stack gap={3}>
      <Typography variant='h1'>Premium</Typography>
      <Stack direction={isMobile ? 'column' : 'row'} width='100%' gap={1}>
        {PREMIUM_TIERS.map((tier, index) => (
          <Paper
            key={index}
            sx={{
              flexGrow: 1,
              textAlign: 'center',
              display: 'grid',
              gridTemplateRows: '1fr 2fr 3fr',
              gap: '10px',
            }}
          >
            <Typography variant='h4' fontWeight={700}>
              {tier.title}
            </Typography>

            <Stack justifyContent={'center'} height='100%' gap={1}>
              <Typography
                variant='h2'
                fontSize={50}
                color='text.disabled'
                sx={{ textDecoration: 'line-through' }}
              >
                ${tier?.prevPrice}
              </Typography>
              <Typography
                variant='h2'
                fontSize={50}
                mb={tier.price === 0 ? '60px' : undefined}
              >
                {tier?.price !== 0 ? `$${tier.price}` : 'Free'}
              </Typography>
              {tier.price !== 0 && (
                <Typography
                  variant='subtitle'
                  mb={tier.price === 'Free' ? '60px' : undefined}
                >
                  ${tier.price * 12} per year
                </Typography>
              )}
              {tier?.isSelectable && (
                <Button onClick={() => handleTierSelect(tier.id)}>
                  Get Started
                </Button>
              )}
            </Stack>
            <Stack mt={4} gap={2}>
              {tier?.features?.map((feat, index) => (
                <Stack direction='row' gap={1} key={index}>
                  <DoneIcon color='success' />
                  <Typography variant='subtitle'>{feat}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Typography variant='h1' ref={paymentSectionRef}>
        Payment
      </Typography>
      <Stack direction='row' width='100%' gap={2}>
        <Paper
          sx={{
            maxWidth: '500px',
            flexGrow: 1,
            gap: '10px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stack direction='row' alignItems={'center'} gap={1}>
            <CreditCardIcon />
            <Typography variant='h6'>Card details</Typography>
          </Stack>
          <TextField placeholder='Card holder name' size='small' />
          <TextField placeholder='Card number' size='small' />
          <TextField
            placeholder='CVC'
            size='small'
            sx={{ maxWidth: '100px' }}
          />
        </Paper>
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
            <MenuItem value='sous-chef'>Sous Chef</MenuItem>
            <MenuItem value='master-chef'>Master Chef</MenuItem>
          </Select>
        </Paper>
      </Stack>
    </Stack>
  );
}

export default PremiumPage;
