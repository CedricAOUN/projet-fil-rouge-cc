import React from 'react';
import {
  Avatar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';

function SimpleMenu({ isMobile, currentUser, onNavigateToProfile, onLogout }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <IconButton
        sx={{ p: 0 }}
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
      >
        <Avatar
          src={currentUser.avatar_url}
          alt={currentUser.name}
          sx={
            isMobile
              ? { width: 32, height: 32 }
              : {
                  width: 40,
                  height: 40,
                  border: (theme) =>
                    anchorEl
                      ? `2px solid ${theme.palette.primary.main}`
                      : 'none',
                  '&:hover': {
                    border: (theme) =>
                      `2px solid ${theme.palette.primary.main}`,
                  },
                }
          }
        />
      </IconButton>
      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuItem disabled>
          <Typography textAlign={'center'} width={'100%'}>
            {currentUser.name}
          </Typography>
        </MenuItem>
        <MenuItem onClick={onNavigateToProfile}>
          <Typography textAlign={'center'} width={'100%'}>
            Profile
          </Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={onLogout}>
          <Typography textAlign={'center'} width={'100%'} color={'error'}>
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default SimpleMenu;
