import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  biography: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  is_expert: boolean;
  premium_expire: string | null;
  created_at: string;
  updated_at: string;
  data?: AuthUser; // For nested user data in responses
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
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
    }),
    subscriptionStatus: builder.query<
      SubscriptionStatusResponse,
      { userId: string }
    >({
      query: ({ userId }) => ({
        url: `/subscription/${userId}`,
        method: 'GET',
      }),
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
  useSubscriptionStatusQuery,
  useCheckoutMutation,
} = authApi;
