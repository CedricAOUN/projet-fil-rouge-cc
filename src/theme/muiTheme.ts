import { alpha, createTheme, type PaletteMode } from '@mui/material/styles';

// Edit these named colors to customize the entire site. Check foreground/background
// contrast after changing either display mode.
export const themeColors = {
  light: {
    primary: '#B44D35', secondary: '#28594A', background: '#FAF7F2',
    surface: '#FFFFFF', text: '#29241F', muted: '#70665C', premium: '#956515',
    onPrimary: '#FFFFFF', onSecondary: '#FFFFFF', onPremium: '#FFFFFF',
    error: '#BA3039', success: '#287048', warning: '#926116', info: '#316A94',
  },
  dark: {
    primary: '#F09B82', secondary: '#9CCBB6', background: '#1C1917',
    surface: '#292421', text: '#F5EEE6', muted: '#BEB2A6', premium: '#E3B963',
    onPrimary: '#1C1917', onSecondary: '#1C1917', onPremium: '#1C1917',
    error: '#FF9AA2', success: '#91D2A7', warning: '#EFC478', info: '#9DC9EB',
  },
};

export default function getTheme(mode: PaletteMode) {
  const colors = themeColors[mode];
  return createTheme({
    spacing: 8,
    shape: { borderRadius: 16 },
    palette: {
      mode,
      primary: { main: colors.primary, contrastText: colors.onPrimary },
      secondary: { main: colors.secondary, contrastText: colors.onSecondary },
      premium: { main: colors.premium, contrastText: colors.onPremium },
      background: { default: colors.background, paper: colors.surface },
      text: { primary: colors.text, secondary: colors.muted, disabled: alpha(colors.text, 0.45) },
      divider: alpha(colors.text, 0.14),
      action: {
        hover: alpha(colors.secondary, 0.06), selected: alpha(colors.secondary, 0.12),
        disabled: alpha(colors.text, 0.38), disabledBackground: alpha(colors.text, 0.1),
      },
      error: { main: colors.error }, success: { main: colors.success },
      warning: { main: colors.warning }, info: { main: colors.info },
    },
    typography: {
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      h1: { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', fontWeight: 500, lineHeight: 1.12, letterSpacing: '-0.035em' },
      h2: { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.85rem, 3vw, 2.65rem)', fontWeight: 500, lineHeight: 1.2, letterSpacing: '-0.025em' },
      h3: { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 'clamp(1.65rem, 2.5vw, 2.25rem)', fontWeight: 500, lineHeight: 1.25 },
      h4: { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.65rem', fontWeight: 500, lineHeight: 1.3 },
      h5: { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.35rem', fontWeight: 500 },
      h6: { fontSize: '1rem', fontWeight: 650 },
      body1: { lineHeight: 1.75 }, body2: { lineHeight: 1.65 },
      button: { textTransform: 'none', fontWeight: 650, letterSpacing: 0 },
      overline: { fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', lineHeight: 1.8 },
    },
    components: {
      MuiCssBaseline: { styleOverrides: {
        body: { transition: 'background-color 180ms ease, color 180ms ease' },
        'h1, h2, h3, h4, h5, h6, p': { overflowWrap: 'anywhere' },
        'img, video': { maxWidth: '100%' },
        'a, button, input, textarea, select, [tabindex]': { '&:focus-visible': { outline: `3px solid ${colors.secondary}`, outlineOffset: 3 } },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': { animation: 'none !important', transition: 'none !important', scrollBehavior: 'auto !important' },
        },
      } },
      MuiContainer: { styleOverrides: { maxWidthLg: { '@media (min-width: 1200px)': { maxWidth: 1200 } } } },
      MuiAppBar: { styleOverrides: { root: {
        backgroundImage: 'none', backgroundColor: alpha(colors.background, 0.96),
        color: colors.text, boxShadow: 'none', borderBottom: `1px solid ${alpha(colors.text, 0.14)}`,
        backdropFilter: 'blur(12px)',
      } } },
      MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: {
        backgroundImage: 'none', border: `1px solid ${alpha(colors.text, 0.14)}`,
      } } },
      MuiCard: { styleOverrides: { root: { borderRadius: 16 } } },
      MuiCardContent: { styleOverrides: { root: { padding: 24, '&:last-child': { paddingBottom: 24 } } } },
      MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: {
        borderRadius: 10, minHeight: 42, padding: '10px 18px', lineHeight: 1.4,
        transition: 'background-color 180ms ease, border-color 180ms ease',
      }, sizeSmall: { minHeight: 36, padding: '8px 12px' } } },
      MuiIconButton: { styleOverrides: { root: { minWidth: 40, minHeight: 40 } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10, backgroundColor: colors.surface } } },
      MuiLink: { defaultProps: { underline: 'hover' }, styleOverrides: { root: { textUnderlineOffset: '4px' } } },
      MuiChip: { styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } } },
      MuiToggleButton: { styleOverrides: { root: {
        textTransform: 'none', borderRadius: 10, lineHeight: 1.4,
        '&.Mui-selected': { color: colors.secondary, backgroundColor: alpha(colors.secondary, 0.1), '&:hover': { backgroundColor: alpha(colors.secondary, 0.16) } },
      } } },
      MuiMenu: { styleOverrides: { paper: { padding: 4, marginTop: 8, borderRadius: 12 } } },
      MuiAutocomplete: { styleOverrides: { paper: { borderRadius: 12 } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
      MuiDialogTitle: { styleOverrides: { root: { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.65rem' } } },
      MuiDialogActions: { styleOverrides: { root: { padding: '16px 24px', flexWrap: 'wrap', gap: 8 } } },
      MuiAlert: { styleOverrides: { root: { borderRadius: 10 } } },
    },
  });
}
