import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Recipe } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

interface RecipeResponse {
  recipes: Recipe[];
  total: number;
  highest_likes: number;
  lowest_likes: number;
  all_creators: string[];
  all_ingredients: string[];
}

type RecipeSearchParams = {
  search?: string;
  chefs?: string[];
  ingredients?: string[];
  likeRange?: [number, number];
  isPremium?: boolean;
};

export const recipeApi = createApi({
  reducerPath: 'recipeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/recipes`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRecipes: builder.query<RecipeResponse, RecipeSearchParams>({
      query: ({
        search = '',
        creators = [],
        ingredients = [],
        likeRange = [0, Number.MAX_SAFE_INTEGER],
        isPremium = false,
      }) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (creators.length) params.append('creators', creators.join(','));
        if (ingredients.length)
          params.append('ingredients', ingredients.join(','));
        if (likeRange) params.append('likeRange', likeRange.join(','));
        if (isPremium) params.append('isPremium', 'true');
        return `?${params.toString()}`;
      },
    }),
    getRecipeById: builder.query<Recipe, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: { data: Recipe }) => response.data,
    }),
  }),
});

export const { useGetRecipesQuery, useGetRecipeByIdQuery } = recipeApi;
