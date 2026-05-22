import { useState, useEffect, useRef } from 'react';
import RecipeCard from '@/components/RecipeComponents/RecipeCard/RecipeCard';
import { CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { setSearchQuery, useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';
import { useGetRecipesQuery } from '@/api/recipeApi';

function RecipeSearch({ showSearch = true, headerSearchRef = null, maxHeight = '300px' }) {
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const containerRef = useRef(null);
  const searchTerm = useAppSelector((state) => state.recipes.searchQuery);
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data: filteredRecipes = [], isLoading, isFetching } = useGetRecipesQuery(debouncedTerm);

  useEffect(() => {
    if (Boolean(searchTerm)) {
      searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchRef.current?.focus();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      headerSearchRef?.current?.focus();
    }
  }, [searchTerm]);

  const handleSearch = (event) => {
    dispatch(setSearchQuery(event.target.value));
  };

  return (
    <Stack ref={containerRef} gap={1} padding={2} border={'1px solid #ccc'} borderRadius={2} bgcolor={(theme) => theme.palette.background.paper}>
      <>
        <Typography variant='h5' marginBottom={2}>
          Find a recipe
        </Typography>
        <TextField inputRef={searchRef} value={searchTerm} onChange={handleSearch} />
      </>
      {(isLoading || isFetching) && <Stack direction={'row'} justifyContent={'center'} p={3}><CircularProgress size={'50px'} /></Stack>}
      {!(isLoading || isFetching) && (
        <Stack gap={1} overflow={'auto'} maxHeight={maxHeight} padding={1}>
          {filteredRecipes.map((recipe) => (
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
    </Stack>
  );
}

export default RecipeSearch;
