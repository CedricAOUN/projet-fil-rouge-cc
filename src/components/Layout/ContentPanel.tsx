import { Paper, type PaperProps } from '@mui/material';

/** Padded content surface; menus, cards and image containers keep their own layout. */
export default function ContentPanel({ sx, ...props }: PaperProps) {
  return <Paper {...props} sx={[{ p: { xs: 2.5, sm: 4 }, minWidth: 0 }, ...(Array.isArray(sx) ? sx : [sx])]} />;
}
