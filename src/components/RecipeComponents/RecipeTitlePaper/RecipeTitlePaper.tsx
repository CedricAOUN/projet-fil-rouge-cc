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

function RecipeTitlePaper({ title, desc, likes = 0, imgUrl }) {
  const isMobile = useMediaQuery('(max-width:900px)');

  const [isLiked, setIsLiked] = useState(false); // GET if user liked the post for initial state.

  const likesWithUser = isLiked ? likes + 1 : likes;

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    // POST to update likes.
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        padding: 0,
      }}
    >
      <img className='recipe-img' src={imgUrl} alt={`Image of ${title}`} height={'300px'}/>
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
          <Button variant='contained' onClick={handleLikeClick}>
            {isLiked ? 'Unlike' : 'Like'}
          </Button>
          <Typography>{likesWithUser}</Typography>
        </Stack>
      </Box>
    </Paper>
  );
}

export default RecipeTitlePaper;
