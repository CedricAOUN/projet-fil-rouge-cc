import { Box, Button, Link, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { useMediaQuery } from '@mui/material';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const linkStyles = {
    mx: '5px',
    textDecoration: 'none',
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    color: 'white',
    fontSize: '18px'
  };

  return (
    <header>
      <Box sx={{ backgroundColor: '#C18148', padding: '20px 15%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link sx={{ ...linkStyles, fontSize: '30px', width: '100px', display: 'block' }}>MealMosaic</Link>
        {isMobile ? (
          <>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <MenuIcon sx={{ color: '#fff' }} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>Recipes</MenuItem>
              <MenuItem onClick={handleMenuClose}>Experts</MenuItem>
              <MenuItem onClick={handleMenuClose}>Premium</MenuItem>
              <MenuItem onClick={handleMenuClose}>Sign In</MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <Link sx={linkStyles}>Recipes</Link>
            <Link sx={linkStyles}>Experts</Link>
            <Link sx={linkStyles}>Premium</Link>
          </Box>
        )}
        {!isMobile && <Button variant="contained">Sign In</Button>}
      </Box>
    </header>
  );
}
