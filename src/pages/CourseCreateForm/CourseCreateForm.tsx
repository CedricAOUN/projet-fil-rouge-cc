import {
  useCreateCourseMutation,
  useEditCourseMutation,
  useGetCourseByIdQuery,
} from '@/api/courseApi';
import {
  Box,
  Button,
  CircularProgress,
  darken,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useGetCurrentUserQuery } from '@/api/authApi';
import PageErrorHandler from '../PageErrorHandler/PageErrorHandler';
import { Controller, Resolver, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const MAX_VIDEO_SIZE = 200 * 1024 * 1024;

type CourseFormData = {
  title: string;
  content: string;
  video?: File;
};

const schema = yup
  .object({
    title: yup.string().required('Title is required'),
    content: yup.string().required('Content is required'),
    video: yup
      .mixed<File>()
      .test(
        'fileSize',
        'The video must not be larger than 200 MB.',
        (file) => !file || file.size <= MAX_VIDEO_SIZE,
      )
      .optional(),
  })
  .required();

const headingGroup = commands.group(
  [
    { ...commands.heading1, buttonProps: { 'aria-label': 'Heading 1' } },
    { ...commands.heading2, buttonProps: { 'aria-label': 'Heading 2' } },
    { ...commands.heading3, buttonProps: { 'aria-label': 'Heading 3' } },
    { ...commands.heading4, buttonProps: { 'aria-label': 'Heading 4' } },
    { ...commands.heading5, buttonProps: { 'aria-label': 'Heading 5' } },
    { ...commands.heading6, buttonProps: { 'aria-label': 'Heading 6' } },
  ],
  {
    name: 'heading',
    groupName: 'heading',
    buttonProps: { 'aria-label': 'Insert heading' },
    icon: (
      <span style={{ fontSize: 12, fontWeight: 600, marginBottom: '3px' }}>
        H
      </span>
    ),
  },
);

const CourseCreateForm = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const { data: edittingCourse, isLoading: isLoadingExistingCourse } =
    useGetCourseByIdQuery(id!, { skip: !id });

  const currentUser = useGetCurrentUserQuery().data;
  const isCurrentUserChef = currentUser?.is_chef;

  const currentUserOwnsCourse =
    currentUser?.id == edittingCourse?.created_by?.id;

  const formValues = useMemo<CourseFormData>(
    () => ({
      title: edittingCourse?.title || '',
      content: edittingCourse?.content || '',
      video: undefined,
    }),
    [edittingCourse],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: yupResolver(schema) as Resolver<CourseFormData>,
    values: formValues,
  });

  const mdContent = watch('content');
  const customCommands = [
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.divider,
    headingGroup,
    commands.divider,
    commands.link,
    commands.quote,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
  ];

  const [createCourse, { isLoading: isCreateLoading }] =
    useCreateCourseMutation();
  const [editCourse, { isLoading: isEditLoading }] = useEditCourseMutation();

  const onSubmit = (data: CourseFormData) => {
    const request = edittingCourse
      ? editCourse({ ...data, id: Number(id) })
      : createCourse(data);

    request.unwrap().then((res) => {
      navigate(`/course/${res.id}`);
    });
  };

  if (isLoadingExistingCourse || isCreateLoading || isEditLoading) {
    return (
      <Stack direction='row' justifyContent='center' p={3}>
        <CircularProgress size='50px' />
      </Stack>
    );
  }

  if (!isCurrentUserChef || (edittingCourse && !currentUserOwnsCourse)) {
    return <PageErrorHandler errorStatus={403} />;
  }

  return (
    <Paper
      component='form'
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant='h3'>Create a course</Typography>
      <TextField
        {...register('title')}
        placeholder='Title'
        required
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <Stack spacing={1}>
        <Typography variant='h4'>Course video</Typography>
        <input
          type='file'
          accept='.mp4,.mov,.avi,.wmv,video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv'
          aria-describedby={errors.video ? 'video-error' : undefined}
          onChange={(event) => {
            const selectedVideo = event.target.files?.[0];
            setValue('video', selectedVideo, { shouldValidate: true });
          }}
        />
        {errors.video && (
          <Typography id='video-error' variant='body2' color='error'>
            {errors.video.message}
          </Typography>
        )}
        {watch('video') && (
          <Typography variant='body2' color='text.secondary'>
            Selected: {watch('video')?.name}
          </Typography>
        )}
      </Stack>
      <Typography variant='h4'>Course content editor</Typography>
      <Controller
        name='content'
        control={control}
        render={({ field }) => (
          <MDEditor
            value={field.value}
            onChange={(value) => field.onChange(value ?? '')}
            height={400}
            commands={customCommands}
            extraCommands={[]}
            preview='edit'
          />
        )}
      />
      {errors.content && (
        <Typography variant='body2' color='error'>
          {errors.content.message}
        </Typography>
      )}
      <Typography variant='h4'>Preview</Typography>
      <Box
        sx={{
          background: (theme) => darken(theme.palette.background.paper, 0.4),
          padding: 2,
        }}
      >
        <ReactMarkdown>
          {mdContent
            ? mdContent
            : 'Write something in the editor to preview it here !'}
        </ReactMarkdown>
      </Box>
      <Button fullWidth type='submit'>
        {edittingCourse ? 'Confirm' : 'Submit'}
      </Button>
    </Paper>
  );
};

export default CourseCreateForm;
