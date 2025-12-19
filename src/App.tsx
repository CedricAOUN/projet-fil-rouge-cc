import React, { useMemo, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import '@/App.css';
import Header from '@/components/Header/Header';
import SingleRecipePage from '@/pages/SingleRecipePage/SingleRecipePage';
import RecipeCreateForm from '@/pages/RecipeCreateForm/RecipeCreateForm';
import { Box, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import getTheme from '@/theme/muiTheme';
import PremiumPage from '@/pages/PremiumPage/PremiumPage';
import Home from '@/pages/Home/Home';
import SingleExpertPage from '@/pages/SingleExpertPage/SingleExpertPage';
import NotFound from '@/pages/NotFound/NotFound';
import SingleCoursePage from './pages/SingleCoursePage/SingleCoursePage';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleThemeMode, setThemeMode } from '@/store/slices/appSlice';
import RecipeSearch from './components/RecipeComponents/RecipeSearch/RecipeSearch';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useMediaQuery('(max-width: 900px)');
  
  const dispatch = useDispatch();
  const themeMode = useSelector((state: RootState) => state.app.themeMode);

  // Save theme preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme-mode', themeMode ? 'dark' : 'light');
  }, [themeMode]);

  // Listen for changes to the system preference (only if user hasn't explicitly set a preference)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme-mode')) {
        dispatch(setThemeMode(e.matches));
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

  const theme = useMemo(() => getTheme(themeMode ? 'dark' : 'light'), [themeMode]);
  const toggleMode = () => dispatch(toggleThemeMode());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header currentTheme={themeMode ? 'dark' : 'light'} onThemeToggle={toggleMode} />
      <main>
        <Box sx={{ margin: isMobile ? '15px' : isHomePage ? '' : '15px 15%' }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/recipes' element={<RecipeSearch maxHeight={'calc(100dvh - 300px)'} />} />
            <Route path='/recipe/:id' element={<SingleRecipePage />} />
            <Route path='/recipe/create' element={<RecipeCreateForm />} />
            <Route path='/experts' element={<></>} />
            <Route path='/expert/:id' element={<SingleExpertPage />} />
            <Route path='/premium' element={<PremiumPage />} />
            <Route path='/course/:id' element={<SingleCoursePage />} />
            <Route path='/course/create' element={<></>} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;
