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
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
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
          }
        }
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
        secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
      },
    },
    ...commonSettings,
  });
};

export default getTheme;