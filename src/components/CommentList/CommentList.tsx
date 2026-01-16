import { Comment } from '@/types';
import { Typography, Paper, Stack, Box } from '@mui/material';
import React from 'react';

function CommentList({ comments }: { comments: Comment[] }) {
  if (!comments || comments.length === 0) {
    return (
      <Paper>
        <Typography variant='h4'>Comments</Typography>
        <Typography variant='subtitle1'>No comments available.</Typography>
      </Paper>
    );
  }

  return (
    <Stack gap={2}>
      <Typography variant='h4'>Comments</Typography>
      {comments.map((comment, index) => (
        <Paper key={index}>
          <Stack direction='row'>
            <Typography variant='h6'>
              {comment.username}:
            </Typography>
          </Stack>
          <Typography variant='subtitle2'>{comment.content}</Typography>
          <Box>
            <Typography variant='subtitle2' textAlign='end'>
              {comment.created_at}
            </Typography>
          </Box>
        </Paper>
      ))}
    </Stack>
  );
}

export default CommentList;
