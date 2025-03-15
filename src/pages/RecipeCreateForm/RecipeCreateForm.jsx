import React, { useState } from 'react';
import { Button, Input, Paper, Stack, TextareaAutosize, Typography } from '@mui/material';
import UnitSelector from '../../components/UnitSelector/UnitSelector';

function RecipeCreateForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [image, setImage] = useState(null);
  const [ingredients, setIngredients] = useState([{ id: 1, name: '', amount: '', unit: '' }]); // Start with one field
  const [ingredientId, setIngredientId] = useState(2); // Next available ID

  // Handle ingredient changes
  const handleIngredientChange = (index, field, value) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient, i) =>
        i === index ? { ...ingredient, [field]: value } : ingredient
      )
    );
  };

  // Add a new ingredient
  const addIngredient = () => {
    setIngredients([...ingredients, { id: ingredientId, name: '', amount: '', unit: '' }]);
    setIngredientId(ingredientId + 1); // Increment ID for the next ingredient
  };

  // Remove an ingredient
  const removeIngredient = (id) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  // Submit handler (logs form data)
  const handleSubmit = () => {
    const recipeData = { title, description, duration, ingredients, image };
    console.log('Recipe Data:', recipeData);
  };

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Typography variant='h4'>General</Typography>
      <Input placeholder="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextareaAutosize placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} minRows={4} />
      <Stack direction='row' gap={1} alignItems={'center'}>
        <Input placeholder="Duration (e.g., 30 min)" type='number' value={duration} onChange={(e) => setDuration(e.target.value)} />
        <Typography variant='subtitle2'>Minutes</Typography>
      </Stack>
      <Input placeholder="Image" required type='file' accept="image/png, image/jpeg, image/webp" value={image} onChange={(e) => setImage(e.target.value)} />

      <Typography variant='h4'>Ingredients</Typography>

      {ingredients.map((ingredient, index) => (
        <Stack key={ingredient.id} direction="row" spacing={1} alignItems="center">
          <Input
            placeholder="Ingredient Name"
            value={ingredient.name}
            onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
            fullWidth
          />
          <Input
            placeholder="Amount"
            type="number"
            value={ingredient.amount}
            onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
          />
          <UnitSelector onUnitChange={(unit) => handleIngredientChange(index, 'unit', unit)} />
          {ingredients.length > 1 && (
            <Button variant="outlined" color="error" onClick={() => removeIngredient(ingredient.id)}>
              X
            </Button>
          )}
        </Stack>
      ))}
      <Button variant="contained" onClick={addIngredient} sx={{ fontSize: '20px', width: '30px', margin: '0 auto' }}>
        +
      </Button>

      <Typography variant='h4'>Instructions</Typography>
      <TextareaAutosize placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} minRows={5} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit Recipe
      </Button>
    </Paper>
  );
}

export default RecipeCreateForm;
