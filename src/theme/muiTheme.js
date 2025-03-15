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
      MuiInput: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.09)',
            border: '1px solid #333',
            transition: 'all 0.3s ease-in-out',
            padding: '12px 16px',
            fontSize: '16px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.13)',
            },
            '&:before': {
              borderBottom: 'none',
            },
            '&:after': {
              borderBottom: 'none',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.3)',
            },
            '&.Mui-error': {
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              boxShadow: '0 0 0 2px rgba(211, 47, 47, 0.3)',
            },
          },
          input: {
            padding: '0',
            height: '1.4em',
            '&::placeholder': {
              opacity: 0.7,
              fontStyle: 'italic',
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