import { useTranslation } from 'react-i18next';
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
import { getPremiumTiers } from '@/constants/premiumPlans';
import Checkout from '@/components/Checkout/Checkout';
import { useGetCurrentUserQuery } from '@/api/authApi';

function PremiumPage() {
  const { t } = useTranslation();
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
        <Typography variant='h1'>{t("Premium")}</Typography>
        <Typography variant='h6' component='p' color='success.main'>
          {t('You are already a {{membership}}. Your subscription will be renewed on {{date}}.', {
            membership: currentUser?.is_chef ? t('Chef') : t('Premium member'),
            date: dayjs(currentUser?.premium_expire).format('MMMM D, YYYY'),
          })}
        </Typography>
        <Button variant='contained' color='primary' disabled>{t("Subscription management is not yet available")}</Button>
      </Paper>
    );
  }

  return (
    <Stack gap={3}>
      <Typography variant='h1'>{t("Premium")}</Typography>
      <Stack direction={isMobile ? 'column' : 'row'} width='100%' gap={1}>
        {getPremiumTiers(t).map((tier, index) => (
          <Badge
            key={index}
            badgeContent={tier?.isPopular && t("Recommended")}
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
              <Typography variant='h4' component='h2' fontWeight={700}>
                {tier?.title}
              </Typography>

              {/* Pricing + Button */}
              <Stack justifyContent={'center'} height='100%' gap={1}>
                {tier?.prevPrice && (
                  <Typography
                    variant='h2' component='p'
                    fontSize={50}
                    color='text.disabled'
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ${tier?.prevPrice}
                  </Typography>
                )}
                <Typography
                  variant='h2' component='p'
                  fontSize={50}
                  mb={tier?.price === 0 ? '60px' : undefined}
                >
                  {tier?.price !== 0 ? `$${tier.price}` : t("Free")}
                </Typography>
                {tier?.isSelectable && (
                  <Button
                    onClick={() => handleTierSelect(tier.id)}
                    sx={{ mt: '30px' }}
                  >{t("Get Started")}</Button>
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
