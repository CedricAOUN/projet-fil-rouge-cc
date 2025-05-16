import { Stack, useMediaQuery } from '@mui/material';
import RecipeTitlePaper from '../../components/RecipeComponents/RecipeTitlePaper/RecipeTitlePaper';
import IngredientList from '../../components/IngredientList/IngredientList';
import StepByStep from '../../components/StepByStep/StepByStep';
import CommentList from '../../components/CommentList/CommentList';
import { MOCK_RECIPES } from '../../api/mockApi';
import { useParams } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';

const SingleRecipePage = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams();

  // TODO: replace when backend is in place
  const recipeData = MOCK_RECIPES.find((recipe) => recipe.id === id);

  if (!recipeData) {
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
  } = recipeData;

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
