import { useState } from 'react';
import { MOCK_RECIPES } from '../../../api/mockApi';
import RecipeCard from '../RecipeCard/RecipeCard';
import { Stack, TextField, Typography } from '@mui/material';

function RecipeSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState(MOCK_RECIPES);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = MOCK_RECIPES.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term)
    );
    setFilteredRecipes(filtered);
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
