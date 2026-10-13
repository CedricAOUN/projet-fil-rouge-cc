import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function PasswordField({ disabled, ...props }: Omit<TextFieldProps, 'type' | 'slotProps'>) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextField
      {...props}
      disabled={disabled}
      type={showPassword ? 'text' : 'password'}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                type='button'
                edge='end'
                disabled={disabled}
                aria-label={showPassword ? t('Hide password') : t('Show password')}
                aria-pressed={showPassword}
                onClick={() => setShowPassword(previous => !previous)}
                onMouseDown={event => event.preventDefault()}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  );
}

export default PasswordField;
