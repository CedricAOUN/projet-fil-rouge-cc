import React, { useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from '@/api/authApi';

function EditProfileForm({ onStopEdit }) {
  const { data: currentUser } = useGetCurrentUserQuery();

  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    first_name: currentUser.first_name || '',
    last_name: currentUser.last_name || '',
    email: currentUser.email || '',
    biography: currentUser.biography || '',
    avatar_url: null,
  });

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const [updateProfile, { error: errorObject }] = useUpdateProfileMutation();

  let errors: Record<string, string> | undefined;
  if (errorObject && typeof errorObject === 'object' && 'data' in errorObject) {
    // `errorObject.data` may be unknown shape; coerce to any to access `errors`
    errors = (errorObject as any).data?.errors;
  }
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleConfirm = () => {
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('first_name', formData.first_name);
    payload.append('last_name', formData.last_name);
    payload.append('biography', formData.biography);
    if (avatarFile) {
      payload.append('avatar_url', avatarFile); // actual binary file
    }

    updateProfile({ userId: currentUser?.id, profileData: payload })
      .unwrap()
      .then(() => onStopEdit());
  };

  const handleCancel = () => {
    onStopEdit();
  };

  const fileInputRef = useRef(null);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file); // keep the real File object for upload
      setImageName(file.name);
      setImagePreview(URL.createObjectURL(file)); // string only used for <img src>
    }
  };

  const [imageName, setImageName] = useState('No Image Selected');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  return (
    <>
      <Paper
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label='First name'
          fullWidth
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={!!errors?.name}
          helperText={errors?.name}
        ></TextField>
        <TextField
          label='First name'
          fullWidth
          value={formData.first_name}
          onChange={(e) => handleChange('first_name', e.target.value)}
          error={!!errors?.first_name}
          helperText={errors?.first_name}
        ></TextField>
        <TextField
          label='Last name'
          fullWidth
          value={formData.last_name}
          onChange={(e) => handleChange('last_name', e.target.value)}
          error={!!errors?.last_name}
          helperText={errors?.last_name}
        ></TextField>
        <TextField
          label='Biography'
          rows={3}
          fullWidth
          value={formData.biography}
          onChange={(e) => handleChange('biography', e.target.value)}
          error={!!errors?.biography}
          helperText={errors?.biography}
        ></TextField>
        <Button variant='contained' component='label'>
          New Avatar
          <input
            type='file'
            hidden
            accept='image/png,image/jpeg,image/webp'
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </Button>
        <Typography textAlign='center'>{imageName}</Typography>
        {imagePreview && (
          <Box width={'100%'} display={'flex'} justifyContent={'center'}>
            <Avatar
              sx={{ height: '100px', width: '100px' }}
              src={imagePreview}
            ></Avatar>
          </Box>
        )}
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
        <Typography variant='h5'>Advanced Options</Typography>
        <Button>Change Password</Button>
        <Button>Delete Account</Button>
      </Paper>
    </>
  );
}

export default EditProfileForm;
