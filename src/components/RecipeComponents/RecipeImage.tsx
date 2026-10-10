import { Box } from '@mui/material';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import { useState } from 'react';
import { recipeThumbnail } from '@/utils/recipeImage';

export default function RecipeImage({ image, title, compact = false }: { image?: string; title: string; compact?: boolean }) {
  const [failedImage, setFailedImage] = useState<string>();
  return <Box sx={{ position: 'relative', aspectRatio: compact ? 'auto' : '5 / 4', ...(compact && { width: { xs: 72, sm: 100 }, flexShrink: 0, alignSelf: 'stretch', borderRight: '1px solid', borderColor: 'divider' }), bgcolor: 'action.hover', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
    {image && failedImage !== image ? <Box component='img' src={recipeThumbnail(image, compact ? 200 : 600)} alt={title} loading='lazy' decoding='async' onError={() => setFailedImage(image)} sx={{ ...(compact && { position: 'absolute', inset: 0 }), width: '100%', height: '100%', objectFit: 'cover' }} /> : <RestaurantRoundedIcon aria-hidden='true' sx={{ fontSize: compact ? 32 : 48, color: 'text.secondary' }} />}
  </Box>;
}
