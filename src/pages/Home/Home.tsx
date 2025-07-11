import { Stack } from '@mui/material';
import RecipeSearch from '@/components/RecipeComponents/RecipeSearch/RecipeSearch';
import PremiumCard from '@/components/PremiumCard/PremiumCard';

function Home() {
  return (
    <Stack gap={2}>
      <RecipeSearch />
      <PremiumCard />
    </Stack>
  );
}

export default Home;
