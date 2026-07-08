import { Typography } from '@mui/material';
import React from 'react'

function Unauthenticated() {
  return (
    <>
      <Typography variant='h1' fontSize={60}>
        401
      </Typography>
      <Typography variant='h1'>You need to be logged in to view this page.</Typography>
    </>
  );
}

export default Unauthenticated