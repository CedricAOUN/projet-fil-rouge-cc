import { Box, Container, Link as MuiLink, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export default function Footer({ onManageCookies }: { onManageCookies: () => void }) {
  const { t } = useTranslation();
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
      <Container maxWidth='lg' sx={{ py: 2.5 }}>
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
          >
            <MuiLink id='manage-cookies' component='button' type='button' onClick={onManageCookies} variant='body2' sx={{ textAlign: 'left', cursor: 'pointer' }}>
              {t('Manage cookies')}
            </MuiLink>
            {legalLinks.map((link) => (
              <MuiLink key={link.to} component={NavLink} to={link.to} variant='body2'>
                {link.label}
              </MuiLink>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
