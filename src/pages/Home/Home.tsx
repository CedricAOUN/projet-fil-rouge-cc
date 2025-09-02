
import PremiumCard from '@/components/PremiumCard/PremiumCard';
import RecipeSearch from '@/components/RecipeComponents/RecipeSearch/RecipeSearch';
import { Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

function Home() {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const PARALLAX_HEIGHT = 600; // px, adjust as needed

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
        }}
      />
      {/* Content below the parallax section */}
      <div style={{ 
        position: 'relative', 
        zIndex: 3, 
        marginTop: `${PARALLAX_HEIGHT}px`, 
        padding: 32, 
        background: 'url(/background.jpg)',
        backgroundSize: 'contain',
        backgroundRepeat: 'repeat',
        minHeight: '100vh',
        height: '100%'
      }}>
        <Stack sx={{ pt: 10, zIndex: 300, mx: 10 }} spacing={2}>
          <RecipeSearch />
          <PremiumCard />
        </Stack>
      </div>
    </div>
  );
}

export default Home;
