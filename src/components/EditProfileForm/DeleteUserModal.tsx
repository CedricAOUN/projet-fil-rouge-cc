import { useTranslation } from 'react-i18next';
import PasswordField from '@/components/PasswordField/PasswordField';
import {
  useDeleteUserByIdMutation,
  useGetCurrentUserQuery,
} from '@/api/authApi';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useState } from 'react';

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
}

const DeleteUserModal = ({ open, onClose }: DeleteUserModalProps) => {
  const { t } = useTranslation();
  const currentUser = useGetCurrentUserQuery();

  const [password, setPassword] = useState('');
  const [deleteUserById, { error, isLoading, reset }] = useDeleteUserByIdMutation();
  const isGoogleAccount = currentUser.data?.has_google_account === true;

  const handleClose = () => {
    if (isLoading) return;
    setPassword('');
    reset();
    onClose();
  };

  const handleDeleteUser = async () => {
    if (!currentUser.data || isLoading || (!isGoogleAccount && !password)) return;

    try {
      await deleteUserById({
        id: currentUser.data.id.toString(),
        ...(isGoogleAccount ? { confirmed: true } : { password }),
      }).unwrap();
    } catch {
      // The mutation exposes the error below; keep the session and dialog open.
      return;
    }

    window.location.replace('/');
  };

  const errorData = error && 'data' in error ? error.data : undefined;
  const errorMessage =
    errorData &&
    typeof errorData === 'object' &&
    'message' in errorData &&
    typeof errorData.message === 'string'
      ? errorData.message
      : t('Unable to delete your account. Please try again.');

  return (
    <Dialog open={open} onClose={isLoading ? undefined : handleClose} aria-labelledby='delete-account-title' aria-describedby='delete-account-description'>
      <DialogTitle id='delete-account-title'>{t('Delete Account')}</DialogTitle>
      <DialogContent>
        <DialogContentText id='delete-account-description' sx={{ mb: 2 }}>
          {isGoogleAccount
            ? t('Are you sure you want to delete your account? This action is irreversible.')
            : t('Please re-enter your password to confirm account deletion. This action is irreversible.')}
        </DialogContentText>
        {!isGoogleAccount && <PasswordField
          id='password'
          label={t('Password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t('Password')}
          error={!!error}
          helperText={error ? errorMessage : undefined}
          disabled={isLoading}
          fullWidth
        />}
        {isGoogleAccount && error && <Alert severity='error'>{errorMessage}</Alert>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading} autoFocus>{t('Cancel')}</Button>
        <Button
          color='error'
          onClick={handleDeleteUser}
          disabled={isLoading || !currentUser.data || (!isGoogleAccount && !password)}
        >
          {isLoading ? t('Deleting account...') : t('Delete account')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserModal;
