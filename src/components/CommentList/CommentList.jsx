import { Typography, Paper, Stack, Box } from '@mui/material';
import React from 'react';

function CommentList({ comments }) {
  return (
    <Stack gap={2}>
      <Typography variant='h4'>Comments</Typography>
      {comments.map((comment, index) => (
        <Paper key={index}>
          <Stack direction='row'>
            <Typography variant='h6' sx={{ textDecoration: 'underline' }}>
              {comment.user}:
            </Typography>
          </Stack>
          <Typography variant='subtitle'>{comment.message}</Typography>
          <Box>
            <Typography variant='subtitle2' textAlign='end'>
              {comment.date}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}

export default CommentList;
