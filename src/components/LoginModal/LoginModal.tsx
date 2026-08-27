import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import './LoginModal.css';
import { Close } from '@mui/icons-material';
import {
  useGoogleLoginMutation,
  useLoginMutation,
  useRegisterMutation,
} from '@/api/authApi';
import { formatErrors } from '@/utils/formUtils';
import GoogleSignInButton from './GoogleSignInButton';

type ApiError = {
  status?: number;
  data?: {
    code?: string;
    message?: string;
  };
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel({ children, value, index }) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function LoginModal({ isOpen, handleClose }) {
  const [value, setValue] = useState(0);

  const [loginContext, setLoginContext] = useState({
    email: '',
    password: '',
  });
  const [registerContext, setRegisterContext] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [pendingGoogleCredential, setPendingGoogleCredential] = useState<
    string | null
  >(null);
  const [linkPassword, setLinkPassword] = useState('');
  const [googleError, setGoogleError] = useState<string | null>(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [login, { error: loginError, isLoading: isLoggingIn }] =
    useLoginMutation();

  const [register, { error: registerError, isLoading: isRegistering }] =
    useRegisterMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();

  const handleLogin = () => {
    login({ email: loginContext.email, password: loginContext.password })
      .unwrap()
      .then(() => {
        handleClose();
        window.location.reload();
      })
      .catch(() => {});
  };

  const handleRegister = () => {
    register({
      name: registerContext.name,
      email: registerContext.email,
      password: registerContext.password,
    })
      .unwrap()
      .then(() => {
        handleClose();
      })
      .catch(() => {});
  };

  const completeGoogleLogin = (credential: string, password?: string) => {
    setGoogleError(null);
    googleLogin({ credential, ...(password ? { password } : {}) })
      .unwrap()
      .then(() => {
        setPendingGoogleCredential(null);
        setLinkPassword('');
        handleClose();
        window.location.reload();
      })
      .catch((error: ApiError) => {
        if (
          error.status === 409 &&
          error.data?.code === 'account_link_required'
        ) {
          setPendingGoogleCredential(credential);
          return;
        }

        setGoogleError(
          error.data?.message ?? 'Google sign-in failed. Please try again.',
        );
      });
  };

  const cancelGoogleLink = () => {
    setPendingGoogleCredential(null);
    setLinkPassword('');
    setGoogleError(null);
  };

  const loginErrors = formatErrors(loginError, 'array');
  const registerErrors = formatErrors(registerError, 'array');

  // Handle Enter Key
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        handleLogin();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // cleanup: remove listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [loginContext]);

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper
        sx={{
          p: 4,
          width: 400,
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <Close
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            margin: '10px',
            fontSize: '32px',
            cursor: 'pointer',
          }}
          onClick={handleClose}
        />

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label='login/signup tabs'
          >
            <Tab label='Login' {...a11yProps(0)} />
            <Tab label='Sign Up' {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          {loginError && (
            <Typography
              variant='body2'
              textAlign={'center'}
              color='error'
              sx={{ mb: 2 }}
            >
              {loginErrors.map((err, index) => (
                <Alert key={index} severity='error' sx={{ mb: 1 }}>
                  {err}
                </Alert>
              ))}
            </Typography>
          )}
          {!isLoggingIn ? (
            <>
              <TextField
                fullWidth
                placeholder='Email'
                sx={{ mb: 2 }}
                value={loginContext.email}
                onChange={(e) =>
                  setLoginContext({ ...loginContext, email: e.target.value })
                }
              />
              <TextField
                fullWidth
                type='password'
                placeholder='Password'
                sx={{ mb: 2 }}
                value={loginContext.password}
                onChange={(e) =>
                  setLoginContext({ ...loginContext, password: e.target.value })
                }
              />
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress />
            </Box>
          )}
          <Button
            fullWidth
            variant='contained'
            color='primary'
            onClick={handleLogin}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
          <Typography
            variant='subtitle2'
            onClick={() => setValue(1)}
            color='primary'
            sx={{
              textDecoration: 'underline',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            I don't have an account
          </Typography>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          {registerError && (
            <Typography
              variant='body2'
              textAlign={'center'}
              color='error'
              sx={{ mb: 2 }}
            >
              {registerErrors.map((err, index) => (
                <Alert key={index} severity='error' sx={{ mb: 1 }}>
                  {err}
                </Alert>
              ))}
            </Typography>
          )}
          {!isRegistering ? (
            <>
              <TextField
                fullWidth
                placeholder='Name'
                sx={{ mb: 2 }}
                value={registerContext.name}
                onChange={(e) =>
                  setRegisterContext({
                    ...registerContext,
                    name: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                placeholder='Email'
                sx={{ mb: 2 }}
                value={registerContext.email}
                onChange={(e) =>
                  setRegisterContext({
                    ...registerContext,
                    email: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                type='password'
                placeholder='Password'
                sx={{ mb: 2 }}
                value={registerContext.password}
                onChange={(e) =>
                  setRegisterContext({
                    ...registerContext,
                    password: e.target.value,
                  })
                }
              />
            </>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress />
            </Box>
          )}
          <Button
            fullWidth
            variant='contained'
            color='primary'
            onClick={handleRegister}
            disabled={isRegistering}
          >
            {isRegistering ? 'Signing Up...' : 'Sign Up'}
          </Button>
          <Typography
            variant='subtitle2'
            onClick={() => setValue(0)}
            color='primary'
            sx={{
              textDecoration: 'underline',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            Already have an account?
          </Typography>
        </CustomTabPanel>

        <Box sx={{ px: 3, pb: 3 }}>
          <Divider sx={{ mb: 2 }}>or</Divider>
          {googleError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {googleError}
            </Alert>
          )}
          {pendingGoogleCredential ? (
            <Box>
              <Alert severity='info' sx={{ mb: 2 }}>
                This email already has an account. Enter its password once to
                link Google sign-in.
              </Alert>
              <TextField
                fullWidth
                type='password'
                label='Existing account password'
                value={linkPassword}
                onChange={(event) => setLinkPassword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && linkPassword) {
                    completeGoogleLogin(pendingGoogleCredential, linkPassword);
                  }
                }}
                disabled={isGoogleLoading}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant='contained'
                  disabled={!linkPassword || isGoogleLoading}
                  onClick={() =>
                    completeGoogleLogin(pendingGoogleCredential, linkPassword)
                  }
                >
                  {isGoogleLoading ? 'Linking...' : 'Link account'}
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  onClick={cancelGoogleLink}
                  disabled={isGoogleLoading}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{ display: 'flex', justifyContent: 'center', minHeight: 44 }}
            >
              {isGoogleLoading ? (
                <CircularProgress size={32} />
              ) : (
                <GoogleSignInButton onCredential={completeGoogleLogin} />
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Modal>
  );
}

export default LoginModal;
