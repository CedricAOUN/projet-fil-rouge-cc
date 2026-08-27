import PremiumCard from '@/components/PremiumCard/PremiumCard';
import RecipeSearch from '@/components/RecipeComponents/RecipeSearch/RecipeSearch';
import { setSearchQuery, useAppDispatch, useAppSelector } from '@/store';
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useRef, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

function HomeSection({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <Box component='section'>
      <Stack spacing={0.75} mb={2.5}>
        <Typography
          variant='overline'
          color='secondary.main'
          fontWeight={800}
          letterSpacing='0.12em'
        >
          {eyebrow}
        </Typography>
        <Typography
          variant='h2'
          sx={{ fontSize: { xs: '1.65rem', md: '2rem' } }}
        >
          {title}
        </Typography>
        {description && (
          <Typography color='text.secondary' maxWidth='62ch'>
            {description}
          </Typography>
        )}
      </Stack>
      {children}
    </Box>
  );
}

function CulinaryDecorations() {
  const decorationStyles = {
    position: 'absolute',
    pointerEvents: 'none',
    color: 'primary.main',
    transition: 'transform 80ms linear',
    '@media (prefers-reduced-motion: reduce)': {
      transform: 'none',
      transition: 'none',
    },
  } as const;

  return (
    <Box
      aria-hidden='true'
      sx={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <Box
        component='svg'
        viewBox='0 0 90 210'
        sx={{
          ...decorationStyles,
          width: { xs: 54, md: 72 },
          left: { xs: -18, md: '3%' },
          top: { xs: '47%', md: '25%' },
          opacity: 0.42,
          transform:
            'translate3d(0, var(--parallax-slow, 0px), 0) rotate(-16deg)',
        }}
      >
        <g
          fill='none'
          stroke='currentColor'
          strokeWidth='4'
          strokeLinecap='round'
        >
          <path d='M45 84v110' />
          <path d='M32 84C6 57 13 11 45 11s39 46 13 73' />
          <path d='M31 22c18 17 20 37 14 62M59 22C41 39 39 59 45 84' />
          <path d='M36 195h18' />
        </g>
      </Box>

      <Box
        component='svg'
        viewBox='0 0 150 150'
        sx={{
          ...decorationStyles,
          width: { xs: 78, md: 118 },
          right: { xs: -28, md: '4%' },
          top: { xs: '8%', md: '12%' },
          color: 'secondary.main',
          opacity: 0.3,
          transform:
            'translate3d(0, var(--parallax-fast, 0px), 0) rotate(12deg)',
        }}
      >
        <circle
          cx='75'
          cy='75'
          r='60'
          fill='none'
          stroke='currentColor'
          strokeWidth='5'
        />
        <circle
          cx='75'
          cy='75'
          r='11'
          fill='none'
          stroke='currentColor'
          strokeWidth='4'
        />
        <g stroke='currentColor' strokeWidth='4'>
          <path d='M75 15v49M75 86v49M15 75h49M86 75h49' />
          <path d='m33 33 34 34M83 83l34 34M117 33 83 67M67 83l-34 34' />
        </g>
      </Box>

      <Box
        component='svg'
        viewBox='0 0 160 230'
        sx={{
          ...decorationStyles,
          display: { xs: 'none', sm: 'block' },
          width: { sm: 95, lg: 124 },
          right: { sm: '1%', lg: '9%' },
          bottom: { sm: 44, lg: 38 },
          color: 'text.primary',
          opacity: 0.15,
          transform: 'translate3d(0, var(--parallax-mid, 0px), 0) rotate(9deg)',
        }}
      >
        <g
          fill='none'
          stroke='currentColor'
          strokeWidth='4'
          strokeLinecap='round'
        >
          <path d='M81 218c-5-52-3-102 0-154' />
          <path d='M80 171c-32-6-49-25-53-51 27-1 48 12 54 35' />
          <path d='M81 136c27-9 43-28 45-52-25 1-42 13-46 36' />
          <path d='M80 102C52 94 38 75 37 51c24 2 40 14 44 35' />
          <path d='M81 72c21-10 31-27 29-48-21 4-33 16-31 36' />
        </g>
      </Box>
    </Box>
  );
}

function RecipeBoard() {
  const steps = [
    ['01', 'Pick a craving'],
    ['02', 'Find your recipe'],
    ['03', 'Make it your own'],
  ];

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        position: 'relative',
        width: 'min(100%, 430px)',
        mx: 'auto',
        p: { xs: 3, sm: 4 },
        borderRadius: '10px 10px 24px 10px',
        border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
        background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.98)}, ${alpha(theme.palette.background.default, 0.94)})`,
        boxShadow: `18px 22px 0 ${alpha(theme.palette.primary.main, 0.16)}, 0 24px 70px ${alpha(theme.palette.common.black, 0.13)}`,
        transform: { md: 'rotate(1.5deg)' },
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 92,
          height: 25,
          top: -13,
          left: '50%',
          transform: 'translateX(-50%) rotate(-2deg)',
          bgcolor: alpha(theme.palette.primary.light, 0.38),
          borderLeft: `1px solid ${alpha(theme.palette.primary.dark, 0.16)}`,
          borderRight: `1px solid ${alpha(theme.palette.primary.dark, 0.16)}`,
        },
      })}
    >
      <Typography
        variant='overline'
        color='text.secondary'
        letterSpacing='0.14em'
      >
        Today&apos;s kitchen note
      </Typography>
      <Typography variant='h4' fontWeight={800} mt={0.5} mb={3}>
        Good food starts with a little curiosity.
      </Typography>
      <Stack divider={<Box sx={{ borderTop: 1, borderColor: 'divider' }} />}>
        {steps.map(([number, label]) => (
          <Stack
            key={number}
            direction='row'
            alignItems='center'
            gap={2}
            py={1.5}
          >
            <Typography
              color='secondary.main'
              fontWeight={900}
              fontSize='0.78rem'
            >
              {number}
            </Typography>
            <Typography fontWeight={650}>{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

function CoursesCard() {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        height: '100%',
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
        background: `radial-gradient(circle at 92% 8%, ${alpha(theme.palette.primary.main, 0.2)}, transparent 34%), ${theme.palette.background.paper}`,
      })}
    >
      <Stack height='100%' alignItems='flex-start' spacing={2}>
        <Box
          sx={{
            display: 'grid',
            placeItems: 'center',
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <MenuBookRoundedIcon />
        </Box>
        <Box flex={1}>
          <Typography variant='h4' fontWeight={800} gutterBottom>
            Learn from passionate chefs
          </Typography>
          <Typography color='text.secondary'>
            Explore practical courses, discover new techniques, and bring more
            confidence to your kitchen.
          </Typography>
        </Box>
        <Button
          component={NavLink}
          to='/courses'
          variant='contained'
          size='large'
        >
          Explore courses
        </Button>
      </Stack>
    </Paper>
  );
}

function Home() {
  const dispatch = useAppDispatch();
  const heroRef = useRef<HTMLElement>(null);
  const headerSearchRef = useRef<HTMLInputElement>(null);
  const searchQuery = useAppSelector((state) => state.recipes.searchQuery);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let isVisible = true;
    let frameId: number | null = null;

    const updateParallax = () => {
      frameId = null;
      if (!isVisible || reducedMotion.matches) return;

      const progress = Math.max(
        0,
        Math.min(1, -hero.getBoundingClientRect().top / hero.offsetHeight),
      );
      hero.style.setProperty('--parallax-slow', `${progress * 12}px`);
      hero.style.setProperty('--parallax-mid', `${progress * 22}px`);
      hero.style.setProperty('--parallax-fast', `${progress * 32}px`);
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateParallax);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) scheduleUpdate();
    });

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        hero.style.removeProperty('--parallax-slow');
        hero.style.removeProperty('--parallax-mid');
        hero.style.removeProperty('--parallax-fast');
      } else {
        scheduleUpdate();
      }
    };

    observer.observe(hero);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    reducedMotion.addEventListener('change', handleMotionPreference);
    scheduleUpdate();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      reducedMotion.removeEventListener('change', handleMotionPreference);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: 'background.default' }}>
      <Box
        ref={heroRef}
        component='section'
        sx={(theme) => ({
          position: 'relative',
          isolation: 'isolate',
          minHeight: 'clamp(560px, 76svh, 760px)',
          display: 'flex',
          alignItems: 'center',
          pb: { xs: 12, md: 15 },
          background: `
            radial-gradient(circle at 16% 18%, ${alpha(theme.palette.primary.main, 0.2)}, transparent 27%),
            radial-gradient(circle at 84% 70%, ${alpha(theme.palette.secondary.main, 0.12)}, transparent 25%),
            linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.07)} 100%)
          `,
        })}
      >
        <CulinaryDecorations />
        <Container
          maxWidth='lg'
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'minmax(0, 1.05fr) minmax(360px, 0.95fr)',
            },
            alignItems: 'center',
            gap: { xs: 7, md: 8, lg: 12 },
            py: { xs: 8, md: 10 },
          }}
        >
          <Stack alignItems='flex-start' spacing={2.5}>
            <Typography
              variant='overline'
              color='secondary.main'
              fontWeight={900}
              letterSpacing='0.15em'
            >
              Your kitchen, your mosaic
            </Typography>
            <Typography
              component='h1'
              sx={{
                fontSize: 'clamp(2.6rem, 7vw, 5.35rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.055em',
                fontWeight: 900,
                maxWidth: '10ch',
              }}
            >
              Find something worth cooking.
            </Typography>
            <Typography
              color='text.secondary'
              fontSize={{ xs: '1rem', md: '1.15rem' }}
              maxWidth='52ch'
            >
              Discover recipes for every appetite, learn from cooks who love
              their craft, and make each dish your own.
            </Typography>
            <TextField
              inputRef={headerSearchRef}
              value={searchQuery}
              onChange={(event) => dispatch(setSearchQuery(event.target.value))}
              placeholder='What are you craving?'
              aria-label='Search recipes'
              fullWidth
              sx={(theme) => ({
                maxWidth: 560,
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  minHeight: 58,
                  borderRadius: 99,
                  bgcolor: alpha(theme.palette.background.paper, 0.94),
                  boxShadow: `0 14px 40px ${alpha(theme.palette.common.black, 0.1)}`,
                  '& fieldset': {
                    borderColor: alpha(theme.palette.text.primary, 0.14),
                  },
                },
              })}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchRoundedIcon color='secondary' />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>
          <RecipeBoard />
        </Container>

        <Box
          aria-hidden='true'
          sx={(theme) => ({
            position: 'absolute',
            zIndex: 2,
            left: 0,
            right: 0,
            bottom: 0,
            height: { xs: 64, md: 82 },
            borderTop: `1px solid ${alpha(theme.palette.common.white, 0.65)}`,
            borderBottom: `8px solid ${alpha(theme.palette.common.black, 0.2)}`,
            background: `linear-gradient(180deg, ${alpha(theme.palette.primary.light, 0.78)} 0%, ${theme.palette.primary.main} 12%, ${theme.palette.primary.dark} 100%)`,
            boxShadow: `0 -12px 35px ${alpha(theme.palette.common.black, 0.09)}, 0 18px 35px ${alpha(theme.palette.common.black, 0.24)}`,
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: '7px 0 auto',
              height: 1,
              bgcolor: alpha(theme.palette.common.white, 0.25),
            },
          })}
        />
      </Box>

      <Box
        sx={(theme) => ({
          position: 'relative',
          background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.055)}, transparent 320px)`,
          pb: { xs: 8, md: 12 },
        })}
      >
        <Container
          maxWidth='lg'
          sx={{
            position: 'relative',
            zIndex: 3,
            pt: 5,
          }}
        >
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.text.primary, 0.1)}`,
              boxShadow: `0 24px 60px ${alpha(theme.palette.common.black, 0.12)}`,
            })}
          >
            <HomeSection
              eyebrow={searchQuery ? 'Search results' : 'Fresh inspiration'}
              title={
                searchQuery
                  ? `Recipes for “${searchQuery}”`
                  : 'Discover your next favorite dish'
              }
              description='Browse the latest recipes from the MealMosaic community.'
            >
              <RecipeSearch
                showSearch={Boolean(searchQuery)}
                headerSearchRef={headerSearchRef}
                maxHeight='440px'
              />
            </HomeSection>
          </Paper>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(2, minmax(0, 1fr))',
              },
              gap: 3,
              mt: { xs: 5, md: 7 },
            }}
          >
            <CoursesCard />
            <PremiumCard />
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
