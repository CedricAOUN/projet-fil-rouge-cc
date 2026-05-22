import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}`,
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
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: { data: User }) => response.data,
    }),
  }),
});

export const { useGetUserByIdQuery } = userApi;
