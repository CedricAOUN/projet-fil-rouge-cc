import React from 'react';
import { Stack, CircularProgress, useMediaQuery } from '@mui/material';
import RecipeTitlePaper from '@/components/RecipeComponents/RecipeTitlePaper/RecipeTitlePaper';
import IngredientList from '@/components/IngredientList/IngredientList';
import StepByStep from '@/components/StepByStep/StepByStep';
import CommentList from '@/components/CommentList/CommentList';
import { useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound/NotFound';
import { useGetRecipeByIdQuery } from '@/api/recipeApi';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';

const SingleRecipePage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams<{ id: string }>();

  const { data: recipe, isLoading, isError, error } = useGetRecipeByIdQuery(id!, { skip: !id });

  if (isLoading) {
    return <Stack alignItems="center" justifyContent="center" minHeight="200px"><CircularProgress /></Stack>;
  }

  if (!recipe || isError) {
    const status = (error as { status?: number })?.status;
    return <PageErrorHandler errorStatus={status} />;
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
        likes={likes.count}
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
