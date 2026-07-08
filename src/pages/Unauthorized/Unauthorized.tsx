import { Typography } from '@mui/material';
import React from 'react'

function Unauthorized() {
  return (
    <>
      <Typography variant='h1' fontSize={60}>
        403
      </Typography>
      <Typography variant='h1'>Woops! You are not authorized to view this page.</Typography>
    </>
  );
}

export default Unauthorized