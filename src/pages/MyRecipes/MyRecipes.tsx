import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Stack, Typography, Button, IconButton } from '@mui/material';
import { darken, type Theme } from '@mui/material/styles';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';
import { useGetCurrentUserQuery } from '@/api/authApi';
import { useNavigate } from 'react-router-dom';
import { useDeleteRecipeMutation, useGetRecipesQuery } from '@/api/recipeApi';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';
import RecipeGrid from '@/components/RecipeComponents/RecipeGrid';
import RecipeCard from '@/components/RecipeComponents/RecipeCard/RecipeCard';
import ContentPanel from '@/components/Layout/ContentPanel';

const actionButtonSx = (color: 'warning' | 'error') => (theme: Theme) => {
  const background = theme.palette[color][theme.palette.mode === 'dark' ? 'dark' : 'main'];
  return {
    bgcolor: background,
    color: 'common.white',
    '&:hover': { bgcolor: darken(background, 0.12) },
  };
};

export default function MyRecipes() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const currentUser = useGetCurrentUserQuery()?.data;
  const { data } = useGetRecipesQuery({ creators: [currentUser?.name] });
  const recipes = data?.recipes;
  const [deleteRecipe] = useDeleteRecipeMutation();
  const [recipeIDToDelete, setRecipeIDToDelete] = useState<string | null>(null);
  const handleDeleteRecipe = (id: string) => { deleteRecipe(id); setRecipeIDToDelete(null); };
  if (!currentUser) return <PageErrorHandler errorStatus={401} />;
  return <Stack spacing={4}>
    <Typography variant='h1'>{t('Your Recipes')}</Typography>
    {recipes?.length ? <RecipeGrid>{recipes.map(recipe => <RecipeCard key={recipe.id} id={recipe.id} title={recipe.title} image={recipe.image_url} description={recipe.description}
      viewLabel={t('View Recipe')} onView={() => navigate(`/recipe/${recipe.id}`)} actions={<>
        <IconButton aria-label={t('Edit')} color='warning' sx={actionButtonSx('warning')} onClick={() => navigate(`/recipe/edit/${recipe.id}`)}><EditIcon /></IconButton>
        <IconButton aria-label={t('Delete')} color='error' sx={actionButtonSx('error')} onClick={() => setRecipeIDToDelete(recipe.id)}><DeleteIcon /></IconButton>
      </>} />)}</RecipeGrid> : <ContentPanel>
        <Stack alignItems='center' spacing={2}><Typography>{t("You haven't created any recipes yet !")}</Typography><Button variant='contained' onClick={() => navigate('/recipe/create')}>{t('Create a Recipe')}</Button></Stack>
      </ContentPanel>}
    <ConfirmationModal title={t('Delete confirmation')} message={t('Are you sure you want to delete this recipe ?')} onClose={() => setRecipeIDToDelete(null)} open={Boolean(recipeIDToDelete)} onConfirm={() => handleDeleteRecipe(recipeIDToDelete)} />
  </Stack>;
}
