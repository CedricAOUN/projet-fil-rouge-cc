import { Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RecipeCard({ title, image, description, id }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/recipe/${id}`);
  };

  return (
    <Paper sx={{ display: 'flex', width: '100%', gap: 2, padding: 1 }}>
      <img
        src={image}
        alt={title}
        width={'100px'}
        height={'80px'}
        style={{ borderRadius: '5px' }}
      />
      <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant='h5'>{title}</Typography>
        <Typography
          variant='subtitle1'
          sx={{
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {description}
        </Typography>
      </Stack>
      <Button
        variant='contained'
        onClick={handleClick}
        sx={{ ml: 'auto', width: '100px', height: '70px', flexShrink: 0 }}
      >
        View Recipe
      </Button>
    </Paper>
  );
}

export default RecipeCard;
