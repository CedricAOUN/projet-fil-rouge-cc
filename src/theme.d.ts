import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    premium: { main: string; contrastText: string };
  }
  interface PaletteOptions {
    premium?: { main: string; contrastText: string };
  }
}
