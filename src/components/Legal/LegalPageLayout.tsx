import { Alert, Box, Container, Divider, Link, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageLayoutProps = {
  title: string;
  description: string;
  sections: LegalSection[];
};

export default function LegalPageLayout({
  title,
  description,
  sections,
}: LegalPageLayoutProps) {
  return (
    <Container maxWidth='md' sx={{ py: { xs: 2, md: 4 } }}>
      <Paper component='article' sx={{ p: { xs: 2.5, sm: 4, md: 6 } }}>
        <Stack spacing={3}>
          <Box component='header'>
            <Typography component='h1' variant='h1' gutterBottom>
              {title}
            </Typography>
            <Typography color='text.secondary'>{description}</Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
              Dernière mise à jour : [À COMPLÉTER — JJ/MM/AAAA]
            </Typography>
          </Box>

          <Alert severity='warning'>
            <strong>Projet étudiant — document de travail.</strong> Les mentions
            « [À COMPLÉTER] » doivent être renseignées et le document validé par
            un professionnel avant toute mise en production ou vente réelle.
          </Alert>

          <Box component='nav' aria-label={`Sommaire — ${title}`}>
            <Typography component='h2' variant='h6' gutterBottom>
              Sommaire
            </Typography>
            <Box component='ol' sx={{ m: 0, pl: 3 }}>
              {sections.map((section) => (
                <li key={section.id}>
                  <Link href={`#${section.id}`}>{section.title}</Link>
                </li>
              ))}
            </Box>
          </Box>

          <Divider />

          {sections.map((section) => (
            <Box component='section' key={section.id} aria-labelledby={section.id}>
              <Typography
                component='h2'
                variant='h5'
                id={section.id}
                gutterBottom
                sx={{ scrollMarginTop: 96 }}
              >
                {section.title}
              </Typography>
              <Stack spacing={1.5}>{section.content}</Stack>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}
