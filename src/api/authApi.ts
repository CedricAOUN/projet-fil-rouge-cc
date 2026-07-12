import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  biography: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  is_chef: boolean;
  premium_expire: string | null;
  created_at: string;
  updated_at: string;
  data?: AuthUser; // For nested user data in responses
  errors?: Record<string, string[]>; // For validation errors
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  access_token: string;
  token_type: string;
}

export interface SubscriptionStatusResponse {
  is_subscribed: boolean;
  subscription: {
    type: string;
    stripe_status: string;
    stripe_price: string;
    quantity: number;
    trial_ends_at: string | null;
    ends_at: string | null;
    current_period_end: string;
  };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/users`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['SelfUser', 'User'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
    updateProfile: builder.mutation<
      AuthUser,
      { userId: number; profileData: FormData }
    >({
      query: ({ userId, profileData }) => ({
        url: `edit/${userId}`,
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        'SelfUser',
        { type: 'User', id: String(userId) },
      ],
    }),
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
      providesTags: ['SelfUser'],
      transformResponse: (response: { data: AuthUser }) => response.data,
    }),
    getUserById: builder.query<AuthUser, string>({
      query: (id) => `/${id}`,
      transformResponse: (response: { data: AuthUser }) => response.data,
      providesTags: (result, error, id) => [{ type: 'User', id: String(id) }],
    }),
    checkout: builder.mutation<
      { checkout_url: string },
      { product: string; interval: string }
    >({
      query: (checkoutData) => ({
        url: `${API_URL}/checkout`, // full absolute path, bypasses authApi's /users baseUrl
        method: 'POST',
        body: checkoutData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useCheckoutMutation,
} = authApi;
