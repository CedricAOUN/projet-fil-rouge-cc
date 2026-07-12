import { RootState, useAppSelector } from '@/store/store';
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

function ProfileCard({ user, onEdit, isMobile }) {
  // Test
  const {
    name,
    first_name,
    last_name,
    is_expert,
    avatar_url,
    biography,
    courses_count,
  } = user;

  const currentUser = useAppSelector(
    (state: RootState) => state.user.currentUser,
  );

  const displayName = name || `${first_name} ${last_name}`;
  const isCurrentUser = currentUser?.id === user.id;

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
        <Avatar sx={{ height: '100px', width: '100px' }} src={avatar_url} />
        <Stack
          width={'100%'}
          alignItems={'center'}
          justifyContent={'center'}
          spacing={2}
        >
          <Typography variant='h5'>{displayName}</Typography>
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
