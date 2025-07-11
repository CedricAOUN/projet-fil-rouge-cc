import { Typography } from '@mui/material';

function NotFound() {
  return (
    <>
      <Typography variant='h1' fontSize={60}>
        404
      </Typography>
      <Typography variant='h1'>Woops! This page doesn't exist.</Typography>
    </>
  );
}

export default NotFound;
