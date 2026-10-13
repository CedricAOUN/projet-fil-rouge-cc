import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Course } from '@/api/api.types';
import { API_URL } from '@/api/config';

export const courseApi = createApi({
  reducerPath: 'courseApi',
  tagTypes: ['Courses'],
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
      query: (id) => `${id}`,
      transformResponse: (response: { data: Course }) => response.data,
    }),
    getCoursesByExpertId: builder.query<Course[], { expertId: string; language: 'en' | 'fr' }>({
      query: ({ expertId, language }) => `?${new URLSearchParams({ creator_id: expertId, language })}`,
      transformResponse: (response: { data: Course[] }) => response.data,
      providesTags: (_result, _error, { expertId }) => [
        { type: 'Courses', id: `EXPERT-${expertId}` },
      ],
    }),
    getCourses: builder.query<Course[], { query: string; language?: 'en' | 'fr' }>({
      query: ({ query, language }) => `list?${new URLSearchParams({ search: query, ...(language && { language }) })}`,
      transformResponse: (response: { data: Course[] }) => response.data,
      providesTags: ['Courses'],
    }),
    createCourse: builder.mutation<
      Course,
      { title: string; language: string; content?: string; video?: File }
    >({
      query: ({ title, language, content, video }) => {
        const body = new FormData();
        body.append('title', title);
        body.append('language', language);

        if (content) {
          body.append('content', content);
        }

        if (video) {
          body.append('video', video);
        }

        return {
          method: 'POST',
          url: 'create',
          body,
        };
      },
      transformResponse: (res: { data: Course }) => res.data,
      invalidatesTags: ['Courses'],
    }),
    editCourse: builder.mutation<
      Course,
      { title: string; language: string; content?: string; video?: File; id: number }
    >({
      query: ({ title, language, content, video, id }) => {
        const body = new FormData();
        body.append('_method', 'PUT');
        body.append('title', title);
        body.append('language', language);

        if (content) {
          body.append('content', content);
        }

        if (video) {
          body.append('video', video);
        }

        return {
          method: 'POST',
          url: `edit/${id}`,
          body,
        };
      },
      transformResponse: (res: { data: Course }) => res.data,
      invalidatesTags: ['Courses'],
    }),
    deleteCourse: builder.mutation<void, { id: number }>({
      query: ({ id }) => {
        return {
          method: 'DELETE',
          url: `delete/${id}`,
        };
      },
      invalidatesTags: ['Courses'],
    }),
  }),
});

export const {
  useGetCourseByIdQuery,
  useGetCoursesByExpertIdQuery,
  useGetCoursesQuery,
  useCreateCourseMutation,
  useEditCourseMutation,
  useDeleteCourseMutation,
} = courseApi;
