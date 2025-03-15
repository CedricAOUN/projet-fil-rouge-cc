import React, { useState } from 'react'
import './recipeTitlePaper.css'
import { Box, Button, Paper, Typography, useMediaQuery } from '@mui/material'

function RecipeTitlePaper({ title, desc, likes = 0, imgUrl }) {
  const isMobile = useMediaQuery('(max-width:900px)');

  const [ isLiked, setIsLiked ] = useState(false); // GET if user liked the post for initial state.

  const likesWithUser = isLiked ? likes + 1 : likes;

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    // POST to update likes.
  }

  return (
    <Paper sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row'}}>
      <img src={imgUrl} alt={`Image of ${title}`} />
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '30px', flexGrow: 1, alignItems: 'space-between' }}>
        <Typography variant='h3'>{title}</Typography>
        <Typography variant='subtitle2'>{desc}</Typography>
        <Button 
          fontSize={16} 
          color={isLiked ? 'error' : 'success'}
          onClick={handleLikeClick}
          sx={{ alignSelf: 'end' }}
        >
          {isLiked ? 'Unlike' : 'Like'} - {likesWithUser} ⭐
        </Button>
      </Box>
    </Paper>
  )
}

export default RecipeTitlePaper