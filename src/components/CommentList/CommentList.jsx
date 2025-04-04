import { Typography, Paper, Stack } from '@mui/material';
import React from 'react';

function CommentList({ comments }) {
  return (
    <Stack gap={2}>
      <Typography variant='h4'>Comments</Typography>
      {comments.map((comment, index) => (
        <Paper key={index}>
          <Typography variant='h6'>
            {comment.user} - {comment.date}
          </Typography>
          <Typography variant='subtitle'>{comment.message}</Typography>
        </Paper>
      ))}
    </Stack>
  );
}

export default CommentList;
