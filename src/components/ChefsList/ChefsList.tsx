import { useTranslation } from 'react-i18next';
import { Avatar, Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { AuthUser } from '@/api/authApi';
import ContentPanel from '@/components/Layout/ContentPanel';

export default function ChefsList({ chefs }: { chefs: AuthUser[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return <Stack spacing={2} width='100%'>
    {chefs?.map(chef => <ContentPanel key={chef.id}>
      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} gap={3}>
        <Avatar src={chef.avatar_url} alt={chef.name} sx={{ width: 64, height: 64 }} />
        <Stack sx={{ flex: 1, minWidth: 0 }} spacing={0.5}>
          <Typography variant='h5' component='h2'>{chef.name}</Typography>
          <Typography color='text.secondary'>{chef.biography}</Typography>
        </Stack>
        <Button variant='outlined' color='secondary' onClick={() => navigate(`/user/${chef.id}`)}>{t('View Courses')}</Button>
      </Stack>
    </ContentPanel>)}
  </Stack>;
}
