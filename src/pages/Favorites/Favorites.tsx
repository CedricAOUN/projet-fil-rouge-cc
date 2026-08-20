import React from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Stack,
  Typography,
  Paper,
  Button,
  Box,
} from '@mui/material';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';
import { useGetCurrentUserQuery } from '@/api/authApi';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const navigate = useNavigate();
  const currentUser = useGetCurrentUserQuery().data;
  const favoriteRecipes = currentUser?.favorite_recipes;

  if (!currentUser) {
    return <PageErrorHandler errorStatus={401} />;
  }

  const handleGoToRecipe = (recipeId) => navigate(`/recipe/${recipeId}`);

  const handleGoToRecipeSearch = () => navigate('/recipes');

  return (
    <Stack direction={'column'} spacing={2}>
      <Typography variant='h1'>Your Favorites</Typography>
      <Stack direction={'row'} gap={2} justifyContent={'center'}>
        {favoriteRecipes?.map((recipe) => (
          <Paper
            key={recipe.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
              flexWrap: 'wrap',
              gap: 2,
              maxWidth: 500,
              width: 500,
            }}
          >
            <Typography>{recipe.title}</Typography>
            <img
              src={recipe.image_url}
              width={'300'}
              height={'300'}
              style={{ objectFit: 'cover' }}
            />
            <Typography>{recipe.description}</Typography>
            <Button onClick={() => handleGoToRecipe(recipe.id)}>
              View Recipe
            </Button>
          </Paper>
        ))}
        {(favoriteRecipes?.length < 1 || favoriteRecipes == null) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography>You don't have any favorites yet !</Typography>
            <Button onClick={handleGoToRecipeSearch}>Explore Recipes</Button>
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default Favorites;
