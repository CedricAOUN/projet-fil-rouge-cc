import React, { useState, useEffect } from 'react';
import { Box, Stack, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound/NotFound';
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import CourseList from '@/components/CourseList/CourseList';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';
import { fetchCourseByExpertId, fetchSingleExpert } from '@/api/api';
import { Course, Expert } from '@/api/api.types';

const SingleExpertPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams<{ id: string }>();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    if (id) {
      fetchSingleExpert(id).then((data: Expert) => {
        if (data) {
          setExpert(data);
        }
      });

      fetchCourseByExpertId(id).then((data: Course[]) => {
        if (data) {
          setCourses(data);
        }
      });
    }
  }, [id]);

  if (!expert) {
    return <NotFound />;
  }

  console.log(courses);

  const { is_expert } = expert;

  return (
    <Stack
      gap={2}
      direction={isMobile ? 'column' : is_expert && courses ? 'row' : 'column'}
    >
      <Box
        maxWidth={isMobile ? '100%' : is_expert && courses ? '300px' : '100%'}
      >
        <ProfileCard
          expert={expert}
          isMobile={isMobile}
          onEdit={() => setEditMode(true)}
        />
      </Box>
      {editMode ? (
        <EditProfileForm onStopEdit={() => setEditMode(false)} />
      ) : (
        is_expert && courses && <CourseList expert={expert} courses={courses} />
      )}
    </Stack>
  );
};

export default SingleExpertPage;
