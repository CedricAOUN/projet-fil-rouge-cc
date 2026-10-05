import { Trans, useTranslation } from 'react-i18next';
import React, { useState } from 'react';
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
  Link as MuiLink,
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
import { Link as RouterLink } from 'react-router-dom';

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

function CustomTabPanel({ children, value, index, onSubmit }) {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box component='form' onSubmit={onSubmit} sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function LoginModal({ isOpen, handleClose }) {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);

  const [loginContext, setLoginContext] = useState({
    email: '',
    password: '',
  });
  const [registerContext, setRegisterContext] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [registrationAttempted, setRegistrationAttempted] = useState(false);
  const passwordRequirements =
    t("Use at least 12 characters, with uppercase and lowercase letters, a number, and a symbol.");
  const passwordIsValid =
    Array.from(registerContext.password).length >= 12 &&
    /\p{Ll}/u.test(registerContext.password) &&
    /\p{Lu}/u.test(registerContext.password) &&
    /\p{N}/u.test(registerContext.password) &&
    /[\p{Z}\p{S}\p{P}]/u.test(registerContext.password);
  const passwordsMatch =
    registerContext.password === registerContext.password_confirmation;
  const showConfirmationError =
    (registrationAttempted || registerContext.password_confirmation.length > 0) &&
    (!registerContext.password_confirmation || !passwordsMatch);
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
    if (isLoggingIn) return;
    login({ email: loginContext.email, password: loginContext.password })
      .unwrap()
      .then(() => {
        handleClose();
        window.location.reload();
      })
      .catch(() => {});
  };

  const handleRegister = () => {
    setRegistrationAttempted(true);
    if (
      isRegistering ||
      !passwordIsValid ||
      !passwordsMatch ||
      !registerContext.password_confirmation
    ) return;
    register({
      name: registerContext.name,
      email: registerContext.email,
      password: registerContext.password,
      password_confirmation: registerContext.password_confirmation,
    })
      .unwrap()
      .then(() => {
        handleClose();
        window.location.reload();
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
          error.data?.message ?? t("Google sign-in failed. Please try again."),
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
            aria-label={t("login/signup tabs")}
          >
            <Tab label={t("Login")} {...a11yProps(0)} />
            <Tab label={t("Sign Up")} {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel
          value={value}
          index={0}
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
            handleLogin();
          }}
        >
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
                placeholder={t("Email")}
                type='email'
                autoComplete='email'
                required
                sx={{ mb: 2 }}
                value={loginContext.email}
                onChange={(e) =>
                  setLoginContext({ ...loginContext, email: e.target.value })
                }
              />
              <TextField
                fullWidth
                type='password'
                placeholder={t("Password")}
                autoComplete='current-password'
                required
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
            type='submit'
            disabled={isLoggingIn}
          >
            {isLoggingIn ? t("Logging in...") : t("Login")}
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
          >{t("I don't have an account")}</Typography>
        </CustomTabPanel>

        <CustomTabPanel
          value={value}
          index={1}
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
            handleRegister();
          }}
        >
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
                placeholder={t("Name")}
                label={t("Name")}
                autoComplete='username'
                required
                slotProps={{ htmlInput: { maxLength: 20 } }}
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
                placeholder={t("Email")}
                label={t("Email")}
                type='email'
                autoComplete='email'
                required
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
                placeholder={t("Password")}
                sx={{ mb: 2 }}
                value={registerContext.password}
                label={t("Password")}
                autoComplete='new-password'
                required
                error={registrationAttempted && !passwordIsValid}
                helperText={passwordRequirements}
                onChange={(e) =>
                  setRegisterContext({
                    ...registerContext,
                    password: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                type='password'
                label={t("Confirm password")}
                autoComplete='new-password'
                required
                sx={{ mb: 2 }}
                value={registerContext.password_confirmation}
                error={showConfirmationError}
                helperText={showConfirmationError ? t("Passwords must match.") : undefined}
                onChange={(e) =>
                  setRegisterContext({
                    ...registerContext,
                    password_confirmation: e.target.value,
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
            type='submit'
            disabled={isRegistering}
          >
            {isRegistering ? t("Signing Up...") : t("Sign Up")}
          </Button>
          <Typography variant='caption' color='text.secondary' display='block' sx={{ mt: 1.5 }}>
            <Trans i18nKey="By creating an account, you accept the <terms>Terms of Use</terms> and acknowledge that you have read the <privacy>privacy policy</privacy>." components={{ terms: <MuiLink component={RouterLink} to='/conditions-utilisation' target='_blank' rel='noreferrer' />, privacy: <MuiLink component={RouterLink} to='/confidentialite' target='_blank' rel='noreferrer' /> }} />
          </Typography>
          <Typography
            variant='subtitle2'
            onClick={() => setValue(0)}
            color='primary'
            sx={{
              textDecoration: 'underline',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >{t("Already have an account?")}</Typography>
        </CustomTabPanel>

        <Box sx={{ px: 3, pb: 3 }}>
          <Divider sx={{ mb: 2 }}>{t("or")}</Divider>
          {googleError && (
            <Alert severity='error' sx={{ mb: 2 }}>
              {googleError}
            </Alert>
          )}
          {pendingGoogleCredential ? (
            <Box>
              <Alert severity='info' sx={{ mb: 2 }}>{t("This email already has an account. Enter its password once to link Google sign-in.")}</Alert>
              <TextField
                fullWidth
                type='password'
                label={t("Existing account password")}
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
                  {isGoogleLoading ? t("Linking...") : t("Link account")}
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  onClick={cancelGoogleLink}
                  disabled={isGoogleLoading}
                >{t("Cancel")}</Button>
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
