import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import DoneIcon from '@mui/icons-material/Done';
import { useRef, useState } from 'react';
import dayjs from 'dayjs';
import { getPremiumTiers } from '@/constants/premiumPlans';
import Checkout from '@/components/Checkout/Checkout';
import { useGetCurrentUserQuery } from '@/api/authApi';
import ContentPanel from '@/components/Layout/ContentPanel';

export default function PremiumPage() {
  const { t } = useTranslation();
  const paymentSectionRef = useRef<HTMLHeadingElement>(null);
  const { data: currentUser } = useGetCurrentUserQuery();
  const [selectedTier, setSelectedTier] = useState('premium');
  const handleTierSelect = (id: string) => {
    setSelectedTier(id);
    paymentSectionRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };
  if (currentUser?.is_premium) return <ContentPanel>
    <Stack gap={3}>
      <Typography variant='h1'>{t('Premium')}</Typography>
      <Typography color='success.main'>{t('You are already a {{membership}}. Your subscription will be renewed on {{date}}.', { membership: currentUser.is_chef ? t('Chef') : t('Premium member'), date: dayjs(currentUser.premium_expire).format('MMMM D, YYYY') })}</Typography>
      <Button variant='contained' disabled>{t('Subscription management is not yet available')}</Button>
    </Stack>
  </ContentPanel>;
  return <Stack gap={5}>
    <Typography variant='h1'>{t('Premium')}</Typography>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' }, gap: 3 }}>
      {getPremiumTiers(t).map(tier => <ContentPanel key={tier.id} sx={(theme) => ({ display: 'flex', flexDirection: 'column', gap: 3, borderColor: tier.isPopular ? 'premium.main' : 'divider', bgcolor: tier.isPopular ? alpha(theme.palette.premium.main, 0.04) : 'background.paper' })}>
        <Box sx={{ minHeight: 32 }}>{tier.isPopular && <Chip label={t('Recommended')} size='small' sx={(theme) => ({ bgcolor: alpha(theme.palette.premium.main, 0.12), color: 'premium.main' })} />}</Box>
        <Typography variant='h3' component='h2'>{tier.title}</Typography>
        <Box>
          {tier.prevPrice && <Typography color='text.secondary' sx={{ textDecoration: 'line-through' }}>${tier.prevPrice}</Typography>}
          <Typography variant='h2' component='p'>{tier.price !== 0 ? `$${tier.price}` : t('Free')}</Typography>
        </Box>
        <Stack spacing={2} sx={{ flex: 1 }}>
          {tier.features.map(feature => <Stack key={feature} direction='row' gap={1.5}><DoneIcon color='success' fontSize='small' sx={{ mt: 0.5 }} /><Typography variant='body2'>{feature}</Typography></Stack>)}
        </Stack>
        {tier.isSelectable && <Button variant={selectedTier === tier.id ? 'contained' : 'outlined'} onClick={() => handleTierSelect(tier.id)}>{t('Get Started')}</Button>}
      </ContentPanel>)}
    </Box>
    <Checkout paymentSectionRef={paymentSectionRef} selectedTier={selectedTier} onTierSelect={handleTierSelect} />
  </Stack>;
}
