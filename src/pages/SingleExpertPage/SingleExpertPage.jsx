import { Box, Stack, useMediaQuery } from '@mui/material';
import { MOCK_EXPERTS } from '../../api/mockApi';
import { useParams } from 'react-router-dom';
import NotFound from '../NotFound/NotFound';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import CourseList from '../../components/CourseList/CourseList';
import EditProfileForm from '../../components/EditProfileForm/EditProfileForm';

const SingleExpertPage = () => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const { id } = useParams();
  const expert = MOCK_EXPERTS.find((expert) => expert.id == id);
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
        <ProfileCard expert={expert} isMobile={isMobile} />
      </Box>
      {/* {is_expert && courses && <CourseList expert={expert} />} */}
      <EditProfileForm />
    </Stack>
  );
};

export default SingleExpertPage;
