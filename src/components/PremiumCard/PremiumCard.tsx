import { useTranslation } from 'react-i18next';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import { Button, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import ContentPanel from '@/components/Layout/ContentPanel';

export default function PremiumCard() {
  const { t } = useTranslation();
  return <ContentPanel sx={(theme) => ({ height: '100%', bgcolor: alpha(theme.palette.premium.main, 0.055) })}>
    <Stack height='100%' alignItems='flex-start' spacing={2}>
      <WorkspacePremiumRoundedIcon sx={{ color: 'premium.main', fontSize: 32 }} />
      <Typography variant='h3' component='h2'>{t('Take your cooking further')}</Typography>
      <Typography color='text.secondary' sx={{ flex: 1 }}>{t('Unlock premium recipes, share your own creations, and grow from home cook to chef.')}</Typography>
      <Button component={NavLink} to='/premium' variant='contained'>{t('Discover Premium')}</Button>
    </Stack>
  </ContentPanel>;
}
