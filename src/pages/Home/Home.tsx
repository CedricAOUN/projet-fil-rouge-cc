import PremiumCard from '@/components/PremiumCard/PremiumCard';
import RecipeSearch from '@/components/RecipeComponents/RecipeSearch/RecipeSearch';
import { setSearchQuery, useAppSelector } from '@/store';
import { Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

const PARALLAX_SPEED = 0.1;
const COUNTER_HEIGHT_VH = 0.22;

function Home() {
  const dispatch = useDispatch();
  const [scrollY, setScrollY] = useState(0);
  const [vpHeight, setVpHeight] = useState(window.innerHeight);
  const headerSearchRef = useRef(null);

  const isDarkMode = useAppSelector((state) => state.app.themeMode);
  const searchQuery = useAppSelector((state) => state.recipes.searchQuery);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setVpHeight(window.innerHeight);

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const counterHeightPx = vpHeight * COUNTER_HEIGHT_VH;
  const overlayTranslate = Math.min(scrollY * PARALLAX_SPEED, vpHeight);

  return (
    <div style={{ position: 'relative' }}>

      {/* ── Hero section: explicit 100vh height so absolute children anchor here ── */}
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

        {/* Background kitchen image — fills the hero */}
        <img
          src='/kitchen.png'
          alt='Kitchen'
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '90%',
            objectFit: 'cover',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Search card — centred in the hero */}
        {!searchQuery && (
          <Stack
            sx={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90vw', sm: '60vw', md: '40vw' },
              p: 2,
              borderRadius: 2,
              pointerEvents: 'auto',
              zIndex: 500,
            }}
            spacing={2}
            bgcolor={(theme) => theme.palette.background.paper}
          >
            <Typography variant='h5' marginBottom={2}>
              Find a recipe
            </Typography>
            <TextField
              inputRef={headerSearchRef}
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              placeholder='What are you looking for?'
            />
          </Stack>
        )}

        {/* Counter — anchored to the bottom of the hero, parallax via translateY */}
        <img
          src='/counter.png'
          alt='Counter'
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: `${counterHeightPx}px`,
            objectFit: 'cover',
            zIndex: 200,
            transform: `translateY(-${overlayTranslate}px)`,
            transition: 'transform 0.05s linear',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── Main content — naturally below the hero ── */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          padding: 32,
          background: `url(/background${isDarkMode ? '-dark' : ''}.jpg)`,
          backgroundSize: 'contain',
          backgroundRepeat: 'repeat',
          minHeight: '100vh',
        }}
      >
        <Stack
          sx={{
            pt: { xs: 4, sm: 6, md: 8 },
            zIndex: 500,
            mx: { xs: 2, sm: 5, md: 10 },
            pointerEvents: 'auto',
            position: 'relative',
          }}
          spacing={2}
        >
          <RecipeSearch
            showSearch={Boolean(searchQuery)}
            headerSearchRef={headerSearchRef}
          />
          <PremiumCard />
        </Stack>
      </div>
    </div>
  );
}

export default Home;