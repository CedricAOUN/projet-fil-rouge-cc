import {
  Button,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
  Link,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CourseList({ expert }) {
  const currentUserIsPremium = true;
  const isCurrentUser = true;
  const navigate = useNavigate();
  const { courses, first_name, last_name, is_expert } = expert;

  const [showMore, setShowMore] = useState(false);
  const filteredCourses = showMore ? courses : courses.slice(0, 3);

  const handleViewClick = (courseId) => {
    if (currentUserIsPremium) {
      navigate(`/course/${courseId}`);
    } else {
      navigate(`/premium`);
    }
  };

  const handleAddClick = () => {
    navigate(`/courses/create`);
  };

  return (
    <Paper sx={{ width: '100%' }}>
      <Stack direction={'row'}>
        <Typography variant='h5'>
          Courses by {first_name} {last_name}
        </Typography>
        {isCurrentUser && is_expert && (
          <Button sx={{ ml: 'auto' }} onClick={handleAddClick}>
            Add a course
          </Button>
        )}
      </Stack>
      <List
        sx={{
          width: '100%',
          maxHeight: '320px',
          overflow: showMore ? 'auto' : 'hidden',
        }}
      >
        {filteredCourses.map((course, index) => (
          <ListItem key={index}>
            <Paper
              sx={{
                display: 'flex',
                width: '100%',
                backgroundColor: '#111111',
              }}
            >
              <Stack>
                <Typography>{course.title}</Typography>
                <Typography variant='subtitle2'>
                  {course.description}
                </Typography>
              </Stack>
              <Button sx={{ ml: 'auto' }} onClick={handleViewClick}>
                {currentUserIsPremium ? 'View Course' : 'Get Premium'}
              </Button>
            </Paper>
          </ListItem>
        ))}
      </List>
      {!showMore && (
        <Stack width={'100%'}>
          <Link onClick={() => setShowMore(true)} sx={{ mx: 'auto' }}>
            Show more courses
          </Link>
        </Stack>
      )}
    </Paper>
  );
}

export default CourseList;
