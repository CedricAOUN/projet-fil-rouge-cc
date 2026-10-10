import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import RecipeCard from '@/components/RecipeComponents/RecipeCard/RecipeCard';
import { CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { setSearchQuery, useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { useGetRecipesQuery } from '@/api/recipeApi';
import useDebounce from '@/utils/useDebounce';
import RecipeGrid from '../RecipeGrid';

function RecipeSearch({
  showSearch = true,
  headerSearchRef = null,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const containerRef = useRef(null);
  const searchTerm = useAppSelector((state) => state.recipes.searchQuery);

  const debouncedTerm = useDebounce(searchTerm, 500);

  const { currentData, isLoading, isFetching } = useGetRecipesQuery({
    search: debouncedTerm,
  });

  const filteredRecipes = currentData?.recipes;

  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    if (searchTerm) {
      searchRef.current?.scrollIntoView({
        behavior,
        block: 'center',
      });
      searchRef.current?.focus();
    } else {
      window.scrollTo({ top: 0, behavior });
      headerSearchRef?.current?.focus();
    }
  }, [headerSearchRef, searchTerm]);

  const handleSearch = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  return (
    <Stack
      ref={containerRef}
      gap={3}
    >
      {showSearch && (
        <>
          <Typography variant='h5' component='h3' marginBottom={2}>{t("Refine your search")}</Typography>
          <TextField
            slotProps={{ htmlInput: { 'aria-label': t('Search recipes') } }}
            inputRef={searchRef}
            value={searchTerm}
            onChange={handleSearch}
          />
        </>
      )}
      {(isLoading || isFetching) && (
        <Stack direction={'row'} justifyContent={'center'} p={3}>
          <CircularProgress size={'50px'} />
        </Stack>
      )}
      {!(isLoading || isFetching) && (
        <RecipeGrid>
          {filteredRecipes?.map((recipe) => (
            <RecipeCard
              headingLevel='h3'
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              description={recipe.description}
              image={recipe.image_url}
              isPremium={recipe.is_premium}
            />
          ))}
          {filteredRecipes?.length === 0 && <Typography color='text.secondary' sx={{ gridColumn: '1 / -1' }}>{t('No recipes match your search. Please try something else !')}</Typography>}
        </RecipeGrid>
      )}
    </Stack>
  );
}

export default RecipeSearch;
