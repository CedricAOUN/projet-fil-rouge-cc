import {
  useDeleteUserByIdMutation,
  useGetCurrentUserQuery,
} from '@/api/authApi';
import { Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface DeleteUserModalProps {
  open: boolean;
  onClose: () => void;
}

const DeleteUserModal = ({ open, onClose }: DeleteUserModalProps) => {
  const currentUser = useGetCurrentUserQuery();

  const [password, setPassword] = useState('');
  const [deleteUserById, { error, isLoading }] = useDeleteUserByIdMutation();

  const handleDeleteUser = async () => {
    if (!currentUser.data || isLoading || !password) return;

    try {
      await deleteUserById({ id: currentUser.data.id.toString(), password }).unwrap();
    } catch {
      // The mutation exposes the error below; keep the session and dialog open.
      return;
    }

    window.location.replace('/');
  };

  const errorData = error && 'data' in error ? error.data : undefined;
  const errorMessage =
    errorData && typeof errorData === 'object' && 'message' in errorData &&
    typeof errorData.message === 'string'
      ? errorData.message
      : 'Unable to delete your account. Please try again.';

  return (
    <Dialog open={open} onClose={onClose}>
      <Stack gap={2}>
        <Typography>
          Please re-enter your password to confirm account deletion. This action
          is irreversible.
        </Typography>
        <TextField
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          error={!!error}
          helperText={error ? errorMessage : undefined}
          disabled={isLoading}
        ></TextField>
        <Button
          onClick={handleDeleteUser}
          disabled={isLoading || !password || !currentUser.data}
        >
          Delete account
        </Button>
      </Stack>
    </Dialog>
  );
};

export default DeleteUserModal;
