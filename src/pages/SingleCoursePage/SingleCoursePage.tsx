import { useTranslation } from 'react-i18next';
import { useGetCourseByIdQuery } from '@/api/courseApi';
import { useParams } from 'react-router-dom';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';
import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';
import ContentPanel from '@/components/Layout/ContentPanel';

const SingleCoursePage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseByIdQuery(id!, { skip: !id });

  if (isLoading) {
    return <Stack direction={'row'} justifyContent={'center'} p={3}>
      <CircularProgress size={'50px'} />
    </Stack>;
  }

  if (error) {
    return <PageErrorHandler errorStatus={'status' in error && typeof error.status === 'number' ? error.status : 500} />;
  }

  return (
    <ContentPanel>
      <Typography variant='h1' gutterBottom textAlign={'center'}>
        {course?.title}
      </Typography>
      <Typography variant='subtitle2' color='primary' textAlign={'center'}>{t('by {{author}}', { author: course?.created_by.name })}
      </Typography>
      {course?.video_url && (
        <>
          <Divider></Divider>
          <Stack alignItems='center' sx={{ my: 3, mx: 'auto', maxWidth: 900, aspectRatio: '16 / 9' }}>
            <ReactPlayer
              src={course.video_url}
              controls
              width={'100%'}
              height={'100%'}
              style={{
                borderRadius: '12px',
              }}
            />
          </Stack>
        </>
      )}
      <Divider></Divider>
      <Box sx={{ maxWidth: '70ch', mx: 'auto', py: 3, overflowWrap: 'anywhere', '& img': { maxWidth: '100%' }, '& pre': { overflowX: 'auto' }, '& table': { display: 'block', overflowX: 'auto' }, '& a': { color: 'primary.main' }, '& blockquote': { ml: 0, pl: 3, borderLeft: 3, borderColor: 'secondary.main', color: 'text.secondary' } }}>
        <ReactMarkdown>{course?.content}</ReactMarkdown>
      </Box>
    </ContentPanel>
  );
};

export default SingleCoursePage;
