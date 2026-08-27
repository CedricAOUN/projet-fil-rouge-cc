import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';

function PremiumCard() {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        height: '100%',
        p: { xs: 3, md: 4 },
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.secondary.main, 0.28)}`,
        background: `radial-gradient(circle at 92% 8%, ${alpha(theme.palette.secondary.main, 0.18)}, transparent 34%), ${theme.palette.background.paper}`,
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
            bgcolor: 'secondary.main',
            color: 'secondary.contrastText',
          }}
        >
          <WorkspacePremiumRoundedIcon />
        </Box>
        <Box flex={1}>
          <Typography variant='h4' fontWeight={800} gutterBottom>
            Take your cooking further
          </Typography>
          <Typography color='text.secondary'>
            Unlock premium recipes, share your own creations, and grow from
            home cook to chef.
          </Typography>
        </Box>
        <Button
          component={NavLink}
          to='/premium'
          variant='contained'
          size='large'
        >
          Discover Premium
        </Button>
      </Stack>
    </Paper>
  );
}

export default PremiumCard;
