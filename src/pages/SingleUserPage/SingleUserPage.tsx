import React, { useState } from 'react';
import { Box, CircularProgress, Stack, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound/NotFound';
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import CourseList from '@/components/CourseList/CourseList';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';
import { useGetCoursesByExpertIdQuery } from '@/api/courseApi';
import { useGetCurrentUserQuery, useGetUserByIdQuery } from '@/api/authApi';

const SingleUserPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams<{ id: string }>();
  const [editMode, setEditMode] = useState<boolean>(false);

  const { data: singleUser, isLoading: isUserLoading } = useGetUserByIdQuery(
    id!,
    { skip: !id },
  );
  const { data: courses } = useGetCoursesByExpertIdQuery(id!, {
    skip: !id || !singleUser,
  });

  const currentUser = useGetCurrentUserQuery()?.data;
  const isCurrentUserProfileOwner = parseInt(id) == currentUser?.id;
  const hasCourses = courses?.length > 0;

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

  return (
    <Stack
      gap={3}
      direction={isMobile ? 'column' : hasCourses ? 'row' : 'column'}
      alignItems='flex-start'
    >
      <Box
        sx={{ minWidth: 0, flexShrink: 0, width: '100%' }}
        maxWidth={isMobile ? '100%' : hasCourses ? '320px' : '100%'}
      >
        <ProfileCard
          user={singleUser}
          isMobile={isMobile}
          onEdit={() => setEditMode(true)}
        />
      </Box>
      {editMode ? (
        <EditProfileForm onStopEdit={() => setEditMode(false)} />
      ) : (
        hasCourses && (
          <CourseList
            courses={courses}
            allowModfications={isCurrentUserProfileOwner}
          />
        )
      )}
    </Stack>
  );
};

export default SingleUserPage;
