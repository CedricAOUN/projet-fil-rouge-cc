import React, { useMemo, useEffect, useState, lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import '@/App.css';
import Header from '@/components/Header/Header';
import { Box, CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material';
import getTheme from '@/theme/muiTheme';
import Home from '@/pages/Home/Home';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleThemeMode, setThemeMode } from '@/store/slices/appSlice';
import { useGetCurrentUserQuery } from './api/authApi';
import Footer from './components/Footer/Footer';
import ConsentBanner from '@/components/ConsentBanner/ConsentBanner';

const SingleRecipePage = lazy(() => import('@/pages/SingleRecipePage/SingleRecipePage'));
const RecipeCreateForm = lazy(() => import('@/pages/RecipeCreateForm/RecipeCreateForm'));
const PremiumPage = lazy(() => import('@/pages/PremiumPage/PremiumPage'));
const SingleUserPage = lazy(() => import('@/pages/SingleUserPage/SingleUserPage'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'));
const SingleCoursePage = lazy(() => import('./pages/SingleCoursePage/SingleCoursePage'));
const AdvancedRecipeSearch = lazy(() => import('./components/AdvancedRecipeSearch/AdvancedRecipeSearch'));
const BillingFailure = lazy(() => import('./pages/BillingFailure/BillingFailure'));
const BillingSuccess = lazy(() => import('./pages/BillingSuccess/BillingSuccess'));
const Favorites = lazy(() => import('./pages/Favorites/Favorites'));
const MyRecipes = lazy(() => import('./pages/MyRecipes/MyRecipes'));
const CoursesPage = lazy(() => import('./pages/CoursesPage/CoursesPage'));
const CourseCreateForm = lazy(() => import('./pages/CourseCreateForm/CourseCreateForm'));
const PrivacyPolicy = lazy(() => import('./pages/LegalPages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/LegalPages/TermsOfUse'));
const TermsOfSale = lazy(() => import('./pages/LegalPages/TermsOfSale'));
const LegalNotice = lazy(() => import('./pages/LegalPages/LegalNotice'));

function App() {
  const [consentOpen, setConsentOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isMobile = useMediaQuery('(max-width: 900px)');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

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
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header
          currentTheme={themeMode ? 'dark' : 'light'}
          onThemeToggle={toggleMode}
        />
        <Box component='main' sx={{ flex: 1, pb: isHomePage ? 0 : '10px' }}>
          <Box
            sx={{
              margin: isHomePage ? 0 : isMobile ? '15px' : '15px 15%',
              minHeight: isHomePage ? undefined : 'calc(100vh - 190px)',
            }}
          >
            <Suspense fallback={<Box role='status' sx={{ p: 3 }}>Loading page…</Box>}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/recipes' element={<AdvancedRecipeSearch />} />
                <Route path='/recipe/:id' element={<SingleRecipePage />} />
                <Route path='/recipe/create' element={<RecipeCreateForm />} />
                <Route path='/recipe/edit/:id' element={<RecipeCreateForm />} />
                <Route path='/courses' element={<CoursesPage />} />
                <Route path='/user/:id' element={<SingleUserPage />} />
                <Route path='/premium' element={<PremiumPage />} />
                <Route path='/course/:id' element={<SingleCoursePage />} />
                <Route path='/course/edit/:id' element={<CourseCreateForm />} />
                <Route path='/course/create' element={<CourseCreateForm />} />
                <Route path='/billing/success' element={<BillingSuccess />} />
                <Route path='/billing/cancel' element={<BillingFailure />} />
                <Route path='/favorites' element={<Favorites />} />
                <Route path='/my-recipes' element={<MyRecipes />} />
                <Route path='/confidentialite' element={<PrivacyPolicy />} />
                <Route path='/conditions-utilisation' element={<TermsOfUse />} />
                <Route path='/conditions-vente' element={<TermsOfSale />} />
                <Route path='/mentions-legales' element={<LegalNotice />} />
                <Route path='/not-found' element={<NotFound />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Suspense>
          </Box>
        </Box>
        <Footer onManageCookies={() => setConsentOpen(true)} />
        <ConsentBanner open={consentOpen} onClose={() => setConsentOpen(false)} />
      </Box>
    </ThemeProvider>
  );
}

export default App;
