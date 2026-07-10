import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import MultiSelectFilter from './MultiSelectFilter';
import { useGetRecipesQuery } from '@/api/recipeApi';
import RecipeCard from '../RecipeComponents/RecipeCard/RecipeCard';
import RatingSlider from './CustomSlider';
import CustomSlider from './CustomSlider';
import useDebounce from '@/utils/useDebounce';

const AdvancedRecipeSearch = () => {
  const [allIngredients, setAllIngredients] = React.useState<string[]>([]);
  const [allCreators, setAllCreators] = React.useState<string[]>([]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedIngredients, setSelectedIngredients] = React.useState<
    string[]
  >([]);
  const [selectedCreators, setSelectedCreators] = React.useState<string[]>([]);
  const [likeRange, setLikeRange] = React.useState<[number, number]>([
    0, 10000,
  ]);
  const [recipeType, setRecipeType] = React.useState<
    'all' | 'premium' | 'free'
  >('all');

  const debouncedValues = useDebounce(
    {
      searchTerm,
      selectedIngredients,
      selectedCreators,
      likeRange,
      recipeType,
    },
    500,
  );

  const {
    currentData: data,
    isLoading,
    isFetching,
  } = useGetRecipesQuery({
    search: debouncedValues.searchTerm,
    ingredients: debouncedValues.selectedIngredients,
    creators: debouncedValues.selectedCreators,
    likeRange: debouncedValues.likeRange,
    recipeType: debouncedValues.recipeType,
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
      <Paper sx={{ width: '30%' }} variant='outlined'>
        <Stack
          sx={{
            width: '100%',
            height: '100%',
          }}
          gap={3}
        >
          <Typography variant='h5' sx={{ padding: '20px' }}>
            Filters
          </Typography>
          <MultiSelectFilter
            label='By ingredient'
            options={allIngredients}
            onChange={(selected) => setSelectedIngredients(selected)}
          />
          <MultiSelectFilter
            label='By creator'
            options={allCreators}
            onChange={(selected) => setSelectedCreators(selected)}
          />
          <CustomSlider
            label='By likes'
            min={data?.lowest_likes}
            max={data?.highest_likes}
            onChange={(value) => setLikeRange(value as [number, number])}
          />
          <Stack
            direction={'row'}
            alignItems={'center'}
            gap={1}
            justifyContent={'center'}
            paddingX={2}
          >
            <ToggleButtonGroup
              value={recipeType}
              exclusive
              onChange={(_, newValue) => setRecipeType(newValue)}
            >
              <ToggleButton value={'all'}>All</ToggleButton>
              <ToggleButton value={'premium'}>Premium</ToggleButton>
              <ToggleButton value={'free'}>Free</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Stack>
      </Paper>
      {/* RESULTS + GENERAL SEARCH BAR */}
      <Stack gap={2} width={'100%'} height={'100%'}>
        <TextField
          fullWidth
          placeholder='Search for recipes...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Paper variant='outlined' sx={{ flexGrow: 1, height: '100%' }}>
          {isLoading || isFetching ? (
            <Stack direction={'row'} justifyContent={'center'} p={3}>
              <CircularProgress size={'50px'} />
            </Stack>
          ) : (
            <Stack gap={2} padding={2} overflow={'auto'} height={'100%'}>
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  id={recipe.id}
                  title={recipe.title}
                  description={recipe.description}
                  image={recipe.image_url}
                  isPremium={recipe.is_premium}
                />
              ))}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Stack>
  );
};

export default AdvancedRecipeSearch;
