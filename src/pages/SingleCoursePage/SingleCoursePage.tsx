import { useGetCourseByIdQuery } from '@/api/courseApi';
import { useParams } from 'react-router-dom';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ReactPlayer from 'react-player';

const SingleCoursePage = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: course,
    isLoading,
    error,
  } = useGetCourseByIdQuery(id!, { skip: !id });

  if (isLoading) {
    <Stack direction={'row'} justifyContent={'center'} p={3}>
      <CircularProgress size={'50px'} />
    </Stack>;
  }

  if (error) {
    // @ts-ignore
    return <PageErrorHandler errorStatus={error.status} />;
  }

  return (
    <Paper>
      <Typography variant='h3' textAlign={'center'}>
        {course?.title}
      </Typography>
      <Typography variant='subtitle2' color='primary' textAlign={'center'}>
        by {course?.created_by.name}
      </Typography>
      {course?.video_url && (
        <>
          <Divider></Divider>
          <Stack alignItems={'center'} py={2} px={'15%'}>
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
      <Box sx={{ padding: 2 }}>
        <ReactMarkdown>{course?.content}</ReactMarkdown>
      </Box>
    </Paper>
  );
};

export default SingleCoursePage;
