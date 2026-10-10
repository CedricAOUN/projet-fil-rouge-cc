import { useTranslation } from 'react-i18next';
import { Stack, Typography, Button } from '@mui/material';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';
import { useGetCurrentUserQuery } from '@/api/authApi';
import { useNavigate } from 'react-router-dom';
import RecipeGrid from '@/components/RecipeComponents/RecipeGrid';
import RecipeCard from '@/components/RecipeComponents/RecipeCard/RecipeCard';
import ContentPanel from '@/components/Layout/ContentPanel';

export default function Favorites() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useGetCurrentUserQuery().data;
  const recipes = currentUser?.favorite_recipes;
  if (!currentUser) return <PageErrorHandler errorStatus={401} />;
  return <Stack spacing={4}>
    <Typography variant='h1'>{t('Your Favorites')}</Typography>
    {recipes?.length ? <RecipeGrid>{recipes.map(recipe => <RecipeCard key={recipe.id} id={recipe.id} title={recipe.title} image={recipe.image_url} description={recipe.description} viewLabel={t('View Recipe')} onView={() => navigate(`/recipe/${recipe.id}`)} />)}</RecipeGrid> : <ContentPanel>
      <Stack alignItems='center' spacing={2}><Typography>{t("You don't have any favorites yet !")}</Typography><Button variant='contained' onClick={() => navigate('/recipes')}>{t('Explore Recipes')}</Button></Stack>
    </ContentPanel>}
  </Stack>;
}
