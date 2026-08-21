import {
  Button,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
  Link,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, User } from '@/api/api.types';
import { AuthUser, useGetCurrentUserQuery } from '@/api/authApi';

function CourseList({ courses }: { courses: Course[] }) {
  const currentUser = useGetCurrentUserQuery()?.data;

  const isCurrentUserPremium = currentUser?.is_premium;
  const navigate = useNavigate();

  const handleViewClick = (courseId) => {
    if (isCurrentUserPremium) {
      navigate(`/course/${courseId}`);
    } else {
      navigate(`/premium`);
    }
  };

  const handleAddClick = () => {
    navigate(`/courses/create`);
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
        {courses?.map((course, index) => (
          <ListItem key={index}>
            <Paper
              sx={{
                display: 'flex',
                width: '100%',
                backgroundColor: (theme) => theme.palette.background.darker,
              }}
            >
              <Stack>
                <Typography>{course.title}</Typography>
                <Typography variant='subtitle2' color='primary'>
                  By {course?.created_by?.name}
                </Typography>
              </Stack>
              <Button
                sx={{ ml: 'auto' }}
                onClick={() => handleViewClick(course.id)}
              >
                {isCurrentUserPremium ? 'View Course' : 'Get Premium'}
              </Button>
            </Paper>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

export default CourseList;
