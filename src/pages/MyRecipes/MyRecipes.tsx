import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Stack,
  Typography,
  Paper,
  Button,
  Box,
  IconButton,
} from '@mui/material';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';
import { useGetCurrentUserQuery } from '@/api/authApi';
import { useNavigate } from 'react-router-dom';
import { useDeleteRecipeMutation, useGetRecipesQuery } from '@/api/recipeApi';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from '@/components/ConfirmationModal/ConfirmationModal';

const MyRecipes = () => {
  const navigate = useNavigate();
  const currentUser = useGetCurrentUserQuery()?.data;
  const { data, isLoading, isFetching } = useGetRecipesQuery({
    creators: [currentUser?.name],
  });

  const allUserRecipes = data?.recipes;

  const handleGoToRecipe = (recipeId) => navigate(`/recipe/${recipeId}`);

  const handleGoToCreateRecipe = () => navigate('/recipe/create');

  const [deleteRecipe] = useDeleteRecipeMutation();
  const [recipeIDToDelete, setRecipeIDToDelete] = useState(null);
  const handleDeleteRecipe = (id) => {
    deleteRecipe(id);
    setRecipeIDToDelete(null);
  };

  if (!currentUser) {
    return <PageErrorHandler errorStatus={401} />;
  }

  return (
    <Stack direction={'column'} spacing={2} width={'100%'}>
      <Typography variant='h1'>Your Recipes</Typography>
      <Stack
        direction={'row'}
        gap={2}
        justifyContent={'center'}
        flexWrap={'wrap'}
      >
        {allUserRecipes?.map((recipe) => (
          <Paper
            key={recipe.id}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'column',
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
            <Stack direction={'row'}>
              <IconButton onClick={() => handleGoToRecipe(recipe.id)}>
                <VisibilityIcon></VisibilityIcon>
              </IconButton>
              <IconButton
                color='warning'
                onClick={() => navigate(`/recipe/edit/${recipe.id}`)}
              >
                <EditIcon></EditIcon>
              </IconButton>
              <IconButton
                color='error'
                onClick={() => setRecipeIDToDelete(recipe.id)}
              >
                <DeleteIcon></DeleteIcon>
              </IconButton>
            </Stack>
          </Paper>
        ))}
        {(allUserRecipes?.length < 1 || allUserRecipes == null) && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Typography>You haven't created any recipes yet !</Typography>
            <Button onClick={handleGoToCreateRecipe}>Create a Recipe</Button>
          </Box>
        )}
      </Stack>
      <ConfirmationModal
        title='Delete confirmation'
        message='Are you sure you want to delete this recipe ?'
        onClose={() => setRecipeIDToDelete(null)}
        open={Boolean(recipeIDToDelete)}
        onConfirm={() => handleDeleteRecipe(recipeIDToDelete)}
      />
    </Stack>
  );
};

export default MyRecipes;
