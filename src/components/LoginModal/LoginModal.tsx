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
} from '@mui/material';
import './LoginModal.css';
import { Close } from '@mui/icons-material';

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
          <TextField fullWidth placeholder='Username' sx={{ mb: 2 }} />
          <TextField
            fullWidth
            type='password'
            placeholder='Password'
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant='contained' color='primary'>
            Login
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
          <TextField fullWidth placeholder='Email' sx={{ mb: 2 }} />
          <TextField fullWidth placeholder='Username' sx={{ mb: 2 }} />
          <TextField
            fullWidth
            type='password'
            placeholder='Password'
            sx={{ mb: 2 }}
          />
          <Button fullWidth variant='contained' color='primary'>
            Sign Up
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
      </Paper>
    </Modal>
  );
}

export default LoginModal;
