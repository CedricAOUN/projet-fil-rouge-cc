import { useTranslation } from 'react-i18next';
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Link as MuiLink, Stack, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { alpha } from '@mui/material/styles';
import { lazy, Suspense, useState } from 'react';
import ThemeModeToggle from './ThemeModeToggle';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGetCurrentUserQuery, useLogoutMutation } from '@/api/authApi';
import ProfileDropdown from './ProfileDropdown';

const LoginModal = lazy(() => import('@/components/LoginModal/LoginModal'));

export default function Header({ currentTheme, onThemeToggle }: { currentTheme: 'light' | 'dark'; onThemeToggle: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: currentUser } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();
  const handleLogout = () => {
    logout().unwrap().then(() => window.location.reload()).catch(() => {});
  };
  const links = [{ to: '/recipes', label: t('Recipes') }, { to: '/courses', label: t('Courses') }, { to: '/premium', label: t('Premium') }];
  const linkStyles = {
    px: 2, py: 1, borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem',
    color: 'text.secondary', textDecoration: 'none',
    '&:hover': { bgcolor: 'action.hover', textDecoration: 'none', color: 'text.primary' },
    '&.active': { bgcolor: alpha(theme.palette.secondary.main, 0.1), color: 'secondary.main' },
  };
  return <>
    <AppBar position='sticky' component='header'>
      <Container maxWidth='lg' sx={{ minHeight: { xs: 72, md: 80 }, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
        <MuiLink component={NavLink} to='/' aria-label='MealMosaic' sx={{ color: 'text.primary', fontFamily: 'Georgia, serif', fontSize: { xs: '1.2rem', sm: '1.6rem' }, letterSpacing: '-0.06em', textDecoration: 'none', whiteSpace: 'nowrap', '&:hover': { textDecoration: 'none' } }}>
          Meal<Box component='span' sx={{ color: 'primary.main' }}>Mosaic</Box><Box component='span' sx={{ color: 'secondary.main' }}>.</Box>
        </MuiLink>
        {!isMobile && <Stack component='nav' direction='row' gap={0.5}>
          {links.map(link => <MuiLink key={link.to} component={NavLink} to={link.to} sx={linkStyles}>{link.label}</MuiLink>)}
        </Stack>}
        <Stack direction='row' gap={{ xs: 0.25, sm: 1 }} alignItems='center'>
          {!currentUser && <Button variant='contained' size={isMobile ? 'small' : 'medium'} onClick={() => setIsOpen(true)}>{t('Sign In')}</Button>}
          {currentUser && <ProfileDropdown currentUser={currentUser} isMobile={isMobile} onNavigateToProfile={() => navigate(`/user/${currentUser.id}`)} onLogout={handleLogout} />}
          <ThemeModeToggle currentTheme={currentTheme} onThemeToggle={onThemeToggle} />
          {isMobile && <>
            <IconButton onClick={event => setAnchorEl(event.currentTarget)} color='inherit' aria-label={t('Open menu')} aria-haspopup='menu' aria-expanded={Boolean(anchorEl)}><MenuIcon /></IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              {links.map(link => <MenuItem key={link.to} component={NavLink} to={link.to} onClick={() => setAnchorEl(null)}>{link.label}</MenuItem>)}
            </Menu>
          </>}
        </Stack>
      </Container>
    </AppBar>
    {isOpen && <Suspense fallback={null}><LoginModal isOpen={isOpen} handleClose={() => setIsOpen(false)} /></Suspense>}
  </>;
}
