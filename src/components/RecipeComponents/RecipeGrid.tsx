import { Box } from '@mui/material';
import type { ReactNode } from 'react';

export default function RecipeGrid({ children }: { children: ReactNode }) {
  return <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 1.5, width: '100%', alignItems: 'stretch' }}>{children}</Box>;
}
