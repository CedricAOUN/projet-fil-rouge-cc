import { useState, useEffect, useCallback, useMemo } from 'react';
import RecipeCard from '@/components/RecipeComponents/RecipeCard/RecipeCard';
import { Stack, TextField, Typography } from '@mui/material';
import { fetchRecipes } from '@/api/api';
import { debounce } from 'lodash';

function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
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
    // Cleanup function to cancel pending debounced calls
    return () => {
      debouncedFetch.cancel();
    };
  }, [searchTerm, debouncedFetch]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Stack gap={1} padding={2} border={'1px solid #ccc'} borderRadius={1}>
      <Typography variant='h5' marginBottom={2}>
        Find a recipe
      </Typography>
      <TextField value={searchTerm} onChange={handleSearch} />
      <Stack gap={1} overflow={'auto'} maxHeight={300} padding={1}>
        {filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            title={recipe.title}
            description={recipe.description}
            image={recipe.img_url}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default RecipeSearch;
