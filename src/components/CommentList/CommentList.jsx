import { Typography, Paper } from '@mui/material'
import React from 'react'

function CommentList({ comments }) {
  return (
    <Paper>
      <Typography variant='h4'>Comments</Typography>
      {comments}
    </Paper>
  )
}

export default CommentList