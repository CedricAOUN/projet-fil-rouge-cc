import { useEffect, useRef, useState } from 'react';
import { Box, Button, Link, Paper, Stack, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { setAnalyticsConsent, trackPageView } from '@/analytics';
import { CONSENT_KEY, consentExpiresAt, readConsent, saveConsent } from '@/consent';

export default function ConsentBanner({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [consent, setConsent] = useState(readConsent);
  const location = useLocation();
  const acceptRef = useRef<HTMLButtonElement>(null);
  const lastPage = useRef<string | null>(null);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) setConsent(readConsent());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  useEffect(() => {
    if (!consent) return;
    let timeout: number;
    const expire = () => {
      const remaining = consentExpiresAt(consent) - Date.now();
      window.clearTimeout(timeout);
      if (remaining <= 0) {
        setAnalyticsConsent(false);
        setConsent(null);
      } else {
        // Browser timeouts cannot exceed a signed 32-bit integer.
        timeout = window.setTimeout(expire, Math.min(remaining, 2_147_483_647));
      }
    };
    expire();
    window.addEventListener('focus', expire);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('focus', expire);
    };
  }, [consent]);

  useEffect(() => {
    setAnalyticsConsent(consent?.accepted === true);
    if (!consent?.accepted) lastPage.current = null;
  }, [consent]);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (consent?.accepted && lastPage.current !== path) {
      trackPageView(path);
      lastPage.current = path;
    }
  }, [consent, location.pathname, location.search]);

  useEffect(() => {
    if (open) acceptRef.current?.focus();
  }, [open]);

  const choose = (accepted: boolean) => {
    setAnalyticsConsent(accepted);
    setConsent(saveConsent(accepted));
    onClose();
    if (open) document.getElementById('manage-cookies')?.focus();
  };

  if (consent && !open) return null;

  return (
    <Paper component='section' role='region' aria-labelledby='consent-title' elevation={8}
      sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: (theme) => theme.zIndex.drawer + 1,
        p: { xs: 2, sm: 3 }, borderTop: 1, borderColor: 'divider', maxHeight: '80dvh', overflowY: 'auto' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} gap={2} alignItems={{ xs: 'stretch', md: 'center' }} sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Box sx={{ flex: 1 }}>
          <Typography id='consent-title' variant='h6' component='h2'>Votre choix concernant les cookies</Typography>
          <Typography variant='body2' sx={{ mt: 0.5 }}>
            Avec votre accord, MealMosaic utilise Google Analytics pour mesurer la fréquentation du site.
            Vous pouvez refuser et continuer à naviguer, puis modifier votre choix dans le pied de page.
            La connexion et votre préférence de thème restent disponibles.
          </Typography>
          <Link component={RouterLink} to='/confidentialite' variant='body2'>Politique de confidentialité</Link>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} gap={1}>
          <Button ref={acceptRef} variant='outlined' onClick={() => choose(true)}>Accepter</Button>
          <Button variant='outlined' onClick={() => choose(false)}>Refuser</Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
