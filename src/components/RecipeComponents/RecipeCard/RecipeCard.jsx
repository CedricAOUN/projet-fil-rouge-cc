import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RecipeCard({ title, image, description, id }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${id}`);
  };

  return (
    <Stack direction={'row'} width={'100%'} gap={2}>
      <img src={image} alt={title} width={'100px'} height={'80px'} />
      <Stack>
        <Typography variant='h5'>{title}</Typography>
        <Typography variant='subtitle1' sx={{}}>
          {description}
        </Typography>
      </Stack>
      <Button variant='contained' onClick={handleClick} sx={{ ml: 'auto' }}>
        View Recipe
      </Button>
    </Stack>
  );
}

export default RecipeCard;
