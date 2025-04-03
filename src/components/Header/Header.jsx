import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Link as MuiLink,
  Stack,
  Switch,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useMediaQuery } from '@mui/material';
import LoginModal from '../LoginModal/LoginModal';
import { DarkModeRounded, LightModeRounded } from '@mui/icons-material';
import ThemeModeToggle from './ThemeModeToggle';

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
  };

  return (
    <header>
      <Box
        sx={{
          backgroundColor: currentTheme == 'light' ? '#fff' : '#1f1f1f',
          boxShadow: '0px 8px 14px -3px rgba(0,0,0,0.2)',
          padding: '20px 15%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <MuiLink
          href='/'
          sx={{
            ...linkStyles,
            fontSize: '30px',
            width: '100px',
            display: 'block',
            color: '#FF4E4E',
            textDecoration: 'none', // Ensure no underline by default
            '&:hover': {
              textDecoration: 'none', // Disable the hover underline
              '&::after': {
                width: '0%', // Disable the underline sliding effect
              },
            },
          }}
          underline='none'
        >
          <Box component='span' sx={{ color: '#CEB600', fontWeight: 700 }}>
            Meal
          </Box>
          Mosaic
        </MuiLink>
        {isMobile ? (
          <>
            <IconButton onClick={handleMenuOpen} color='inherit'>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem>
                <MuiLink sx={linkStyles} underline='none' href='/recipes'>
                  Recipes
                </MuiLink>
              </MenuItem>
              <MenuItem>
                <MuiLink sx={linkStyles} underline='none' href='/experts'>
                  Experts
                </MuiLink>
              </MenuItem>
              <MenuItem>
                <MuiLink sx={linkStyles} underline='none' href='/premium'>
                  Premium
                </MuiLink>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleModalOpen();
                  handleMenuClose();
                }}
              >
                <MuiLink sx={linkStyles} underline='none'>
                  Sign In
                </MuiLink>
              </MenuItem>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ThemeModeToggle
                  currentTheme={currentTheme}
                  onThemeToggle={onThemeToggle}
                />
              </Box>
            </Menu>
          </>
        ) : (
          <Stack direction='row' gap='5px'>
            <MuiLink href='/recipes' sx={linkStyles} underline='none'>
              Recipes
            </MuiLink>
            <MuiLink href='/experts' sx={linkStyles} underline='none'>
              Experts
            </MuiLink>
            <MuiLink href='/premium' sx={linkStyles} underline='none'>
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
