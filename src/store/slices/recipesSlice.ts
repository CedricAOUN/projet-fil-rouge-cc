import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  cookingTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  authorId: string;
  createdAt: string;
  isPremium: boolean;
}

interface RecipesState {
  recipes: Recipe[];
  currentRecipe: Recipe | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filteredRecipes: Recipe[];
}

const initialState: RecipesState = {
  recipes: [],
  currentRecipe: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  filteredRecipes: [],
};

const recipesSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    fetchRecipesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRecipesSuccess: (state, action: PayloadAction<Recipe[]>) => {
      state.isLoading = false;
      state.recipes = action.payload;
      state.filteredRecipes = action.payload;
    },
    fetchRecipesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentRecipe: (state, action: PayloadAction<Recipe>) => {
      state.currentRecipe = action.payload;
    },
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    addRecipe: (state, action: PayloadAction<Recipe>) => {
      state.recipes.push(action.payload);
      state.filteredRecipes = state.recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    updateRecipe: (state, action: PayloadAction<Recipe>) => {
      const index = state.recipes.findIndex(
        (recipe) => recipe.id === action.payload.id
      );
      if (index !== -1) {
        state.recipes[index] = action.payload;
        state.filteredRecipes = state.recipes.filter((recipe) =>
          recipe.title.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
      }
    },
    deleteRecipe: (state, action: PayloadAction<string>) => {
      state.recipes = state.recipes.filter(
        (recipe) => recipe.id !== action.payload
      );
      state.filteredRecipes = state.recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredRecipes = state.recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchRecipesStart,
  fetchRecipesSuccess,
  fetchRecipesFailure,
  setCurrentRecipe,
  clearCurrentRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  setSearchQuery,
  clearError,
} = recipesSlice.actions;

export default recipesSlice.reducer;
