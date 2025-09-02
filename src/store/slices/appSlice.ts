import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  themeMode: boolean;
}

// Get initial theme from localStorage or browser preference
const getInitialTheme = (): boolean => {
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode) {
      return savedMode === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false; // Default for SSR
};

const initialState: AppState = {
  themeMode: getInitialTheme(),
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleThemeMode(state) {
      state.themeMode = !state.themeMode;
    },
    setThemeMode(state, action: PayloadAction<boolean>) {
      state.themeMode = action.payload;
    },
  },
});

export const { toggleThemeMode, setThemeMode } = appSlice.actions;
export default appSlice.reducer;
