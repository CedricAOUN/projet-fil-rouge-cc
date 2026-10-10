import { useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useChangePasswordMutation } from '@/api/authApi';
import type { ChangePasswordRequest } from '@/api/authApi';

interface ChangePasswordModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface PasswordErrorData {
  message?: string;
  errors?: Partial<Record<keyof ChangePasswordRequest, string | string[]>>;
}

function ChangePasswordModal({ onClose, onSuccess }: ChangePasswordModalProps) {
  const { t } = useTranslation();
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [attempted, setAttempted] = useState(false);
  const [changePassword, { error, isLoading, reset }] = useChangePasswordMutation();
  const errorData = error && 'data' in error
    ? error.data as PasswordErrorData | undefined
    : undefined;
  const fieldError = (field: keyof ChangePasswordRequest) => {
    const messages = errorData?.errors?.[field];
    return Array.isArray(messages) ? messages.join(' ') : messages;
  };

  const passwordRequirements = t(
    'Use at least 12 characters, with uppercase and lowercase letters, a number, and a symbol.',
  );
  const passwordIsValid =
    Array.from(passwordData.password).length >= 12 &&
    /\p{Ll}/u.test(passwordData.password) &&
    /\p{Lu}/u.test(passwordData.password) &&
    /\p{N}/u.test(passwordData.password) &&
    /[\p{Z}\p{S}\p{P}]/u.test(passwordData.password);
  const passwordIsDifferent = passwordData.password !== passwordData.current_password;
  const passwordsMatch = !!passwordData.password_confirmation &&
    passwordData.password === passwordData.password_confirmation;
  const currentPasswordError = fieldError('current_password') ||
    (attempted && !passwordData.current_password ? t('Enter your current password.') : undefined);
  const newPasswordError = fieldError('password') ||
    (attempted && !passwordIsValid ? passwordRequirements : undefined) ||
    (attempted && !passwordIsDifferent
      ? t('Your new password must be different from your current password.') : undefined);
  const confirmationError = fieldError('password_confirmation') ||
    ((attempted || !!passwordData.password_confirmation) && !passwordsMatch
      ? t('Passwords must match.') : undefined);

  const handleChange = (field: keyof ChangePasswordRequest, value: string) => {
    reset();
    setPasswordData(previous => ({ ...previous, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;
    setAttempted(true);
    if (!passwordData.current_password || !passwordIsValid || !passwordIsDifferent || !passwordsMatch) return;

    try {
      await changePassword(passwordData).unwrap();
    } catch {
      // Keep the dialog open so the user can correct the API errors and retry.
      return;
    }
    onSuccess();
  };

  return (
    <Dialog
      open
      onClose={() => { if (!isLoading) onClose(); }}
      fullWidth
      maxWidth='sm'
      aria-labelledby='change-password-title'
    >
      <DialogTitle id='change-password-title'>{t('Change Password')}</DialogTitle>
      <Box component='form' onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2}>
            {error && (
              <Alert severity='error'>
                {errorData?.message || t('Unable to change your password. Please try again.')}
              </Alert>
            )}
            <TextField
              id='current-password'
              label={t('Current password')}
              type='password'
              autoComplete='current-password'
              autoFocus
              required
              fullWidth
              disabled={isLoading}
              value={passwordData.current_password}
              onChange={event => handleChange('current_password', event.target.value)}
              error={!!currentPasswordError}
              helperText={currentPasswordError}
            />
            <TextField
              id='new-password'
              label={t('New password')}
              type='password'
              autoComplete='new-password'
              required
              fullWidth
              disabled={isLoading}
              value={passwordData.password}
              onChange={event => handleChange('password', event.target.value)}
              error={!!newPasswordError}
              helperText={newPasswordError || passwordRequirements}
            />
            <TextField
              id='confirm-new-password'
              label={t('Confirm password')}
              type='password'
              autoComplete='new-password'
              required
              fullWidth
              disabled={isLoading}
              value={passwordData.password_confirmation}
              onChange={event => handleChange('password_confirmation', event.target.value)}
              error={!!confirmationError}
              helperText={confirmationError}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isLoading}>{t('Cancel')}</Button>
          <Button type='submit' variant='contained' disabled={isLoading}>
            {isLoading ? t('Changing password...') : t('Change Password')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default ChangePasswordModal;
