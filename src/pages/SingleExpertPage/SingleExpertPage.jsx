import { Box, Stack, useMediaQuery } from '@mui/material';
import { useParams } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import CourseList from '../../components/CourseList/CourseList';
import EditProfileForm from '../../components/EditProfileForm/EditProfileForm';
import { useState, useEffect } from 'react';
import { fetchSingleExpert } from '../../api/api';

const SingleExpertPage = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchSingleExpert(id).then((data) => {
      if (data) {
        setExpert(data);
      }
    });
  }, []);

  if (!expert) {
    return <NotFound />;
  }

  const { is_expert, courses } = expert;

  if (!expert) {
    return <NotFound />;
  }

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
