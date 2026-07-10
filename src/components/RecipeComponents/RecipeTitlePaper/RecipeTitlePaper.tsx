import React, { useState } from 'react';
import './recipeTitlePaper.css';
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { RootState } from '@/store';
import { useSelector } from 'react-redux';
import { Recipe } from '@/types';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

type RecipeTitlePaperProps = {
  recipe: Recipe;
  onLikeToggle: () => void;
  onFavoriteToggle: () => void;
  isLoading: boolean;
};

function RecipeTitlePaper({
  recipe,
  onLikeToggle,
  onFavoriteToggle,
  isLoading,
}) {
  const isMobile = useMediaQuery('(max-width:900px)');
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const {
    title,
    description: desc,
    image_url: imgUrl,
    likes: likeObject,
    favorites: favoritesObject,
  } = recipe;

  const isLiked = likeObject.is_liked_by_user;
  const isFavorited = favoritesObject.is_favorited_by_user;

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        padding: 0,
      }}
    >
      <img
        className='recipe-img'
        src={imgUrl}
        alt={`Image of ${title}`}
        height={'300px'}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '30px',
          flexGrow: 1,
          alignItems: 'space-between',
        }}
      >
        <Typography variant='h3'>{title}</Typography>
        <Typography variant='subtitle2'>{desc}</Typography>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='flex-end'
          gap={1}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: '100px',
              border: (theme) =>
                `2px solid ${isFavorited ? theme.palette.secondary.main : 'grey'}`,
              borderRadius: '50vh',
            }}
          >
            <Button
              onClick={onFavoriteToggle}
              disabled={isLoading || Boolean(!currentUser)}
              sx={{
                backgroundColor: 'transparent',
                borderRadius: '50vh 0 0 50vh',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              {isFavorited ? (
                <FavoriteIcon color='secondary' />
              ) : (
                <FavoriteBorderIcon />
              )}
            </Button>
            <Typography>{favoritesObject.count}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: '100px',
              border: (theme) =>
                `2px solid ${isLiked ? theme.palette.primary.main : 'grey'}`,
              borderRadius: '50vh',
            }}
          >
            <Button
              onClick={onLikeToggle}
              disabled={isLoading || Boolean(!currentUser)}
              sx={{
                backgroundColor: 'transparent',
                borderRadius: '50vh 0 0 50vh',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              {isLiked ? (
                <ThumbUpAltIcon color='primary' />
              ) : (
                <ThumbUpOffAltIcon />
              )}
            </Button>
            <Typography>{likeObject.count}</Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
}

export default RecipeTitlePaper;
