import { Stack, useMediaQuery } from '@mui/material'
import React from 'react'
import RecipeTitlePaper from '../../components/RecipeTitlePaper/RecipeTitlePaper'
import IngredientList from '../../components/IngredientList/IngredientList'
import StepByStep from '../../components/StepByStep/StepByStep'
import CommentList from '../../components/CommentList/CommentList'

const SingleRecipePage = ( recipe ) => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { 
    title, 
    desc,
    likes,
    ingredients,
    steps,
    comments,
   } = recipe;

  return (
    <Stack gap={2}>
      <RecipeTitlePaper title={title} desc={desc} likes={likes} />
      <Stack direction={isMobile ? 'column' : 'row'} gap={2}>
        <IngredientList ingredients={ingredients} />
        <StepByStep steps={steps} />
      </Stack>
      <CommentList comments={comments} />
    </Stack>
  )
}

export default SingleRecipePage