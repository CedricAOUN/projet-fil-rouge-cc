import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Recipe } from '@/types';
import { deleteRecipe } from '@/store';
import { method } from 'lodash';

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
  creators?: string[];
  ingredients?: string[];
  likeRange?: [number, number];
  recipeType?: 'all' | 'premium' | 'free';
};

type Comment = {
  id: number;
  content: string;
  creator_id: number;
  recipe_id: number;
  created_at: string;
  updated_at: string;
};

type CreateRecipeFormData = {
  title: string;
  description?: string | null;
  instructions: string;
  duration?: number | null;
  image?: File | null;
  is_premium?: boolean;
  ingredients?: {
    name: string;
    amount: string;
    unit?: string;
  }[];
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
  tagTypes: ['Recipes'],
  endpoints: (builder) => ({
    getRecipes: builder.query<RecipeResponse, RecipeSearchParams>({
      query: ({
        search = '',
        creators = [],
        ingredients = [],
        likeRange = [0, Number.MAX_SAFE_INTEGER],
        recipeType = 'all',
      }) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (creators.length) params.append('creators', creators.join(','));
        if (ingredients.length)
          params.append('ingredients', ingredients.join(','));
        if (likeRange) params.append('likeRange', likeRange.join(','));
        if (recipeType) params.append('recipeType', recipeType);
        return `?${params.toString()}`;
      },
      providesTags: ['Recipes'],
    }),
    getRecipeById: builder.query<Recipe, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: { data: Recipe }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Recipes', id }],
    }),
    toggleLikeRecipe: builder.mutation<void, { recipeId: string }>({
      query: ({ recipeId }) => ({
        url: `/${recipeId}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { recipeId }) => [
        { type: 'Recipes', id: recipeId },
      ],
    }),
    toggleFavoriteRecipe: builder.mutation<void, { recipeId: string }>({
      query: ({ recipeId }) => ({
        url: `/${recipeId}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, { recipeId }) => [
        { type: 'Recipes', id: recipeId },
      ],
    }),
    addComment: builder.mutation<
      Comment,
      { recipeId: string; content: string }
    >({
      query: ({ recipeId, content }) => ({
        method: 'POST',
        url: `${API_URL}/comments/create`,
        body: { recipe_id: recipeId, content },
      }),
      invalidatesTags: (result, error, { recipeId }) => [
        { type: 'Recipes', id: recipeId },
      ],
    }),
    editComment: builder.mutation<
      Comment,
      { commentId: number; content: string }
    >({
      query: ({ commentId, content }) => ({
        method: 'PUT',
        url: `${API_URL}/comments/edit/${commentId}`,
        body: { content },
      }),
      invalidatesTags: (result) => [{ type: 'Recipes', id: result.recipe_id }],
    }),
    deleteComment: builder.mutation<
      void,
      { commentId: number; recipeId: string }
    >({
      query: ({ commentId, recipeId }) => ({
        method: 'DELETE',
        url: `${API_URL}/comments/delete/${commentId}`,
      }),
      invalidatesTags: (_result, _error, { recipeId }) => [
        { type: 'Recipes', id: recipeId },
      ],
    }),
    createRecipe: builder.mutation<Recipe, CreateRecipeFormData>({
      query: (data) => {
        const body = new FormData();
        body.append('title', data.title);
        body.append('description', data.description ?? '');
        body.append('instructions', data.instructions);
        body.append('is_premium', data.is_premium ? '1' : '0');

        data.ingredients?.forEach(({ name, amount, unit }, index) => {
          body.append(`ingredients[${index}][name]`, name);
          body.append(`ingredients[${index}][quantity]`, amount);
          body.append(`ingredients[${index}][unit]`, unit ?? '');
        });

        if (data.image) {
          body.append('image_file', data.image);
        }

        return {
          method: 'POST',
          url: `${API_URL}/recipes/create`,
          body,
        };
      },
      transformResponse: (response: { data: Recipe }) => response.data,
      invalidatesTags: ['Recipes'],
    }),
    editRecipe: builder.mutation<
      Recipe,
      { data: CreateRecipeFormData; id: string }
    >({
      query: ({ data, id }) => {
        const body = new FormData();
        body.append('title', data.title);
        body.append('description', data.description ?? '');
        body.append('instructions', data.instructions);
        body.append('is_premium', data.is_premium ? '1' : '0');

        data.ingredients?.forEach(({ name, amount, unit }, index) => {
          body.append(`ingredients[${index}][name]`, name);
          body.append(`ingredients[${index}][quantity]`, amount);
          body.append(`ingredients[${index}][unit]`, unit ?? '');
        });

        if (data.image) {
          body.append('image_file', data.image);
        }

        return {
          method: 'PUT',
          url: `${API_URL}/recipes/edit/${id}`,
          body,
        };
      },
      transformResponse: (response: { data: Recipe }) => response.data,
      invalidatesTags: ['Recipes'],
    }),
    deleteRecipe: builder.mutation<void, string>({
      query: (id) => {
        return {
          method: 'DELETE',
          url: `${API_URL}/recipes/delete/${id}`,
        };
      },
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useToggleLikeRecipeMutation,
  useToggleFavoriteRecipeMutation,
  useAddCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useCreateRecipeMutation,
  useEditRecipeMutation,
  useDeleteRecipeMutation,
} = recipeApi;
