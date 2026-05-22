import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Course } from '@/api/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const courseApi = createApi({
  reducerPath: 'courseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/courses`,
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
    getCourseById: builder.query<Course, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: { data: Course }) => response.data,
    }),
    getCoursesByExpertId: builder.query<Course[], string>({
      query: (expertId) => `?created_by_expert_id=${expertId}`,
      transformResponse: (response: { data: Course[] }) => response.data,
    }),
  }),
});

export const { useGetCourseByIdQuery, useGetCoursesByExpertIdQuery } =
  courseApi;
