import { Stack, useMediaQuery } from '@mui/material';
import RecipeTitlePaper from '../../components/RecipeComponents/RecipeTitlePaper/RecipeTitlePaper';
import IngredientList from '../../components/IngredientList/IngredientList';
import StepByStep from '../../components/StepByStep/StepByStep';
import CommentList from '../../components/CommentList/CommentList';
import { useParams } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';
import { useState, useEffect } from 'react';
import { fetchSingleRecipe } from '../../api/api';

const SingleRecipePage = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams();

  // TODO: replace when backend is in place
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    fetchSingleRecipe(id)
      .then((data) => {
        if (data) {
          setRecipe(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching recipe:', error);
        setRecipe(null);
      });
  }, []);

  if (!recipe) {
    return <NotFound />;
  }

  const {
    title,
    description,
    img_url,
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
        imgUrl={img_url}
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
