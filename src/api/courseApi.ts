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
    getCoursesByExpertId: builder.query<Course[], string>({
      query: (expertId) => `?creator_id=${expertId}`,
      transformResponse: (response: { data: Course[] }) => response.data,
      providesTags: (_result, _error, expertId) => [
        { type: 'Courses', id: `EXPERT-${expertId}` },
      ],
    }),
    getCourses: builder.query<Course[], { query: string }>({
      query: ({ query }) => `list?search=${query}`,
      transformResponse: (response: { data: Course[] }) => response.data,
      providesTags: ['Courses'],
    }),
    createCourse: builder.mutation<
      Course,
      { title: string; content?: string; video?: File }
    >({
      query: ({ title, content, video }) => {
        const body = new FormData();
        body.append('title', title);

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
      { title: string; content?: string; video?: File; id: number }
    >({
      query: ({ title, content, video, id }) => {
        const body = new FormData();
        body.append('title', title);

        if (content) {
          body.append('content', content);
        }

        if (video) {
          body.append('video', video);
        }

        return {
          method: 'PUT',
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
