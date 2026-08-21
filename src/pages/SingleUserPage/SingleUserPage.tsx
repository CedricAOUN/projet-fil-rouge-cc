import React, { useState } from 'react';
import { Box, CircularProgress, Stack, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound/NotFound';
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import CourseList from '@/components/CourseList/CourseList';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';
import { useGetCoursesByExpertIdQuery } from '@/api/courseApi';
import { useGetUserByIdQuery } from '@/api/authApi';

const SingleUserPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams<{ id: string }>();
  const [editMode, setEditMode] = useState<boolean>(false);

  const { data: singleUser, isLoading: isUserLoading } = useGetUserByIdQuery(
    id!,
    { skip: !id },
  );
  const { data: courses } = useGetCoursesByExpertIdQuery(id!, {
    skip: !id || !singleUser?.is_chef,
  });

  if (isUserLoading) {
    return (
      <Stack direction={'row'} justifyContent={'center'} p={3}>
        <CircularProgress size={'50px'} />
      </Stack>
    );
  }

  if (!singleUser) {
    return <NotFound />;
  }

  const { is_chef } = singleUser;

  return (
    <Stack
      gap={2}
      direction={isMobile ? 'column' : is_chef && courses ? 'row' : 'column'}
    >
      <Box maxWidth={isMobile ? '100%' : is_chef && courses ? '300px' : '100%'}>
        <ProfileCard
          user={singleUser}
          isMobile={isMobile}
          onEdit={() => setEditMode(true)}
        />
      </Box>
      {editMode ? (
        <EditProfileForm onStopEdit={() => setEditMode(false)} />
      ) : (
        is_chef && courses && <CourseList courses={courses} />
      )}
    </Stack>
  );
};

export default SingleUserPage;
