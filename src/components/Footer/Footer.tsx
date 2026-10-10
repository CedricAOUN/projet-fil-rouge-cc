import { Box, Container, Link as MuiLink, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setLanguagePreference } from '@/i18n';


export default function Footer({ onManageCookies }: { onManageCookies: () => void }) {
  const { t, i18n } = useTranslation();
  const legalLinks = [
    { label: t('Privacy'), to: '/confidentialite' },
    { label: t('Terms of Use'), to: '/conditions-utilisation' },
    { label: t('Terms of Sale'), to: '/conditions-vente' },
    { label: t('Legal notice'), to: '/mentions-legales' },
  ];
  return (
    <Box
      component='footer'
      sx={{
        mt: 'auto',
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent='space-between'
          gap={1.5}
        >
          <Typography variant='body2' color='text.secondary'>
            {t('© {{year}} MealMosaic — student project', { year: new Date().getFullYear() })}
          </Typography>
          <Stack
            component='nav'
            aria-label={t('Legal links')}
            direction={{ xs: 'column', sm: 'row' }}
            gap={{ xs: 1, sm: 2 }}
            sx={{ flexWrap: 'wrap', alignItems: { xs: 'flex-start', sm: 'center' } }}
          >
            <MuiLink id='manage-cookies' component='button' type='button' onClick={onManageCookies} variant='body2' sx={{ textAlign: 'left', cursor: 'pointer' }}>
              {t('Manage cookies')}
            </MuiLink>
            {legalLinks.map((link) => (
              <MuiLink key={link.to} component={NavLink} to={link.to} variant='body2'>
                {link.label}
              </MuiLink>
            ))}
            <ToggleButtonGroup
              exclusive
              size='small'
              value={i18n.resolvedLanguage ?? 'en'}
              aria-label={t('Language')}
              onChange={(_, language: 'en' | 'fr' | null) => {
                // Clicking the selected option also makes the choice explicit.
                void setLanguagePreference(language ?? (i18n.resolvedLanguage === 'fr' ? 'fr' : 'en'));
              }}
            >
              <ToggleButton value='en' aria-label={t('English')} title={t('English')}>
                <svg aria-hidden='true' width='28' height='20' viewBox='0 0 60 40' focusable='false'>
                  <rect width='60' height='40' fill='#012169' />
                  <path d='M0 0L60 40M60 0L0 40' stroke='white' strokeWidth='8' />
                  <path d='M0 0L60 40M60 0L0 40' stroke='#C8102E' strokeWidth='3' />
                  <path d='M30 0V40M0 20H60' stroke='white' strokeWidth='14' />
                  <path d='M30 0V40M0 20H60' stroke='#C8102E' strokeWidth='8' />
                </svg>
              </ToggleButton>
              <ToggleButton value='fr' aria-label={t('French')} title={t('French')}>
                <svg aria-hidden='true' width='28' height='20' viewBox='0 0 60 40' focusable='false'>
                  <rect width='20' height='40' fill='#002395' />
                  <rect x='20' width='20' height='40' fill='white' />
                  <rect x='40' width='20' height='40' fill='#ED2939' />
                </svg>
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
