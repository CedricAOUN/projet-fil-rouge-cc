import { useGetCurrentUserQuery } from '@/api/authApi';
import { RootState } from '@/store/store';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function RecipeCard({ title, image, description, id, isPremium }) {
  const navigate = useNavigate();
  const { data: currentUser } = useGetCurrentUserQuery();

  const canViewRecipe = !isPremium || (isPremium && currentUser?.is_premium);

  const handleClick = () => {
    if (!canViewRecipe) {
      navigate('/premium');
      return;
    }
    navigate(`/recipe/${id}`);
  };

  const borderColor = isPremium ? 'gold' : 'gray';

  return (
    <Paper
      sx={{
        display: 'flex',
        width: '100%',
        gap: 2,
        p: 0,
        boxShadow: `inset 0 0 0 2px ${borderColor}`,
        borderRadius: '6px',
      }}
    >
      <img
        src={image}
        alt={title}
        width={'100px'}
        height={'80px'}
        style={{
          borderRadius: '6px 0 0 6px',
          borderRight: `3px solid ${borderColor}`,
          objectFit: 'cover',
        }}
      />
      <Stack sx={{ flexGrow: 1, minWidth: 0, p: 1 }}>
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
        sx={{
          alignSelf: 'stretch',
          borderRadius: '0 6px 6px 0',
          width: '150px',
          textWrap: 'wrap',
        }}
      >
        {canViewRecipe ? 'View' : 'Upgrade to Premium'}
      </Button>
    </Paper>
  );
}

export default RecipeCard;
