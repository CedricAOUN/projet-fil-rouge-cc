import { Comment } from '@/types';
import { Typography, Paper, Stack, Box, Avatar } from '@mui/material';
import dayjs from 'dayjs';
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
          <Stack
            direction='row'
            alignItems='center'
            gap={1}
            padding={1}
            width='100%'
          >
            <Avatar
              alt={comment.creator.name}
              src={comment.creator.avatar_url}
            />
            <Stack>
              <Stack direction='row'>
                <Typography variant='h6' fontWeight='bold'>
                  {comment.creator.name}:
                </Typography>
              </Stack>
              <Typography variant='subtitle2'>{comment.content}</Typography>
            </Stack>
            <Box flexGrow={1}>
              <Typography variant='subtitle2' textAlign='end'>
                {dayjs(comment?.created_at).format('MMM D, YYYY h:mm A')}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export default CommentList;
