import { useTranslation } from 'react-i18next';
import { useGetCurrentUserQuery } from '@/api/authApi';
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
  const { t } = useTranslation();
  // Test
  const {
    name,
    first_name,
    last_name,
    is_chef,
    avatar_url,
    biography,
    courses_count,
  } = user;

  const { data: currentUser } = useGetCurrentUserQuery();

  const displayName = name || `${first_name} ${last_name}`;
  const isCurrentUser = currentUser?.id === user.id;

  return (
    <Card sx={{ height: '100%', borderRadius: '5px' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : is_chef ? 'column' : 'row',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Avatar
          sx={{ height: '100px', width: '100px' }}
          src={avatar_url}
          alt={t('Profile photo of {{name}}', { name: displayName })}
        />
        <Stack
          width={'100%'}
          alignItems={'center'}
          justifyContent={'center'}
          spacing={2}
        >
          <Typography variant='h5' component='h1'>
            {displayName}
          </Typography>
          <Typography variant='subtitle1' textAlign={'center'}>
            {biography}
          </Typography>
          {courses_count && (
            <Typography variant='subtitle2'>{t('Available courses: {{count}}', { count: courses_count })}
            </Typography>
          )}
          {isCurrentUser && <Button onClick={onEdit}>{t("Edit Profile")}</Button>}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
