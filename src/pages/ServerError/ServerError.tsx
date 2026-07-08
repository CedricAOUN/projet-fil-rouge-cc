import { Typography } from '@mui/material';
import React from 'react'

function ServerError() {
  return (
    <>
      <Typography variant='h1' fontSize={60}>
        500
      </Typography>
      <Typography variant='h1'>Woops! Something went wrong on our end. Please try again later.</Typography>
    </>
  );
}

export default ServerError