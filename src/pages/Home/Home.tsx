
import PremiumCard from '@/components/PremiumCard/PremiumCard';
import RecipeSearch from '@/components/RecipeComponents/RecipeSearch/RecipeSearch';
import { setSearchQuery, useAppSelector } from '@/store';
import { Stack, TextField, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

function Home() {
  const dispatch = useDispatch();
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const PARALLAX_HEIGHT = 600; // px, adjust as needed
  const isDarkMode = useAppSelector((state) => state.app.themeMode);
  const searchQuery = useAppSelector((state) => state.recipes.searchQuery);
  const headerSearchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Parallax speed factor (0 < factor < 1 for slower movement)
  const PARALLAX_SPEED = 0.1;
  // Clamp overlay image translation
  const overlayTranslate = Math.min(scrollY * PARALLAX_SPEED, PARALLAX_HEIGHT);

  const handleSearch = (event) => {
    dispatch(setSearchQuery(event.target.value)); 
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '200vh', overflow: 'auto' }}>
      {/* Background image */}
      <img
        src='/kitchen.png'
        alt='Kitchen'
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: `${PARALLAX_HEIGHT}px`,
          objectFit: 'contain',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      {/* Search results */}
      { !searchQuery && ( 
        <Stack 
          zIndex={500} 
          sx={{ 
            mx: 10,
            p: 2,
            borderRadius: 2,
            pointerEvents: 'auto', 
            position: 'absolute', 
            top: `${PARALLAX_HEIGHT / 2.5}px`, // Center within the background image height
            left: '46%', 
            transform: 'translate(-50%, -50%)',
            width: '40vw', 
          }} 
          spacing={2}
          bgcolor={(theme) => theme.palette.background.paper}
        >
          <Typography variant='h5' marginBottom={2}>
            Find a recipe
          </Typography>
          <TextField inputRef={headerSearchRef} value={searchQuery} onChange={handleSearch} />
        </Stack>
      )}
      {/* Overlay image */}
      <img
        src='/counter.png'
        alt='Counter'
        style={{
          position: 'absolute',
          top: 270,
          left: 0,
          width: '100vw',
          height: `${PARALLAX_HEIGHT}px`,
          objectFit: 'contain',
          zIndex: 200,
          transform: `translateY(-${overlayTranslate}px)`,
          transition: 'transform 0.1s linear',
          pointerEvents: 'none',
        }}
      />
      {/* Content below the parallax section */}
      <div style={{ 
        position: 'relative', 
        zIndex: 3, 
        marginTop: `${PARALLAX_HEIGHT}px`, 
        padding: 32, 
        background: `url(/background${isDarkMode ? '-dark' : ''}.jpg)`,
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat',
        minHeight: '100vh',
        height: '100%'
      }}>
        <Stack sx={{ pt: 10, zIndex: 500, mx: 10, pointerEvents: 'auto', position: 'relative' }} spacing={2}>
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
