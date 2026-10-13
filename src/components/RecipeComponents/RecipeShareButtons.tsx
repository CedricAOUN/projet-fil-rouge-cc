import { Button, Stack, Typography } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import { useTranslation } from 'react-i18next';
import type { Recipe } from '@/types';

export default function RecipeShareButtons({ recipe }: { recipe: Pick<Recipe, 'id' | 'title' | 'is_premium'> }) {
  const { t } = useTranslation();
  if (recipe.is_premium !== false) return null;

  // Share only the public recipe URL, never the current query string or hash.
  const recipeUrl = new URL(`/recipe/${encodeURIComponent(recipe.id)}`, window.location.origin).href;
  const twitterParams = new URLSearchParams({
    url: recipeUrl,
    text: t('{{title}} on MealMosaic', { title: recipe.title }),
  });
  const facebookParams = new URLSearchParams({ u: recipeUrl });

  return <Stack spacing={1}>
    <Typography variant='subtitle2'>{t('Share this recipe')}</Typography>
    <Stack direction='row' gap={1.5} flexWrap='wrap'>
      <Button variant='outlined' size='small' startIcon={<TwitterIcon />}
        href={`https://twitter.com/intent/tweet?${twitterParams}`} target='_blank' rel='noopener noreferrer'>
        {t('Share on Twitter / X')}
      </Button>
      <Button variant='outlined' size='small' startIcon={<FacebookIcon />}
        href={`https://www.facebook.com/sharer/sharer.php?${facebookParams}`} target='_blank' rel='noopener noreferrer'>
        {t('Share on Facebook')}
      </Button>
    </Stack>
  </Stack>;
}
