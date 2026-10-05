import { useTranslation } from 'react-i18next';
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
  allowModfications = false,
}: {
  courses: Course[];
  allowModfications?: boolean;
}) {
  const { t } = useTranslation();
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
      <Typography component='h2' variant='h4'>{t("Courses")}</Typography>
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
                <Typography component='h3'>{course.title}</Typography>
                <Typography variant='subtitle2' color='primary'>{t('By {{author}}', { author: course?.created_by?.name })}
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
                  {isCurrentUserPremium ? t("View Course") : t("Get Premium")}
                </Button>
              </Stack>
            </Paper>
          </ListItem>
        ))}
      </List>
      <ConfirmationModal
        title={t("Delete confirmation")}
        message={t("Are you sure you want to delete this course ?")}
        onClose={() => setCourseIDToDelete(null)}
        open={Boolean(courseIDToDelete)}
        onConfirm={() => handleDeleteCourse(courseIDToDelete)}
      />
    </Paper>
  );
}

export default CourseList;
