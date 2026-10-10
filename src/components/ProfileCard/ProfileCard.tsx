import { useTranslation } from 'react-i18next';
import { useGetCurrentUserQuery } from '@/api/authApi';
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
    <Card sx={{ height: '100%', width: '100%' }}>
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : is_chef ? 'column' : 'row',
          alignItems: 'center',
          gap: 3,
          p: { xs: 3, md: 4 },
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
          <Typography variant='h3' component='h1'>
            {displayName}
          </Typography>
          <Typography color='text.secondary' textAlign={'center'} sx={{ maxWidth: '65ch' }}>
            {biography}
          </Typography>
          {courses_count && (
            <Typography variant='subtitle2'>{t('Available courses: {{count}}', { count: courses_count })}
            </Typography>
          )}
          {isCurrentUser && <Button variant='outlined' onClick={onEdit}>{t("Edit Profile")}</Button>}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ProfileCard;
