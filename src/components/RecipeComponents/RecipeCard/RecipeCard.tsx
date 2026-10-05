import { useTranslation } from 'react-i18next';
import { useGetCurrentUserQuery } from '@/api/authApi';
import { recipeThumbnail } from '@/utils/recipeImage';
import { Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function RecipeCard({ title, image, description, id, isPremium }) {
  const { t } = useTranslation();
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
  const thumbnail = recipeThumbnail(image, 200);
  const thumbnailSet = thumbnail !== image
    ? `${recipeThumbnail(image, 100)} 100w, ${thumbnail} 200w, ${recipeThumbnail(image, 300)} 300w`
    : undefined;


  return (
    <Paper
      sx={{
        display: 'flex',
        width: '100%',
        gap: 2,
        p: 0,
        boxShadow: `inset 0 0 0 2px ${borderColor}`,
        borderRadius: '6px',
        backgroundColor: (theme) => theme.palette.background.darker,
      }}
    >
      <img
        src={thumbnail}
        srcSet={thumbnailSet}
        sizes='100px'
        loading='lazy'
        decoding='async'
        alt={title}
        width={100}
        height={80}
        style={{
          borderRadius: '6px 0 0 6px',
          borderRight: `3px solid ${borderColor}`,
          objectFit: 'cover',
          minWidth: '100px',
        }}
      />
      <Stack sx={{ flexGrow: 1, minWidth: 0, p: 1 }}>
        <Typography variant='h5' component='h3' fontSize={{ xs: 14, md: 16, lg: 24 }}>
          {title}
        </Typography>
        <Typography
          variant='subtitle1'
          component='p'
          fontSize={{ xs: 12, md: 14, lg: 18 }}
          sx={{
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxHeight: '100%',
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
          width: '120px',
          minWidth: '120px',
          textWrap: 'wrap',
          fontSize: { xs: 12, md: 16 },
        }}
      >
        {canViewRecipe ? t("View") : t("Upgrade to Premium")}
      </Button>
    </Paper>
  );
}

export default RecipeCard;
