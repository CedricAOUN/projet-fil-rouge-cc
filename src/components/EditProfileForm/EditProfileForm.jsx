import { Button, Paper, Stack, TextField } from '@mui/material';

function EditProfileForm({ onStopEdit }) {
  const handleConfirm = () => {
    onStopEdit();
  }

  const handleCancel = () => {
    onStopEdit();
  }

  return (
    <Paper
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField label='First name' fullWidth></TextField>
      <TextField label='Last name' fullWidth></TextField>
      <TextField label='Email' fullWidth></TextField>
      <TextField label='Biography' rows={3} fullWidth></TextField>
      <Button>Change Password</Button>
      <Button>Delete Account</Button>
      <Stack direction={'row'} mt={2} width={'100%'} spacing={2}>
        <Button fullWidth onClick={handleCancel}>Cancel</Button>
        <Button fullWidth onClick={handleConfirm}>Confirm</Button>
      </Stack>
    </Paper>
  );
}

export default EditProfileForm;
