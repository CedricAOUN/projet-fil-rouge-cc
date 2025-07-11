import { Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

function PremiumCard() {
  return (
    <Paper>
      <Typography variant='h3'>Premium</Typography>
      <Typography variant='subtitle1'>
        Become a Chef, View Premium Recipes and more!
      </Typography>
      <Button component={NavLink} to='/premium' variant='contained'>
        Get Premium
      </Button>
    </Paper>
  );
}

export default PremiumCard;
