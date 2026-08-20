import {
  Button,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
  Link,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthUser, useGetCurrentUserQuery } from '@/api/authApi';

function ChefsList({ chefs }: { chefs: AuthUser[] }) {
  const navigate = useNavigate();

  const currentUser = useGetCurrentUserQuery().data;
  const currentUserIsPremium = currentUser.is_premium;

  const handleViewClick = (chefId) => {
    if (currentUserIsPremium) {
      navigate(`/user/${chefId}`);
    } else {
      navigate('/premium');
    }
  };

  return (
    <Paper sx={{ width: '100%' }}>
      <List
        sx={{
          width: '100%',
          maxHeight: '320px',
          overflow: 'auto',
        }}
      >
        {chefs?.map((chef, index) => (
          <ListItem key={index}>
            <Paper
              sx={{
                display: 'flex',
                width: '100%',
                backgroundColor: (theme) => theme.palette.background.darker,
              }}
            >
              <Stack>
                <Typography>{chef.name}</Typography>
                <Typography variant='subtitle2'>{chef.biography}</Typography>
              </Stack>
              <Button
                sx={{ ml: 'auto' }}
                onClick={() => handleViewClick(chef.id)}
              >
                {currentUserIsPremium ? 'View Courses' : 'Get Premium'}
              </Button>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default ChefsList;
