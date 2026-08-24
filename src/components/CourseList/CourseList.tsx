import {
  Button,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
  Link,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course, User } from '@/api/api.types';
import { AuthUser, useGetCurrentUserQuery } from '@/api/authApi';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { useDeleteCourseMutation } from '@/api/courseApi';

function CourseList({
  courses,
  allowModfications,
}: {
  courses: Course[];
  allowModfications: boolean;
}) {
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

  const [deleteCourse] = useDeleteCourseMutation();
  const [courseIDToDelete, setCourseIDToDelete] = useState<number>();
  const handleDeleteCourse = (id) => {
    deleteCourse({ id });
    setCourseIDToDelete(null);
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
              <Stack direction={'row'} sx={{ ml: 'auto' }}>
                {allowModfications && (
                  <>
                    <IconButton
                      color='warning'
                      onClick={() => navigate(`/course/edit/${course.id}`)}
                    >
                      <EditIcon></EditIcon>
                    </IconButton>
                    <IconButton
                      color='error'
                      onClick={() => setCourseIDToDelete(course.id)}
                    >
                      <DeleteIcon></DeleteIcon>
                    </IconButton>
                  </>
                )}
                <Button onClick={() => handleViewClick(course.id)}>
                  {isCurrentUserPremium ? 'View Course' : 'Get Premium'}
                </Button>
              </Stack>
            </Paper>
          </ListItem>
        ))}
      </List>
      <ConfirmationModal
        title='Delete confirmation'
        message='Are you sure you want to delete this course ?'
        onClose={() => setCourseIDToDelete(null)}
        open={Boolean(courseIDToDelete)}
        onConfirm={() => handleDeleteCourse(courseIDToDelete)}
      />
    </Paper>
  );
}

export default CourseList;
