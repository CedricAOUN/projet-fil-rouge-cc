import { useTranslation } from 'react-i18next';
import PremiumCard from '@/components/PremiumCard/PremiumCard';
import RecipeSearch from '@/components/RecipeComponents/RecipeSearch/RecipeSearch';
import ContentPanel from '@/components/Layout/ContentPanel';
import { setSearchQuery, useAppDispatch, useAppSelector } from '@/store';
import { useGetRecipesQuery } from '@/api/recipeApi';
import { recipeThumbnail } from '@/utils/recipeImage';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Box, Button, Container, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

function KitchenNote() {
  const { t } = useTranslation();
  return <ContentPanel sx={{ width: '100%', bgcolor: 'background.paper' }}>
    <Typography variant='overline' color='secondary.main'>{t("Today's kitchen note")}</Typography>
    <Typography variant='h3' component='h2' sx={{ mt: 1, mb: 3 }}>{t('Good food starts with a little curiosity.')}</Typography>
    {[t('Pick a craving'), t('Find your recipe'), t('Make it your own')].map((label, index) => <Stack key={label} direction='row' gap={2} sx={{ py: 1.5, borderTop: 1, borderColor: 'divider' }}>
      <Typography variant='overline' color='primary.main'>0{index + 1}</Typography><Typography>{label}</Typography>
    </Stack>)}
  </ContentPanel>;
}

function HeroPhoto() {
  const { data } = useGetRecipesQuery({ search: '' });
  const recipe = data?.recipes.find(item => !item.is_premium && item.image_url);
  const [failedImage, setFailedImage] = useState<string>();
  if (!recipe || failedImage === recipe.image_url) return <KitchenNote />;
  return <Box component='figure' sx={{ m: 0, width: '100%' }}>
    <Box component='img' src={recipeThumbnail(recipe.image_url, 1000)} alt={recipe.title} fetchPriority='high'
      onError={() => setFailedImage(recipe.image_url)}
      sx={{ width: '100%', aspectRatio: '5 / 4', objectFit: 'cover', display: 'block', borderRadius: '16px' }} />
    <Stack component='figcaption' direction='row' alignItems='center' justifyContent='space-between' gap={2} sx={{ mt: 2 }}>
      <Typography variant='body2' color='text.secondary'>{recipe.title}</Typography>
      <Box aria-hidden='true' sx={{ height: 1, width: 56, bgcolor: 'primary.main', flexShrink: 0 }} />
    </Stack>
  </Box>;
}

function CoursesCard() {
  const { t } = useTranslation();
  return <ContentPanel sx={{ height: '100%' }}>
    <Stack height='100%' alignItems='flex-start' spacing={2}>
      <MenuBookRoundedIcon sx={{ color: 'secondary.main', fontSize: 32 }} />
      <Typography variant='h3' component='h2'>{t('Learn from passionate chefs')}</Typography>
      <Typography color='text.secondary' sx={{ flex: 1 }}>{t('Explore practical courses, discover new techniques, and bring more confidence to your kitchen.')}</Typography>
      <Button component={NavLink} to='/courses' variant='outlined' color='secondary'>{t('Explore courses')}</Button>
    </Stack>
  </ContentPanel>;
}

export default function Home() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const headerSearchRef = useRef<HTMLInputElement>(null);
  const searchQuery = useAppSelector(state => state.recipes.searchQuery);
  return <Box>
    <Container maxWidth='lg'>
      <Box component='section' sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' }, alignItems: 'center', gap: { xs: 4, md: 7 }, py: { xs: 5, md: 8 } }}>
        <Stack alignItems='flex-start' spacing={3}>
          <Typography variant='overline' color='secondary.main'>{t('Your kitchen, your mosaic')}</Typography>
          <Typography component='h1' variant='h1' sx={{ fontSize: 'clamp(2.8rem, 5.2vw, 4.8rem)', maxWidth: '13ch' }}>{t('Find something worth cooking.')}</Typography>
          <Typography color='text.secondary' sx={{ maxWidth: '48ch' }}>{t('Discover recipes for every appetite, learn from cooks who love their craft, and make each dish your own.')}</Typography>
          <TextField inputRef={headerSearchRef} value={searchQuery} onChange={event => dispatch(setSearchQuery(event.target.value))}
            placeholder={t('What are you craving?')} fullWidth
            slotProps={{ htmlInput: { 'aria-label': t('Search recipes') }, input: { startAdornment: <InputAdornment position='start'><SearchRoundedIcon color='primary' /></InputAdornment> } }}
            sx={{ '& .MuiOutlinedInput-root': { minHeight: 56 } }} />
        </Stack>
        <HeroPhoto />
      </Box>
    </Container>
    <Box component='section' sx={(theme) => ({ py: { xs: 5, md: 7 }, borderTop: 1, borderColor: 'divider', bgcolor: alpha(theme.palette.secondary.main, 0.035) })}>
      <Container maxWidth='lg'>
        <Stack spacing={1} sx={{ mb: 4 }}>
          <Typography variant='overline' color='secondary.main'>{searchQuery ? t('Search results') : t('Fresh inspiration')}</Typography>
          <Typography variant='h2'>{searchQuery ? t('Recipes for “{{query}}”', { query: searchQuery }) : t('Discover your next favorite dish')}</Typography>
          <Typography color='text.secondary'>{t('Browse the latest recipes from the MealMosaic community.')}</Typography>
        </Stack>
        <RecipeSearch showSearch={Boolean(searchQuery)} headerSearchRef={headerSearchRef} />
      </Container>
    </Box>
    <Container maxWidth='lg' sx={{ py: { xs: 5, md: 8 } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' }, gap: 3 }}>
        <CoursesCard /><PremiumCard />
      </Box>
    </Container>
  </Box>;
}
