import { useTranslation } from 'react-i18next';
import {
  CircularProgress,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef } from 'react';
import MultiSelectFilter from './MultiSelectFilter';
import { useGetRecipesQuery } from '@/api/recipeApi';
import RecipeCard from '../RecipeComponents/RecipeCard/RecipeCard';
import CustomSlider from './CustomSlider';
import useDebounce from '@/utils/useDebounce';
import ContentPanel from '@/components/Layout/ContentPanel';
import RecipeGrid from '@/components/RecipeComponents/RecipeGrid';

const AdvancedRecipeSearch = () => {
  const { t } = useTranslation();

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

  const { data, isLoading, isFetching } = useGetRecipesQuery({
    search: debouncedValues.searchTerm,
    ingredients: debouncedValues.selectedIngredients,
    creators: debouncedValues.selectedCreators,
    likeRange: debouncedValues.likeRange,
    recipeType: debouncedValues.recipeType,
  });

  const recipes = data?.recipes || [];

  const initialized = useRef(false);

  // Initialize values once when data is first ready
  useEffect(() => {
    if (!initialized.current && data) {
      initialized.current = true;
      setLikeRange([data.lowest_likes, data.highest_likes]);
      setAllIngredients(data.all_ingredients);
      setAllCreators(data.all_creators);
    }
  }, [data]);

  return (
    <>
      <Typography variant='h1' gutterBottom>{t("Recipes")}</Typography>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        gap={4}
        alignItems='flex-start'
      >
        {/* FILTERS */}
        <ContentPanel
          sx={{
            width: { xs: '100%', lg: 280 },
            flexShrink: 0,
            p: 3,
          }}
          variant='outlined'
        >
          <Stack
            sx={{
              width: '100%',
              height: '100%',
              minHeight: 0,
            }}
            gap={3}
          >
            <Typography variant='h5' component='h2'>{t("Filters")}</Typography>
            <MultiSelectFilter
              label={t("By ingredient")}
              options={allIngredients}
              onChange={(selected) => setSelectedIngredients(selected)}
            />
            <MultiSelectFilter
              label={t("By creator")}
              options={allCreators}
              onChange={(selected) => setSelectedCreators(selected)}
            />
            {isLoading ? (
              <Stack direction={'row'} justifyContent={'center'} p={3}>
                <CircularProgress size={'50px'} />
              </Stack>
            ) : (
              <CustomSlider
                label={t("By likes")}
                min={data?.lowest_likes || 0}
                max={data?.highest_likes || 10000}
                onChange={(value) => setLikeRange(value as [number, number])}
              />
            )}
            <Stack
              direction={'row'}
              alignItems={'center'}
              gap={1}
              justifyContent={'center'}
            >
              <ToggleButtonGroup
                value={recipeType}
                exclusive
                onChange={(_, newValue) => { if (newValue) setRecipeType(newValue); }}
              >
                <ToggleButton value={'all'}>{t("All")}</ToggleButton>
                <ToggleButton value={'premium'}>{t("Premium")}</ToggleButton>
                <ToggleButton value={'free'}>{t("Free")}</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        </ContentPanel>
        {/* RESULTS + GENERAL SEARCH BAR */}
        <Stack
          gap={2}
          width={'100%'}
          height={'100%'}
          minHeight={0}
          minWidth={0}
        >
          <Stack direction={'row'} alignItems={'center'} gap={2} flexShrink={0}>
            <TextField
              fullWidth
              slotProps={{ htmlInput: { 'aria-label': t('Search recipes') } }}
              placeholder={t("Search for recipes...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Stack>
            {isLoading || isFetching ? (
              <Stack direction={'row'} justifyContent={'center'} p={3}>
                <CircularProgress size={'50px'} />
              </Stack>
            ) : (
              <RecipeGrid>
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
                {recipes?.length == 0 && (
                  <Typography color='text.secondary' sx={{ gridColumn: '1 / -1' }}>{t("No recipes match your search. Please try something else !")}</Typography>
                )}
              </RecipeGrid>
            )}
        </Stack>
      </Stack>
    </>
  );
};

export default AdvancedRecipeSearch;
