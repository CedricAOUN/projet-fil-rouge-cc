import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ContentPanel from '@/components/Layout/ContentPanel';
import { useForgotPasswordMutation } from '@/api/authApi';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  return <ContentPanel sx={{ maxWidth: 520, mx: 'auto' }}>
    <Stack spacing={3}>
      <Typography variant='h1'>{t('Forgot password?')}</Typography>
      <Typography>{t('Password recovery is for MealMosaic accounts. If you use Google, sign in with Google.')}</Typography>
      {submitted ? <Alert severity='success'>{t('If this email belongs to a MealMosaic password account, we have sent a reset link.')}</Alert>
        : <Stack component='form' spacing={2} onSubmit={async event => {
          event.preventDefault();
          if (isLoading) return;
          try { await forgotPassword({ email }).unwrap(); setSubmitted(true); } catch { /* Show the request error below. */ }
        }}>
          <TextField label={t('Email')} type='email' autoComplete='email' required fullWidth value={email} onChange={event => setEmail(event.target.value)} disabled={isLoading} />
          {error && <Alert severity='error'>{t('Unable to send the reset link. Please try again.')}</Alert>}
          <Button type='submit' variant='contained' disabled={isLoading}>{isLoading ? t('Sending...') : t('Send reset link')}</Button>
        </Stack>}
      <Button component={Link} to='/'>{t('Back to Home')}</Button>
    </Stack>
  </ContentPanel>;
}
