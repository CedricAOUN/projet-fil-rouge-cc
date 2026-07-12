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
import SingleUserPage from '@/pages/SingleUserPage/SingleUserPage';
import NotFound from '@/pages/NotFound/NotFound';
import SingleCoursePage from './pages/SingleCoursePage/SingleCoursePage';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleThemeMode, setThemeMode } from '@/store/slices/appSlice';
import { useGetCurrentUserQuery } from './api/authApi';
import AdvancedRecipeSearch from './components/AdvancedRecipeSearch/AdvancedRecipeSearch';
import BillingFailure from './pages/BillingFailure/BillingFailure';
import BillingSuccess from './pages/BillingSuccess/BillingSuccess';

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useMediaQuery('(max-width: 900px)');

  const token = localStorage.getItem('token');
  useGetCurrentUserQuery(undefined, { skip: !token });

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

  const theme = useMemo(
    () => getTheme(themeMode ? 'dark' : 'light'),
    [themeMode],
  );
  const toggleMode = () => dispatch(toggleThemeMode());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header
        currentTheme={themeMode ? 'dark' : 'light'}
        onThemeToggle={toggleMode}
      />
      <main style={{ height: 'calc(100vh - 120px)' }}>
        <Box
          sx={{
            margin: isMobile ? '15px' : isHomePage ? '' : '15px 15%',
            height: '100%',
          }}
        >
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/recipes' element={<AdvancedRecipeSearch />} />
            <Route path='/recipe/:id' element={<SingleRecipePage />} />
            <Route path='/recipe/create' element={<RecipeCreateForm />} />
            <Route path='/chefs' element={<></>} />
            <Route path='/user/:id' element={<SingleUserPage />} />
            <Route path='/premium' element={<PremiumPage />} />
            <Route path='/course/:id' element={<SingleCoursePage />} />
            <Route path='/course/create' element={<></>} />
            <Route path='*' element={<NotFound />} />
            <Route path='/not-found' element={<NotFound />} />
            <Route path='/billing/success' element={<BillingSuccess />} />
            <Route path='/billing/cancel' element={<BillingFailure />} />
          </Routes>
        </Box>
      </main>
    </ThemeProvider>
  );
}

export default App;
