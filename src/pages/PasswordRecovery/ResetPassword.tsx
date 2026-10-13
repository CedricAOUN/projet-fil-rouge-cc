import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import ContentPanel from '@/components/Layout/ContentPanel';
import PasswordField from '@/components/PasswordField/PasswordField';
import { useResetPasswordMutation } from '@/api/authApi';

export default function ResetPassword() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const token = params.get('token');
  const email = params.get('email');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [attempted, setAttempted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();
  const valid = Array.from(password).length >= 12 && /\p{Ll}/u.test(password) && /\p{Lu}/u.test(password) && /\p{N}/u.test(password) && /[\p{Z}\p{S}\p{P}]/u.test(password);
  const matches = !!confirmation && password === confirmation;
  const requirements = t('Use at least 12 characters, with uppercase and lowercase letters, a number, and a symbol.');
  const serverError = error && 'data' in error ? error.data as { message?: string; errors?: Record<string, string[]> } : undefined;

  return <ContentPanel sx={{ maxWidth: 520, mx: 'auto' }}>
    <Stack spacing={3}>
      <Typography variant='h1'>{t('Reset password')}</Typography>
      {completed ? <>
        <Alert severity='success'>{t('Your password has been reset. You can now sign in.')}</Alert>
        <Button component={Link} to='/'>{t('Back to Home')}</Button>
      </> : <>
        {!token || !email ? <Alert severity='error'>{t('This password reset link is invalid or expired. Request a new link.')}</Alert>
          : <Stack component='form' spacing={2} onSubmit={async event => {
            event.preventDefault(); setAttempted(true);
            if (isLoading || !valid || !matches) return;
            try { await resetPassword({ email, token, password, password_confirmation: confirmation }).unwrap(); setPassword(''); setConfirmation(''); setCompleted(true); setParams({}, { replace: true }); }
            catch { /* Keep the form open for correction or a new reset link. */ }
          }}>
            <PasswordField label={t('New password')} autoComplete='new-password' required fullWidth value={password} onChange={event => setPassword(event.target.value)} disabled={isLoading} error={(attempted && !valid) || !!serverError?.errors?.password} helperText={serverError?.errors?.password?.[0] || requirements} />
            <PasswordField label={t('Confirm password')} autoComplete='new-password' required fullWidth value={confirmation} onChange={event => setConfirmation(event.target.value)} disabled={isLoading} error={(attempted || !!confirmation) && !matches} helperText={(attempted || !!confirmation) && !matches ? t('Passwords must match.') : undefined} />
            {error && <Alert severity='error'>{serverError?.errors?.password ? t('Please check your new password and try again.') : serverError?.message === 'This password reset link is invalid or expired. Request a new link.' ? t(serverError.message) : t('Unable to reset your password. Please try again.')}</Alert>}
            <Button type='submit' variant='contained' disabled={isLoading}>{isLoading ? t('Resetting password...') : t('Reset password')}</Button>
          </Stack>}
        <Button component={Link} to='/forgot-password'>{t('Request a new reset link')}</Button>
      </>}
    </Stack>
  </ContentPanel>;
}
