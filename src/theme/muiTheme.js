import { createTheme } from '@mui/material/styles';

// Function to generate a theme based on mode
const getTheme = (mode) => {
  // ─── Brand colors – change here to update the entire app ───────────────────
  const primaryColor = '#CEB600';
  const secondaryColor = '#FF4E4E';
  // ───────────────────────────────────────────────────────────────────────────

  // Shared values that don't change between light/dark
  const commonSettings = {
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontSize: '2.5rem', fontWeight: 700 },
      h2: { fontSize: '2rem', fontWeight: 600 },
      button: { textTransform: 'none' },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor:
              mode === 'light'
                ? 'rgba(255,255,255,0.75)'
                : 'rgba(18,18,18,0.75)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: `1px solid ${mode === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.07)'}`,
            boxShadow: 'none',
            color: mode === 'light' ? 'rgba(0,0,0,0.87)' : '#f5f5f5',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: mode === 'light' ? '#000' : '#ffffff', // Change text color based on mode
            position: 'relative', // Ensure the pseudo-element positions correctly
            textDecoration: 'none', // Remove default underline
            '&:hover': {
              color: secondaryColor, // Optional: hover color change
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '0%',
              height: '2px', // Thickness of the underline
              backgroundColor: secondaryColor, // Underline color
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
            background: primaryColor,
            color: '#000',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              background: secondaryColor,
              color: '#ffffff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            },
          },
        },
        variants: [
          {
            props: { variant: 'contained', color: 'primary' },
            style: {
              boxShadow: `0 2px 12px ${primaryColor}66`,
              '&:hover': {
                boxShadow: `0 4px 16px ${primaryColor}88`,
              },
            },
          },
        ],
      },
    },
  };

  // Create theme with mode-specific settings
  return createTheme({
    palette: {
      mode, // 'light' or 'dark'
      primary: {
        main: '#CEB600',
        light: '#CEB600',
        dark: '#FDA34B',
        contrastText: '#f5f5f5',
      },
      secondary: {
        main: '#FF4E4E',
        light: '#FF5D4E',
        dark: '#753232',
        contrastText: '#f5f5f5',
      },
      error: {
        main: '#d32f2f', // or whatever error color you want
        contrastText: '#fff',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#f5f5f5' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : '#f5f5f5',
        secondary:
          mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgb(158, 158, 158)',
      },
    },
    ...commonSettings,
  });
};

export default getTheme;
