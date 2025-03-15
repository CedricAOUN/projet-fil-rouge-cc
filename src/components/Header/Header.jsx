import { Box, Button, IconButton, Menu, MenuItem, Link as MuiLink, Switch } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { useMediaQuery } from '@mui/material';
import LoginModal from "../LoginModal/LoginModal";
import { DarkModeRounded, LightModeRounded } from "@mui/icons-material";

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
    fontSize: '18px'
  };

  return (
    <header>
      <Box sx={{ backgroundColor: '#C18148', padding: '20px 15%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <MuiLink
          href='/'
          sx={{ ...linkStyles, fontSize: '30px', width: '100px', display: 'block' }}
          underline="none"
        >
          MealMosaic
        </MuiLink>
        {isMobile ? (
          <>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <MenuIcon sx={{ color: '#fff' }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem>
                <MuiLink sx={linkStyles} underline="none" href='/recipes'>Recipes</MuiLink>
              </MenuItem>
              <MenuItem>
                <MuiLink sx={linkStyles} underline="none" href='/experts'>Experts</MuiLink>
              </MenuItem>
              <MenuItem>
                <MuiLink sx={linkStyles} underline="none" href='/premium'>Premium</MuiLink>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleModalOpen();
                  handleMenuClose();
              }}>
                Sign In
              </MenuItem>
              <MenuItem onClick={onThemeToggle}>
                {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <MuiLink href='/recipes' sx={linkStyles} underline="none">Recipes</MuiLink>
            <MuiLink href='/experts' sx={linkStyles} underline="none">Experts</MuiLink>
            <MuiLink href='/premium' sx={linkStyles} underline="none">Premium</MuiLink>
          </Box>
        )}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LightModeRounded />
              <Switch 
                checked={currentTheme === 'dark'}
                onChange={onThemeToggle}
                color="default"
              />
              <DarkModeRounded />
            </Box>
            <Button variant="contained" onClick={handleModalOpen}>Sign In</Button>
          </div>
        )}
      </Box>
      <LoginModal isOpen={isOpen} handleClose={handleModalClose} />
    </header>
  );
}