import React, { useState, useEffect } from 'react';
import { Box, Stack, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound/NotFound';
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import CourseList from '@/components/CourseList/CourseList';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';
import { fetchCourseByExpertId } from '@/api/api';
import { Course, User } from '@/api/api.types';
import { useGetUserByIdQuery } from '@/api/userApi';

const SingleExpertPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams<{ id: string }>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[] | null>(null);

  const { data: singleUser } = useGetUserByIdQuery(id!, { skip: !id });

  console.log('Fetched user:', singleUser);

  useEffect(() => {
    if (id) {
      if (singleUser && singleUser.is_expert) {
        fetchCourseByExpertId(id).then((data: Course[]) => {
          if (data) {
            setCourses(data);
          }
        });
      }
    }
  }, [id, singleUser]);

  if (!singleUser) {
    return <NotFound />;
  }

  console.log(courses);

  const { is_expert } = singleUser;

  return (
    <Stack
      gap={2}
      direction={isMobile ? 'column' : is_expert && courses ? 'row' : 'column'}
    >
      <Box
        maxWidth={isMobile ? '100%' : is_expert && courses ? '300px' : '100%'}
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
        is_expert && courses && <CourseList user={singleUser} courses={courses} />
      )}
    </Stack>
  );
};

export default SingleExpertPage;
