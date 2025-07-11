import React, { useState, useEffect } from 'react';
import { Box, Stack, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import NotFound from '@/pages/NotFound/NotFound';
import ProfileCard from '@/components/ProfileCard/ProfileCard';
import CourseList from '@/components/CourseList/CourseList';
import EditProfileForm from '@/components/EditProfileForm/EditProfileForm';
import { fetchSingleExpert } from '@/api/api';
import { Expert } from '@/api/api.types';

const SingleExpertPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams<{ id: string }>();
  const [expert, setExpert] = useState<Expert | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      fetchSingleExpert(id).then((data: Expert) => {
        if (data) {
          setExpert(data);
        }
      });
    }
  }, [id]);

  if (!expert) {
    return <NotFound />;
  }

  const { is_expert, courses } = expert;

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
        is_expert && courses && <CourseList expert={expert} />
      )}
    </Stack>
  );
};

export default SingleExpertPage;
