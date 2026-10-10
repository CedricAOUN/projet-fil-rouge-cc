import { useTranslation } from 'react-i18next';
import { useGetCurrentUserQuery } from '@/api/authApi';
import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import RecipeImage from '../RecipeImage';

type RecipeCardProps = {
  title: string; image?: string; description?: string; id: string | number;
  isPremium?: boolean; viewLabel?: string; actions?: ReactNode; onView?: () => void; headingLevel?: 'h2' | 'h3';
};

export default function RecipeCard({ title, image, description, id, isPremium = false, viewLabel, actions, onView, headingLevel = 'h2' }: RecipeCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUserQuery();
  const canViewRecipe = !isPremium || currentUser?.is_premium;
  return (
    <Card component='article' sx={{ display: 'flex', minWidth: 0, minHeight: { xs: 88, sm: 96 }, borderColor: isPremium ? 'premium.main' : 'divider', transition: 'border-color 180ms ease', '&:hover': { borderColor: 'secondary.main' } }}>
      <RecipeImage image={image} title={title} compact />
      <Stack justifyContent='center' spacing={0.5} sx={{ flex: 1, minWidth: 0, px: { xs: 1.5, sm: 2 }, py: 1 }}>
        <Typography variant='h5' component={headingLevel} noWrap title={title} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{title}</Typography>
        {description && <Typography variant='body2' color='text.secondary' noWrap title={description}>{description}</Typography>}
        {isPremium && <Chip label={t('Premium')} size='small' sx={(theme) => ({ alignSelf: 'flex-start', height: 20, fontSize: '0.7rem', color: 'premium.main', bgcolor: alpha(theme.palette.premium.main, 0.1) })} />}
      </Stack>
      <Stack sx={{ width: { xs: 80, sm: 120 }, flexShrink: 0, ...(actions && { display: 'grid', gridTemplateRows: 'repeat(2, minmax(44px, 1fr))' }) }}>
        <Button variant='contained' sx={{ flex: 1, borderRadius: 0, minWidth: 0, px: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' }, '&:focus-visible': { outlineOffset: -4 } }}
          onClick={() => onView ? onView() : navigate(canViewRecipe ? `/recipe/${id}` : '/premium')}>
          {viewLabel ?? (canViewRecipe ? t('View') : t('Upgrade to Premium'))}
        </Button>
        {actions && <Box sx={{
          display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          '& > .MuiIconButton-root': {
            width: '100%', minWidth: 0, minHeight: 44, borderRadius: 0,
            border: '1px solid', borderColor: 'divider',
            '&:first-of-type': { borderRight: 0 },
            '&:focus-visible': { outlineOffset: -4 },
          },
        }}>{actions}</Box>}
      </Stack>
    </Card>
  );
}
