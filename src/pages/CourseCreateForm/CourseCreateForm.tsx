import { useCreateCourseMutation } from '@/api/courseApi';
import {
  Box,
  Button,
  darken,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import MDEditor, { commands } from '@uiw/react-md-editor';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const MAX_VIDEO_SIZE = 200 * 1024 * 1024;

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

  const [title, setTitle] = useState('');
  const [mdContent, setMdContent] = useState('');
  const [video, setVideo] = useState<File>();
  const [videoError, setVideoError] = useState('');
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

  const [createCourse] = useCreateCourseMutation();

  const handleSubmit = () => {
    createCourse({ title, content: mdContent, video })
      .unwrap()
      .then((res) => {
        navigate(`/course/${res.id}`);
      });
  };

  return (
    <Paper
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant='h3'>Create a course</Typography>
      <TextField
        title='title'
        placeholder='Title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Stack spacing={1}>
        <Typography variant='h4'>Course video</Typography>
        <input
          type='file'
          accept='.mp4,.mov,.avi,.wmv,video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv'
          aria-describedby={videoError ? 'video-error' : undefined}
          onChange={(event) => {
            const selectedVideo = event.target.files?.[0];

            if (selectedVideo && selectedVideo.size > MAX_VIDEO_SIZE) {
              setVideo(undefined);
              setVideoError('The video must not be larger than 200 MB.');
              event.target.value = '';
              return;
            }

            setVideo(selectedVideo);
            setVideoError('');
          }}
        />
        {videoError && (
          <Typography id='video-error' variant='body2' color='error'>
            {videoError}
          </Typography>
        )}
        {video && (
          <Typography variant='body2' color='text.secondary'>
            Selected: {video.name}
          </Typography>
        )}
      </Stack>
      <Typography variant='h4'>Course content editor</Typography>
      <MDEditor
        value={mdContent}
        onChange={setMdContent}
        height={400}
        commands={customCommands}
        extraCommands={[]}
        preview='edit'
      />
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
      <Button fullWidth onClick={handleSubmit}>
        Submit
      </Button>
    </Paper>
  );
};

export default CourseCreateForm;
