import { useTranslation } from 'react-i18next';
import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '@/api/api.types';
import { useGetCurrentUserQuery } from '@/api/authApi';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { useDeleteCourseMutation } from '@/api/courseApi';
import ContentPanel from '@/components/Layout/ContentPanel';

export default function CourseList({ courses, allowModfications = false }: { courses: Course[]; allowModfications?: boolean }) {
  const { t } = useTranslation();
  const currentUser = useGetCurrentUserQuery()?.data;
  const navigate = useNavigate();
  const [deleteCourse] = useDeleteCourseMutation();
  const [courseIDToDelete, setCourseIDToDelete] = useState<number | null>(null);
  const handleDeleteCourse = (id: number) => {
    deleteCourse({ id }); setCourseIDToDelete(null);
  };
  return <Stack width='100%' gap={2}>
    <Typography component='h2' variant='h4'>{t('Courses')}</Typography>
    {courses?.map(course => <ContentPanel key={course.id}>
      <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Stack sx={{ flex: 1, minWidth: 0 }} spacing={1}>
          <Typography component='h3' variant='h5'>{course.title}</Typography>
          <Typography variant='body2' color='secondary.main'>{t('By {{author}}', { author: course?.created_by?.name })}</Typography>
          {course.description && <Typography color='text.secondary'>{course.description}</Typography>}
        </Stack>
        <Stack direction='row' gap={1} flexWrap='wrap'>
          {allowModfications && <>
            <IconButton aria-label={t('Edit')} color='warning' onClick={() => navigate(`/course/edit/${course.id}`)}><EditIcon /></IconButton>
            <IconButton aria-label={t('Delete')} color='error' onClick={() => setCourseIDToDelete(course.id)}><DeleteIcon /></IconButton>
          </>}
          <Button variant='outlined' onClick={() => navigate(currentUser?.is_premium ? `/course/${course.id}` : '/premium')}>{currentUser?.is_premium ? t('View Course') : t('Get Premium')}</Button>
        </Stack>
      </Stack>
    </ContentPanel>)}
    <ConfirmationModal title={t('Delete confirmation')} message={t('Are you sure you want to delete this course ?')} onClose={() => setCourseIDToDelete(null)} open={Boolean(courseIDToDelete)} onConfirm={() => handleDeleteCourse(courseIDToDelete)} />
  </Stack>;
}
