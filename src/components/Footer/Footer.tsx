import { Box, Container, Link as MuiLink, Stack, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';

const legalLinks = [
  { label: 'Confidentialité', to: '/confidentialite' },
  { label: 'Conditions d’utilisation', to: '/conditions-utilisation' },
  { label: 'Conditions de vente', to: '/conditions-vente' },
  { label: 'Mentions légales', to: '/mentions-legales' },
];

export default function Footer() {
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
            © {new Date().getFullYear()} MealMosaic — projet étudiant
          </Typography>
          <Stack
            component='nav'
            aria-label='Liens légaux'
            direction={{ xs: 'column', sm: 'row' }}
            gap={{ xs: 1, sm: 2 }}
          >
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
