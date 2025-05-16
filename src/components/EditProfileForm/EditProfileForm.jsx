import { Button, Paper, TextField } from '@mui/material';

function EditProfileForm() {
  return (
    <Paper
      sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
    >
      <TextField label='First name' fullWidth></TextField>
      <TextField label='Last name' fullWidth></TextField>
      <TextField label='Email' fullWidth></TextField>
      <Button>Change Password</Button>
      <Button>Delete Account</Button>
    </Paper>
  );
}

export default EditProfileForm;
