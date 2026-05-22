import { useAppSelector, useAppDispatch } from '@/store';
import {
  fetchRecipesStart,
  fetchRecipesSuccess,
  fetchRecipesFailure,
  setCurrentRecipe,
  clearCurrentRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  setSearchQuery,
} from '@/store/slices/recipesSlice';

// Recipes-related hooks
export const useRecipes = () => {
  const dispatch = useAppDispatch();
  const {
    recipes,
    currentRecipe,
    isLoading,
    error,
    searchQuery,
    filteredRecipes,
  } = useAppSelector((state) => state.recipes);

  const fetchRecipes = async () => {
    dispatch(fetchRecipesStart());
    try {
      // Replace with your actual API call
      const response = await fetch('/api/recipes');
      if (response.ok) {
        const recipes = await response.json();
        dispatch(fetchRecipesSuccess(recipes));
      } else {
        dispatch(fetchRecipesFailure('Failed to fetch recipes'));
      }
    } catch (error) {
      dispatch(fetchRecipesFailure('Network error'));
    }
  };

  const selectRecipe = (recipe: any) => {
    dispatch(setCurrentRecipe(recipe));
  };

  const clearSelectedRecipe = () => {
    dispatch(clearCurrentRecipe());
  };

  const createRecipe = (recipe: any) => {
    dispatch(addRecipe(recipe));
  };

  const editRecipe = (recipe: any) => {
    dispatch(updateRecipe(recipe));
  };

  const removeRecipe = (recipeId: string) => {
    dispatch(deleteRecipe(recipeId));
  };

  const searchRecipes = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  return {
    recipes,
    currentRecipe,
    isLoading,
    error,
    searchQuery,
    filteredRecipes,
    fetchRecipes,
    selectRecipe,
    clearSelectedRecipe,
    createRecipe,
    editRecipe,
    removeRecipe,
    searchRecipes,
  };
};
