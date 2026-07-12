import React from 'react';
import { RootState } from '@/store/store';
import { Button, Paper, Stack, TextField } from '@mui/material';
import { useSelector } from 'react-redux';

function EditProfileForm({ user, onStopEdit }) {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);

  const [formData, setFormData] = React.useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    biography: user.biography || '',
  });

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  // Extra guard
  // Normally, edit button should not be visible if the user is not the owner of the profile.
  if (!currentUser || currentUser?.id !== user?.id) {
    return <div>You are not authorized to edit this profile.</div>;
  }

  console.log({ user });

  const handleConfirm = () => {
    onStopEdit();
  };

  const handleCancel = () => {
    onStopEdit();
  };

  return (
    <>
      <Paper
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label='First name'
          fullWidth
          value={formData.first_name}
          onChange={(e) => handleChange('first_name', e.target.value)}
        ></TextField>
        <TextField
          label='Last name'
          fullWidth
          value={formData.last_name}
          onChange={(e) => handleChange('last_name', e.target.value)}
        ></TextField>
        <TextField
          label='Biography'
          rows={3}
          fullWidth
          value={formData.biography}
          onChange={(e) => handleChange('biography', e.target.value)}
        ></TextField>
        <Stack direction={'row'} mt={2} width={'100%'} spacing={2}>
          <Button fullWidth onClick={handleCancel}>
            Cancel
          </Button>
          <Button fullWidth onClick={handleConfirm}>
            Confirm
          </Button>
        </Stack>
      </Paper>
      <Paper
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Button>Change Password</Button>
        <Button>Delete Account</Button>
      </Paper>
    </>
  );
}

export default EditProfileForm;
