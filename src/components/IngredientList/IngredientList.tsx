import { useTranslation } from 'react-i18next';
import { Ingredient } from '@/api/api.types';
import { Stack, Typography } from '@mui/material';
import ContentPanel from '@/components/Layout/ContentPanel';

export default function IngredientList({ ingredients }: { ingredients: Ingredient[] }) {
  const { t } = useTranslation();
  return <ContentPanel sx={{ flex: { xs: 1, md: '0 0 32%' }, alignSelf: 'flex-start', width: { xs: '100%', md: 'auto' } }}>
    <Typography variant='h4' component='h2' gutterBottom>{t('Ingredients')}</Typography>
    <Stack>
      {ingredients?.length ? ingredients.map((item, index) => <Typography key={index} sx={{ py: 1.5, borderBottom: 1, borderColor: 'divider' }}>{item.name} x {item.quantity} {item.unit}</Typography>) : <Typography color='text.secondary'>{t('No ingredients available.')}</Typography>}
    </Stack>
  </ContentPanel>;
}
