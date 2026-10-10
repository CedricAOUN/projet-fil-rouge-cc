import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useGetCurrentUserQuery } from '@/api/authApi';
import dayjs from 'dayjs';
import AskAIButton from '@/components/AskAIButton/AskAIButton';
import RecipeImage from '../RecipeImage';

export default function RecipeTitlePaper({ recipe, onLikeToggle, onFavoriteToggle, isLoading }) {
  const { t } = useTranslation();
  const { data: currentUser } = useGetCurrentUserQuery();
  const isLiked = recipe.likes.is_liked_by_user;
  const isFavorited = recipe.favorites.is_favorited_by_user;
  return <Paper sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1fr) minmax(0, 1fr)' }, overflow: 'hidden' }}>
    <RecipeImage image={recipe.image_url} title={t('Image of {{title}}', { title: recipe.title })} />
    <Stack spacing={3} sx={{ p: { xs: 3, md: 4 }, justifyContent: 'center', minWidth: 0 }}>
      {recipe.is_premium && <Chip label={t('Premium')} icon={<WorkspacePremiumIcon />} size='small'
        sx={(theme) => ({ alignSelf: 'flex-start', color: 'premium.main', bgcolor: alpha(theme.palette.premium.main, 0.1), '& .MuiChip-icon': { color: 'inherit' } })} />}
      <Typography variant='h1'>{recipe.title}</Typography>
      <Typography color='text.secondary'>{recipe.description}</Typography>
      <Box>
        <Typography variant='body2' color='secondary.main'>{t('By {{author}}', { author: recipe.creator.name })}</Typography>
        <Typography variant='body2' color='text.secondary'>{t('Created on {{date}}', { date: dayjs(recipe.created_at).format('MMMM D, YYYY') })}</Typography>
      </Box>
      <Stack direction='row' gap={1.5} flexWrap='wrap'>
        <Button variant='outlined' color='secondary' aria-label={t('Favorites')} aria-pressed={Boolean(isFavorited)}
          onClick={onFavoriteToggle} disabled={isLoading || !currentUser} startIcon={isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}>{recipe.favorites.count}</Button>
        <Button variant='outlined' aria-label={t('Likes')} aria-pressed={Boolean(isLiked)}
          onClick={onLikeToggle} disabled={isLoading || !currentUser} startIcon={isLiked ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}>{recipe.likes.count}</Button>
        {currentUser?.is_premium && <AskAIButton recipe={recipe} />}
      </Stack>
    </Stack>
  </Paper>;
}
