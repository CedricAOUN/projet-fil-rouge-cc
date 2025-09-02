import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Link as MuiLink,
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import LoginModal from '@/components/LoginModal/LoginModal';
import ThemeModeToggle from './ThemeModeToggle';
import { NavLink } from 'react-router-dom';

export default function Header({ currentTheme, onThemeToggle }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = () => setIsOpen(true);
  const handleModalClose = () => setIsOpen(false);

  const linkStyles = {
    mx: '5px',
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    fontSize: '18px',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'none',
      '&::after': {
        width: '0%',
      },
    },
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <Box
        sx={{
          backgroundColor: currentTheme === 'light' ? '#fff' : '#1f1f1f',
          boxShadow: '0px 8px 14px -3px rgba(0,0,0,0.2)',
          padding: '20px 15%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <MuiLink
          component={NavLink}
          to='/'
          sx={{
            ...linkStyles,
            fontSize: isMobile ? '20px' : '30px',
            width: '100px',
            display: 'block',
            color: '#FF4E4E',
          }}
        >
          <Box component='span' sx={{ color: '#CEB600', fontWeight: 700 }}>
            Meal
          </Box>
          Mosaic
        </MuiLink>

        {isMobile ? (
          <Stack direction='row' gap={1}>
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
                <MuiLink component={NavLink} to='/experts' sx={linkStyles}>
                  Experts
                </MuiLink>
              </MenuItem>
              <MenuItem>
                <MuiLink component={NavLink} to='/premium' sx={linkStyles}>
                  Premium
                </MuiLink>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleModalOpen();
                  handleMenuClose();
                }}
              >
                <MuiLink sx={linkStyles}>Sign In</MuiLink>
              </MenuItem>
            </Menu>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThemeModeToggle
                currentTheme={currentTheme}
                onThemeToggle={onThemeToggle}
              />
            </Box>
          </Stack>
        ) : (
          <Stack direction='row' gap='5px'>
            <MuiLink component={NavLink} to='/recipes' sx={linkStyles}>
              Recipes
            </MuiLink>
            <MuiLink component={NavLink} to='/experts' sx={linkStyles}>
              Experts
            </MuiLink>
            <MuiLink component={NavLink} to='/premium' sx={linkStyles}>
              Premium
            </MuiLink>
          </Stack>
        )}

        {!isMobile && (
          <Stack direction='row' gap='10px' alignItems='center'>
            <Button variant='contained' onClick={handleModalOpen}>
              Sign In
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ThemeModeToggle
                currentTheme={currentTheme}
                onThemeToggle={onThemeToggle}
              />
            </Box>
          </Stack>
        )}
      </Box>
      <LoginModal isOpen={isOpen} handleClose={handleModalClose} />
    </header>
  );
}
