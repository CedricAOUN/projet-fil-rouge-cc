import React, { useState, useEffect } from 'react';
import { Stack, useMediaQuery } from '@mui/material';
import RecipeTitlePaper from '@/components/RecipeComponents/RecipeTitlePaper/RecipeTitlePaper';
import IngredientList from '@/components/IngredientList/IngredientList';
import StepByStep from '@/components/StepByStep/StepByStep';
import CommentList from '@/components/CommentList/CommentList';
import { useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound/NotFound';
import { fetchSingleRecipe } from '@/api/api';
import { Recipe } from '@/types';
import { Comment } from '@/api/api.types';

const SingleRecipePage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams<{ id: string }>();

  // TODO: replace when backend is in place
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (id) {
      fetchSingleRecipe(id)
        .then((data: Recipe) => {
          if (data) {
            setRecipe(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching recipe:', error);
          setRecipe(null);
        });
    }
  }, [id]);

  if (!recipe) {
    return <NotFound />;
  }

  const {
    title,
    description,
    image_url,
    likes,
    ingredients,
    instructions,
    comments,
  } = recipe;

  return (
    <Stack gap={2}>
      <RecipeTitlePaper
        title={title}
        desc={description}
        likes={likes}
        imgUrl={image_url}
      />
      <Stack direction={isMobile ? 'column' : 'row'} gap={2}>
        <IngredientList ingredients={ingredients} />
        <StepByStep instructions={instructions} />
      </Stack>
      <CommentList comments={comments} />
    </Stack>
  );
};

export default SingleRecipePage;
