import { Stack, useMediaQuery } from '@mui/material';
import React from 'react';
import RecipeTitlePaper from '../../components/RecipeTitlePaper/RecipeTitlePaper';
import IngredientList from '../../components/IngredientList/IngredientList';
import StepByStep from '../../components/StepByStep/StepByStep';
import CommentList from '../../components/CommentList/CommentList';

// Mock recipe data to use as default
const mockRecipe = {
  title: "Classic Chocolate Chip Cookies",
  desc: "Soft and chewy chocolate chip cookies with a golden edge. Perfect for any occasion!",
  imgUrl: 'https://t3.ftcdn.net/jpg/00/92/53/56/360_F_92535664_IvFsQeHjBzfE6sD4VHdO8u5OHUSc6yHF.jpg',
  likes: 243,
  ingredients: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus dolores nihil ab ipsum asperiores temporibus quae quos quam fugit itaque!',
  steps: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus dolores nihil ab ipsum asperiores temporibus quae quos quam fugit itaque!',
  comments: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus dolores nihil ab ipsum asperiores temporibus quae quos quam fugit itaque!'
};

const SingleRecipePage = (props) => {
  const isMobile = useMediaQuery('(max-width:900px)');
  
  // Use props.recipe if provided, otherwise use mockRecipe
  const recipeData = props.recipe || mockRecipe;
  
  const {
    title,
    desc,
    imgUrl,
    likes,
    ingredients,
    steps,
    comments,
  } = recipeData;
  return (
    <Stack gap={2}>
      <RecipeTitlePaper title={title} desc={desc} likes={likes} imgUrl={imgUrl} />
      <Stack direction={isMobile ? 'column' : 'row'} gap={2}>
        <IngredientList ingredients={ingredients} />
        <StepByStep steps={steps} />
      </Stack>
      <CommentList comments={comments} />
    </Stack>
  );
};

export default SingleRecipePage;