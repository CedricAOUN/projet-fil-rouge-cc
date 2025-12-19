import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import RecipeCard from '@/components/RecipeComponents/RecipeCard/RecipeCard';
import { Stack, TextField, Typography } from '@mui/material';
import { fetchRecipes } from '@/api/api';
import { debounce } from 'lodash';
import { setSearchQuery, useAppSelector } from '@/store';
import { useDispatch } from 'react-redux';

function RecipeSearch({ showSearch = true, headerSearchRef = null, maxHeight = '300px' }) {
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const containerRef = useRef(null);
  const searchTerm = useAppSelector((state) => state.recipes.searchQuery);
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const fetchRecipesCallback = useCallback(async (term) => {
    try {
      const recipes = await fetchRecipes(term);
      setFilteredRecipes(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setFilteredRecipes([]); // Reset to empty on error
    }
  }, []);

  const debouncedFetch = useMemo(
    () => debounce(fetchRecipesCallback, 300),
    [fetchRecipesCallback]
  );

  useEffect(() => {
    debouncedFetch(searchTerm);
    if (Boolean(searchTerm)) {
      searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      searchRef.current?.focus();
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      headerSearchRef?.current?.focus();
    }
    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchTerm, debouncedFetch]);

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
      <Stack gap={1} overflow={'auto'} maxHeight={maxHeight} padding={1}>
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.recipe_id}
            id={recipe.recipe_id}
            title={recipe.title}
            description={recipe.description}
            image={recipe.image_url}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default RecipeSearch;
