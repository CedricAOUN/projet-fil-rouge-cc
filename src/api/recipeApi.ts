import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Recipe } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
    getRecipes: builder.query<Recipe[], string | undefined>({
      query: (search = '') => `?search=${encodeURIComponent(search)}`,
      transformResponse: (response: { data: Recipe[] }) => response.data,
    }),
    getRecipeById: builder.query<Recipe, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: { data: Recipe }) => response.data,
    }),
  }),
});

export const { useGetRecipesQuery, useGetRecipeByIdQuery } = recipeApi;
