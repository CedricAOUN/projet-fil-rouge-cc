import React, { useState, useMemo, useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import SingleRecipePage from './pages/SingleRecipePage/SingleRecipePage';
import RecipeCreateForm from './pages/RecipeCreateForm/RecipeCreateForm';
import PremiumCard from './components/PremiumCard/PremiumCard';
import { CssBaseline, ThemeProvider } from '@mui/material';
import getTheme from './theme/muiTheme';
import PremiumPage from './pages/PremiumPage/PremiumPage';

function App() {
  // Get stored preference or fall back to system preference
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('theme-mode');
    if (savedMode) {
      return savedMode;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const [mode, setMode] = useState(getInitialMode);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  // Listen for changes to the system preference (only if user hasn't explicitly set a preference)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Only update if there's no saved preference
      if (!localStorage.getItem('theme-mode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Generate the theme based on the current mode
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Toggle between light and dark themes
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header currentTheme={mode} onThemeToggle={toggleMode} />
      <main>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<PremiumCard />} />
            <Route path='/recipes' element={<></>} />
            <Route path='/recipe/:id' element={<SingleRecipePage />} />
            <Route path='/recipe/create' element={<RecipeCreateForm />} />
            <Route path='/experts' element={<></>} />
            <Route path='/experts/:id' element={<></>} />
            <Route path='/premium' element={<PremiumPage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </ThemeProvider>
  );
}

export default App;
