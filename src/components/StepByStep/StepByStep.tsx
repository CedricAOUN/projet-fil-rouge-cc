import { useTranslation } from 'react-i18next';
import { Typography } from '@mui/material';
import ContentPanel from '@/components/Layout/ContentPanel';

export default function StepByStep({ instructions }: { instructions: string }) {
  const { t } = useTranslation();
  return <ContentPanel sx={{ flex: 1, width: '100%' }}>
    <Typography variant='h4' component='h2' gutterBottom>{t('Steps')}</Typography>
    <Typography sx={{ maxWidth: '70ch', whiteSpace: 'pre-line' }}>{instructions}</Typography>
  </ContentPanel>;
}
