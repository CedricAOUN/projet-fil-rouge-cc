import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Link as MuiLink,
  Stack,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import LoginModal from '@/components/LoginModal/LoginModal';
import ThemeModeToggle from './ThemeModeToggle';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery, useLogoutMutation } from '@/api/authApi';
import ProfileDropdown from './ProfileDropdown';

export default function Header({ currentTheme, onThemeToggle }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  const { data: currentUser } = useGetCurrentUserQuery();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = () => setIsOpen(true);
  const handleModalClose = () => setIsOpen(false);

  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const handleLogout = () => {
    logout()
      .unwrap()
      .then(() => {
        window.location.reload();
      })
      .catch(() => {});
  };

  const navigateToProfile = () => navigate(`/user/${currentUser?.id}`);

  const linkStyles = {
    mx: '2px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    px: '14px',
    py: '6px',
    borderRadius: '20px',
    transition: 'background 0.2s, color 0.2s',
    '&:hover': {
      textDecoration: 'none',
      backgroundColor: theme.palette.action.hover,
      '&::after': {
        width: '0%',
      },
    },
    '&.active': {
      backgroundColor: `${theme.palette.secondary.main}22`,
      color: theme.palette.secondary.main,
    },
  };

  return (
    <>
      <AppBar position='sticky' component='header'>
        <Box
          sx={{
            padding: '10px 8%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <MuiLink
            component={NavLink}
            to='/'
            sx={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              '&::after': { display: 'none' },
              '&:hover': { textDecoration: 'none' },
            }}
          >
            <Box
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                borderRadius: '10px',
                px: '10px',
                py: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              <Box
                component='span'
                sx={{
                  color: theme.palette.primary.contrastText,
                  fontWeight: 800,
                  fontSize: isMobile ? '15px' : '17px',
                  letterSpacing: '-0.5px',
                }}
              >
                Meal
              </Box>
              <Box
                component='span'
                sx={{
                  color: theme.palette.secondary.contrastText,
                  fontWeight: 400,
                  fontSize: isMobile ? '15px' : '17px',
                  letterSpacing: '-0.5px',
                }}
              >
                Mosaic
              </Box>
            </Box>
          </MuiLink>

          {isMobile ? (
            <Stack
              direction='row'
              gap={1}
              ml='auto'
              mr='10px'
              alignItems='center'
            >
              <IconButton onClick={handleMenuOpen} color='inherit'>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem>
                  <MuiLink component={NavLink} to='/recipes' sx={linkStyles}>
                    Recipes
                  </MuiLink>
                </MenuItem>
                <MenuItem>
                  <MuiLink component={NavLink} to='/chefs' sx={linkStyles}>
                    Experts
                  </MuiLink>
                </MenuItem>
                <MenuItem>
                  <MuiLink component={NavLink} to='/premium' sx={linkStyles}>
                    Premium
                  </MuiLink>
                </MenuItem>
              </Menu>
            </Stack>
          ) : (
            <Stack direction='row' gap='2px' alignItems='center'>
              <MuiLink component={NavLink} to='/recipes' sx={linkStyles}>
                Recipes
              </MuiLink>
              <MuiLink component={NavLink} to='/chefs' sx={linkStyles}>
                Experts
              </MuiLink>
              <MuiLink component={NavLink} to='/premium' sx={linkStyles}>
                Premium
              </MuiLink>
            </Stack>
          )}

          <Stack direction='row' gap='10px' alignItems='center'>
            {!currentUser && (
              <Button
                variant='contained'
                color='primary'
                size={isMobile ? 'small' : 'medium'}
                onClick={handleModalOpen}
              >
                Sign In
              </Button>
            )}
            {currentUser && (
              <ProfileDropdown
                currentUser={currentUser}
                isMobile={isMobile}
                onNavigateToProfile={navigateToProfile}
                onLogout={handleLogout}
              />
            )}
            <ThemeModeToggle
              currentTheme={currentTheme}
              onThemeToggle={onThemeToggle}
            />
          </Stack>
        </Box>
      </AppBar>
      <LoginModal isOpen={isOpen} handleClose={handleModalClose} />
    </>
  );
}
