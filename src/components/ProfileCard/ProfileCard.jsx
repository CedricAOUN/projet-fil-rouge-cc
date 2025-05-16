import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

function ProfileCard({ expert, onEdit, isMobile }) {
  const { firstName, lastName, is_expert, avatar, biography, courses_count } =
    expert;

  const isCurrentUser = true;

  return (
    <Card sx={{ height: '100%', borderRadius: '5px' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : is_expert ? 'column' : 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Avatar sx={{ height: '100px', width: '100px' }} src={avatar} />
        <Stack
          width={'100%'}
          alignItems={'center'}
          justifyContent={'center'}
          spacing={2}
        >
          <Typography variant='h5'>
            {firstName} {lastName}
          </Typography>
          <Typography variant='subtitle1' textAlign={'center'}>
            {biography}
          </Typography>
          {courses_count && (
            <Typography variant='subtitle2'>
              Available courses: {courses_count}
            </Typography>
          )}
          {isCurrentUser && <Button onClick={onEdit}>Edit Profile</Button>}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
