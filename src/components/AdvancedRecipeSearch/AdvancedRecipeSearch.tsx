import { Box, Button, Checkbox, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useMemo } from 'react'
import MultiSelectFilter from './MultiSelectFilter'
import { useGetRecipesQuery } from '@/api/recipeApi';
import RecipeCard from '../RecipeComponents/RecipeCard/RecipeCard';
import RatingSlider from './CustomSlider';
import CustomSlider from './CustomSlider';
import useDebounce from '@/utils/useDebounce'

const AdvancedRecipeSearch = () => {
  const [allIngredients, setAllIngredients] = React.useState<string[]>([]);
  const [allCreators, setAllCreators] = React.useState<string[]>([]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedIngredients, setSelectedIngredients] = React.useState<string[]>([]);
  const [selectedCreators, setSelectedCreators] = React.useState<string[]>([]);
  const [likeRange, setLikeRange] = React.useState<[number, number]>([0, 10000]);
  const [isPremiumChecked, setIsPremiumChecked] = React.useState(false);

  const debouncedValues = useDebounce({ searchTerm, selectedIngredients, selectedCreators, likeRange, isPremiumChecked }, 500);

  const { currentData: data, isLoading, isFetching } = useGetRecipesQuery({ 
    search: debouncedValues.searchTerm, 
    ingredients: debouncedValues.selectedIngredients, 
    creators: debouncedValues.selectedCreators, 
    likeRange: debouncedValues.likeRange, 
    isPremium: debouncedValues.isPremiumChecked 
  });

  const recipes = data?.recipes || [];

  // Initalize values
  useEffect(() => {
    if (data) {
      setLikeRange([data.lowest_likes, data.highest_likes]);
      setAllIngredients(data.all_ingredients);
      setAllCreators(data.all_creators);
    }
  }, [data]);

  return (
    <Stack height={'100%'} direction={'row'} gap={2} flexGrow={1}>
      {/* FILTERS */}
      <Stack sx={{ backgroundColor: '#143a11', width: '30%', height: '100%', p: 2, borderRadius: '5px' }} gap={3}>
        <Typography variant='h5' sx={{ padding: '20px' }}>
          Filters
        </Typography>
        <MultiSelectFilter label='By ingredient' options={allIngredients} onChange={(selected) => setSelectedIngredients(selected)} />  
        <MultiSelectFilter label='By creator' options={allCreators} onChange={(selected) => setSelectedCreators(selected)} />
        <CustomSlider label='By likes' min={data?.lowest_likes} max={data?.highest_likes} onChange={(value) => setLikeRange(value as [number, number])} />
        <Stack direction={'row'} alignItems={'center'} gap={1}>
          <Checkbox checked={isPremiumChecked} onChange={(e) => setIsPremiumChecked(e.target.checked)} />
          <Typography variant='body2'>Premium</Typography>
        </Stack>
      </Stack>
      {/* RESULTS + GENERAL SEARCH BAR */}
      <Stack gap={2} width={'100%'} height={'100%'}>
        <TextField fullWidth placeholder='Search for recipes...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Box sx={{ borderRadius: '5px', backgroundColor: '#a52121', width: '100%', height: '100%' }} >
          {isLoading || isFetching ? (
            <Typography variant='h6' color='white' align='center' paddingTop={5}>
              Loading recipes...
            </Typography>
          ) : (
            <Stack gap={2} padding={2} overflow={'auto'} height={'100%'}>
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  description={recipe.description}
                  image={recipe.image_url}
                />
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}

export default AdvancedRecipeSearch