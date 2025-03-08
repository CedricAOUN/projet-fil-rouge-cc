import { Box, Button, IconButton, Menu, MenuItem, Link as MuiLink } from "@mui/material";
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
    cursor: 'pointer',
    fontFamily: 'sans-serif',
    color: 'white',
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
              <MenuItem onClick={handleMenuClose}>Sign In</MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <MuiLink href='/recipes' sx={linkStyles} underline="none">Recipes</MuiLink>
            <MuiLink href='/experts' sx={linkStyles} underline="none">Experts</MuiLink>
            <MuiLink href='/premium' sx={linkStyles} underline="none">Premium</MuiLink>
          </Box>
        )}
        {!isMobile && <Button variant="contained">Sign In</Button>}
      </Box>
    </header>
  );
}