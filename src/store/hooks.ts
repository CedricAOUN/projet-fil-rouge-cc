import { useAppSelector, useAppDispatch } from '@/store';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUser,
} from '@/store/slices/userSlice';
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

// User-related hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.user
  );

  const login = async (email: string, password: string) => {
    dispatch(loginStart());
    try {
      // Replace with your actual login API call
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        dispatch(loginSuccess(user));
      } else {
        dispatch(loginFailure('Login failed'));
      }
    } catch (error) {
      dispatch(loginFailure('Network error'));
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const updateUserProfile = (userData: any) => {
    dispatch(updateUser(userData));
  };

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: logoutUser,
    updateProfile: updateUserProfile,
  };
};

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
