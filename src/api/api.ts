import { Recipe, Expert } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const recipesEndpoint = `${API_URL}/recipes`;
const expertsEndpoint = `${API_URL}/experts`;

export const fetchRecipes = async (query?: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(`${recipesEndpoint}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    if (query) {
      const recipes: Recipe[] = await response.json();
      return recipes.filter(
        (recipe: Recipe) =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase())
      );
    } else {
      return await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch recipes:', error);
    throw error;
  }
};

export const fetchExperts = async (): Promise<Expert[]> => {
  try {
    const response = await fetch(expertsEndpoint);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch experts:', error);
    throw error;
  }
};

export const fetchSingleExpert = async (id: string): Promise<Expert> => {
  try {
    const response = await fetch(`${expertsEndpoint}/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch expert with id ${id}:`, error);
    throw error;
  }
};

export const fetchSingleRecipe = async (id: string): Promise<Recipe> => {
  try {
    const response = await fetch(`${recipesEndpoint}/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch recipe with id ${id}:`, error);
    throw error;
  }
};
