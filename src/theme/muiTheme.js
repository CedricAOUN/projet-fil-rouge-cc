import { createTheme } from '@mui/material/styles';

// Function to generate a theme based on mode
const getTheme = (mode) => {
  // Shared values that don't change between light/dark
  const commonSettings = {
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2.5rem', fontWeight: 700 },
      h2: { fontSize: '2rem', fontWeight: 600 },
      button: { textTransform: 'none' },
    },
    components: {
      MuiLink: {
        styleOverrides: {
          root: {
            color: mode === 'light' ? '#000' : '#ffffff', // Change text color based on mode
            position: 'relative', // Ensure the pseudo-element positions correctly
            textDecoration: 'none', // Remove default underline
            '&:hover': {
              color: '#FF4E4E', // Optional: hover color change
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '0%',
              height: '2px', // Thickness of the underline
              backgroundColor: '#FF4E4E', // Underline color
              transition: 'width 0.3s ease', // Animate the width of the underline
            },
            '&:hover::after': {
              width: '100%', // The underline slides in from the left on hover
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '12px',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            padding: '20px',
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            display: 'flex',
            alignItems: 'center',
            padding: '12px 16px',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '20px',
            background: '#CEB600', // Use a solid color instead of a gradient for transition
            color: '#000', // Set text color to white
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease', // Transition only background-color and box-shadow
            '&:hover': {
              background: '#FF4E4E', // Change background color on hover
              color: '#ffffff', // Ensure text stays white
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: add a subtle shadow on hover
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          outlined: {
            transform: 'translate(14px, 16px) scale(1)', // Start lower inside field
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -10px) scale(0.75)', // Move fully above border
              padding: '0 4px', // Adds spacing around text
              backgroundColor: mode === 'light' ? '#f5f5f5' : '#2A2A2A',
            },
          },
        },
      },
    },
  };

  // Create theme with mode-specific settings
  return createTheme({
    palette: {
      mode, // 'light' or 'dark'
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2',
        contrastText: '#ffffff',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#ffffff',
        secondary:
          mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgb(158, 158, 158)',
      },
    },
    ...commonSettings,
  });
};

export default getTheme;
