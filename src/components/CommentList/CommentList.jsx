import { Typography, Paper } from '@mui/material'
import React from 'react'

function CommentList({ comments }) {
  return (
    <Paper sx={{ padding: '20px', borderRadius: '15px' }}>
      <Typography fontSize={24}>Comments</Typography>
      {comments}
    </Paper>
  )
}

export default CommentList