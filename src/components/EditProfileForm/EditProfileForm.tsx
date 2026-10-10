import ContentPanel from '@/components/Layout/ContentPanel';
import { useTranslation } from 'react-i18next';
import React, { useRef, useState } from 'react';
import {
  Avatar,
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
} from '@/api/authApi';
import DeleteUserModal from './DeleteUserModal';
import ChangePasswordModal from './ChangePasswordModal';

function EditProfileForm({ onStopEdit }) {
  const { t } = useTranslation();
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
    errors = (errorObject.data as { errors?: Record<string, string> })?.errors;
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

  const [imageName, setImageName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  return (
    <>
      <ContentPanel
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <TextField
          label={t('Username')}
          fullWidth
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={!!errors?.name}
          helperText={errors?.name}
        ></TextField>
        <TextField
          label={t('First name')}
          fullWidth
          value={formData.first_name}
          onChange={(e) => handleChange('first_name', e.target.value)}
          error={!!errors?.first_name}
          helperText={errors?.first_name}
        ></TextField>
        <TextField
          label={t('Last name')}
          fullWidth
          value={formData.last_name}
          onChange={(e) => handleChange('last_name', e.target.value)}
          error={!!errors?.last_name}
          helperText={errors?.last_name}
        ></TextField>
        <TextField
          label={t('Biography')}
          multiline
          rows={3}
          fullWidth
          value={formData.biography}
          onChange={(e) => handleChange('biography', e.target.value)}
          error={!!errors?.biography}
          helperText={errors?.biography}
        ></TextField>
        <Button variant='contained' component='label'>
          {t('New Avatar')}
          <input
            type='file'
            hidden
            accept='image/png,image/jpeg,image/webp'
            onChange={handleImageChange}
            ref={fileInputRef}
          />
        </Button>
        <Typography textAlign='center'>
          {imageName ?? t('No Image Selected')}
        </Typography>
        {imagePreview && (
          <Box width={'100%'} display={'flex'} justifyContent={'center'}>
            <Avatar
              sx={{ height: '100px', width: '100px' }}
              src={imagePreview}
              alt={t('Preview of your profile photo')}
            ></Avatar>
          </Box>
        )}
        <Stack direction={'row'} mt={2} width={'100%'} spacing={2}>
          <Button fullWidth onClick={handleCancel}>
            {t('Cancel')}
          </Button>
          <Button variant='contained' fullWidth onClick={handleConfirm}>
            {t('Confirm')}
          </Button>
        </Stack>
      </ContentPanel>
      <ContentPanel
        sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Typography variant='h5' component='h2'>
          {t('Advanced Options')}
        </Typography>
        {passwordChanged && (
          <Alert severity='success'>{t('Password changed successfully.')}</Alert>
        )}
        <Button
          disabled={currentUser.has_password === false}
          onClick={() => {
            setPasswordChanged(false);
            setPasswordModalOpen(true);
          }}
        >
          {t('Change Password')}
        </Button>
        {currentUser.has_password === false && (
          <Typography variant='body2' color='text.secondary'>
            {t('You sign in with Google and do not have a password to change.')}
          </Typography>
        )}
        {passwordModalOpen && (
          <ChangePasswordModal
            onClose={() => setPasswordModalOpen(false)}
            onSuccess={() => {
              setPasswordModalOpen(false);
              setPasswordChanged(true);
            }}
          />
        )}
        <Button
          variant='outlined'
          color='error'
          onClick={() => setDeleteModalOpen(true)}
        >
          {t('Delete Account')}
        </Button>
        <DeleteUserModal
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        ></DeleteUserModal>
      </ContentPanel>
    </>
  );
}

export default EditProfileForm;
